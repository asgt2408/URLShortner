from fastapi import APIRouter, HTTPException,Depends
from database import engine, SessionLocal
from models import Base,URL
from pydantic import BaseModel
import string,secrets

from sqlalchemy.orm import Session

router = APIRouter()

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/url_shorten")
def urlshorten(url_code : str, db: Session = Depends(get_db)):

    data = db.query(URL).filter(URL.url==url_code).first()

    letters = string.ascii_letters + string.digits
    s = ''.join(secrets.choice(letters) for _ in range(8))

    if data:
        return{
            "code":data.code
        }
    
    new_data = URL(
        code = s,
        url = url_code
    )

    db.add(new_data)
    db.commit()

    return {
        "Code":s
    }

