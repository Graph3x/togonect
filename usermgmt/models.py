from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from database import Base
from sqlalchemy.orm import relationship


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

    friends = relationship("Friend", back_populates="user")


class Friend(Base):

    __tablename__ = 'friends'

    user_id = Column(Integer, ForeignKey(User.id), primary_key=True)
    friend_id = Column(Integer, primary_key=True)

    user = relationship("User", back_populates="friends")


class Frequest(Base):

    __tablename__ = 'frequests'

    id = Column(Integer, primary_key=True, index=True)
    sender = Column(Integer, unique=False, nullable=False)
    recipient = Column(Integer, unique=False, nullable=False)
    status = Column(String, unique=False, nullable=False)
