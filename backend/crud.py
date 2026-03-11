from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from typing import Optional
import models, schemas


# ── Employee CRUD ─────────────────────────────────────────────────────────────

def get_employee_by_emp_id(db: Session, employee_id: str):
    return db.query(models.Employee).filter(models.Employee.employee_id == employee_id).first()

def get_employee_by_email(db: Session, email: str):
    return db.query(models.Employee).filter(models.Employee.email == email).first()

def get_all_employees(db: Session):
    return db.query(models.Employee).order_by(models.Employee.created_at.desc()).all()

def create_employee(db: Session, employee: schemas.EmployeeCreate):
    db_emp = models.Employee(**employee.model_dump())
    db.add(db_emp)
    db.commit()
    db.refresh(db_emp)
    return db_emp

def delete_employee(db: Session, employee: models.Employee):
    db.delete(employee)
    db.commit()


# ── Attendance CRUD ───────────────────────────────────────────────────────────

def get_attendance_by_date(db: Session, employee_db_id: int, att_date: date):
    return db.query(models.Attendance).filter(
        models.Attendance.employee_db_id == employee_db_id,
        models.Attendance.date == att_date
    ).first()

def create_attendance(db: Session, employee_db_id: int, record: schemas.AttendanceCreate):
    db_att = models.Attendance(
        employee_db_id=employee_db_id,
        date=record.date,
        status=record.status
    )
    db.add(db_att)
    db.commit()
    db.refresh(db_att)
    return db_att

def update_attendance(db: Session, existing: models.Attendance, status: schemas.AttendanceStatus):
    existing.status = status
    db.commit()
    db.refresh(existing)
    return existing

def get_attendance(db: Session, employee_db_id: int, from_date: Optional[date], to_date: Optional[date]):
    query = db.query(models.Attendance).filter(models.Attendance.employee_db_id == employee_db_id)
    if from_date:
        query = query.filter(models.Attendance.date >= from_date)
    if to_date:
        query = query.filter(models.Attendance.date <= to_date)
    return query.order_by(models.Attendance.date.desc()).all()


# ── Dashboard ─────────────────────────────────────────────────────────────────

def get_summary(db: Session):
    total_employees = db.query(models.Employee).count()
    total_present_today = db.query(models.Attendance).filter(
        models.Attendance.date == date.today(),
        models.Attendance.status == models.AttendanceStatus.present
    ).count()
    total_absent_today = db.query(models.Attendance).filter(
        models.Attendance.date == date.today(),
        models.Attendance.status == models.AttendanceStatus.absent
    ).count()
    total_attendance_records = db.query(models.Attendance).count()

    # Per-employee present count
    per_employee = db.query(
        models.Employee.employee_id,
        models.Employee.full_name,
        models.Employee.department,
        func.count(models.Attendance.id).label("present_days")
    ).outerjoin(
        models.Attendance,
        (models.Employee.id == models.Attendance.employee_db_id) &
        (models.Attendance.status == models.AttendanceStatus.present)
    ).group_by(models.Employee.id).all()

    return {
        "total_employees": total_employees,
        "present_today": total_present_today,
        "absent_today": total_absent_today,
        "total_attendance_records": total_attendance_records,
        "employee_summary": [
            {
                "employee_id": row.employee_id,
                "full_name": row.full_name,
                "department": row.department,
                "present_days": row.present_days
            }
            for row in per_employee
        ]
    }
