from fastapi import APIRouter, Depends, HTTPException
from database import SessionLocal
from models import Base, URL
from sqlalchemy.orm import Session

router = APIRouter()

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/decode_url")
def decode(code : str, db : Session= Depends(get_db)):

    data = db.query(URL).filter(code==URL.code).first()

    if not data:
        raise HTTPException(
            status_code=409,
            detail="URL not found"
        )
    
    return {
        "URL": data.url
    }