from sqlalchemy import Table
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from database import Base
from sqlalchemy.orm import relationship


usergames = Table('user_games', Base.metadata,
                  Column('user_id', Integer, ForeignKey(
                      "users.id"), primary_key=True),
                  Column('game_id', Integer, ForeignKey(
                      "games.id"), primary_key=True)
                  )


class Game(Base):

    __tablename__ = 'games'

    id = Column(Integer, primary_key=True, index=True)
    cover = Column(String, unique=False, nullable=True)
    name = Column(String, unique=False, nullable=True)

    users = relationship("User", back_populates="games",
                         secondary='user_games')


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
    games = relationship("Game", back_populates="users",
                         secondary='user_games')


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
