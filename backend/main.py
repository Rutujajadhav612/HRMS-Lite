from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
import models, schemas, crud
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Employee Routes ──────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "HRMS Lite API is running"}

@app.post("/employees", response_model=schemas.EmployeeOut, status_code=201, tags=["Employees"])
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    if crud.get_employee_by_emp_id(db, employee.employee_id):
        raise HTTPException(status_code=409, detail=f"Employee ID '{employee.employee_id}' already exists")
    if crud.get_employee_by_email(db, employee.email):
        raise HTTPException(status_code=409, detail=f"Email '{employee.email}' is already registered")
    return crud.create_employee(db, employee)

@app.get("/employees", response_model=List[schemas.EmployeeOut], tags=["Employees"])
def list_employees(db: Session = Depends(get_db)):
    return crud.get_all_employees(db)

@app.get("/employees/{employee_id}", response_model=schemas.EmployeeOut, tags=["Employees"])
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    emp = crud.get_employee_by_emp_id(db, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp

@app.delete("/employees/{employee_id}", tags=["Employees"])
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    emp = crud.get_employee_by_emp_id(db, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    crud.delete_employee(db, emp)
    return {"message": f"Employee '{employee_id}' deleted successfully"}


# ── Attendance Routes ────────────────────────────────────────────────────────

@app.post("/attendance", response_model=schemas.AttendanceOut, status_code=201, tags=["Attendance"])
def mark_attendance(record: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    emp = crud.get_employee_by_emp_id(db, record.employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    existing = crud.get_attendance_by_date(db, emp.id, record.date)
    if existing:
        # Update existing record
        return crud.update_attendance(db, existing, record.status)
    return crud.create_attendance(db, emp.id, record)

@app.get("/attendance/{employee_id}", response_model=List[schemas.AttendanceOut], tags=["Attendance"])
def get_attendance(
    employee_id: str,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    emp = crud.get_employee_by_emp_id(db, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return crud.get_attendance(db, emp.id, from_date, to_date)

@app.get("/dashboard/summary", tags=["Dashboard"])
def dashboard_summary(db: Session = Depends(get_db)):
    return crud.get_summary(db)
