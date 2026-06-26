from sqlalchemy import String, Integer, Column
from database import Base

class URL(Base):
    __tablename__ = "url"

    id = Column(Integer,primary_key=True, index=False)
    code = Column(String(100),nullable=False)
    url = Column(String(500),nullable=False)