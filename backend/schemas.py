from pydantic import BaseModel, EmailStr, field_validator
from datetime import date, datetime
from typing import Optional
from enum import Enum

class AttendanceStatus(str, Enum):
    present = "Present"
    absent = "Absent"

# ── Employee Schemas ──────────────────────────────────────────────────────────

class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

    @field_validator("employee_id")
    @classmethod
    def validate_employee_id(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("Employee ID cannot be empty")
        return v

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("Full name cannot be empty")
        return v

    @field_validator("department")
    @classmethod
    def validate_department(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("Department cannot be empty")
        return v

class EmployeeOut(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Attendance Schemas ────────────────────────────────────────────────────────

class AttendanceCreate(BaseModel):
    employee_id: str
    date: date
    status: AttendanceStatus

class AttendanceOut(BaseModel):
    id: int
    employee_db_id: int
    date: date
    status: AttendanceStatus

    class Config:
        from_attributes = True
