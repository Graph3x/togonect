from datetime import datetime
from pydantic import BaseModel


class CreateInvite(BaseModel):
    game_id: int
    time: datetime = None
    slots: int = None


class Game(BaseModel):
    id: int
    cover: str = 'nocover'
    name: str

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    username: str
    profile_picture: str

    class Config:
        orm_mode = True


class InviteUser(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True


class Invite(CreateInvite):
    id: int
    author_id: int
    users: list[InviteUser]

    class Config:
        orm_mode = True


class UserCreate(UserBase):
    email: str
    token: str
    gtoken: str
    token_expiration: int


class User(UserBase):
    id: int
    is_active: bool
    games: list[Game] = []
    invite: Invite = None

    class Config:
        orm_mode = True


class EditableUser(BaseModel):
    username: str

    class Config:
        orm_mode = True


class Friend(BaseModel):
    friend_id: int
    user_id: int

    class Config:
        orm_mode = True


class FullUser(User):
    email: str
    token_expiration: int
    friends: list[Friend] = []
    invite: Invite = None

    class Config:
        orm_mode = True


class Frequest(BaseModel):
    id: int
    sender: int
    recipient: int
