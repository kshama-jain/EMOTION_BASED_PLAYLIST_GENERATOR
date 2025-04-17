from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.config import SessionLocal
from app.models.schema import User
from passlib.context import CryptContext
from jose import jwt
from pydantic import BaseModel, EmailStr

SECRET_KEY = "your_secret_key"  # Replace with a secure value in production
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class EmailUpdate(BaseModel):
    email: EmailStr

@router.post("/auth/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter((User.username == user.username) | (User.email == user.email)).first():
        raise HTTPException(status_code=400, detail="Username or email already registered")
    hashed_pw = pwd_context.hash(user.password)
    db_user = User(username=user.username, email=user.email, password_hash=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"msg": "User created successfully"}

@router.post("/auth/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found. Please sign up first.")
    if not pwd_context.verify(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect password. Please try again.")
    token = jwt.encode({"user_id": db_user.id}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

@router.get("/auth/me")
def get_me(token: str = Header(...), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {"username": user.username, "email": user.email}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.put("/auth/email")
def update_email(data: EmailUpdate, token: str = Header(...), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        # Check if new email is already taken
        if db.query(User).filter(User.email == data.email, User.id != user_id).first():
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = data.email
        db.commit()
        return {"msg": "Email updated successfully"}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token or update failed")

@router.delete("/auth/delete")
def delete_account(token: str = Header(...), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        db.delete(user)
        db.commit()
        return {"msg": "Account and playlists deleted successfully"}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token or deletion failed")
