from sqlalchemy import Column, Integer, String, Boolean
from database import Base


class User(Base):

    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False, unique=True, index=True)
    gtoken = Column(String, nullable=True)
    token = Column(String, nullable=False)
    token_expiration = Column(Integer, default=30, nullable=False)

    username = Column(String, unique=False, nullable=False)
    is_active = Column(Boolean(), default=False)
    profile_picture = Column(String, nullable=True)
