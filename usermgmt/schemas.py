from pydantic import BaseModel


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


class UserCreate(UserBase):
    email: str
    token: str
    gtoken: str
    token_expiration: int


class User(UserBase):
    id: int
    is_active: bool
    games: list[Game] = []

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

    class Config:
        orm_mode = True


class Frequest(BaseModel):
    id: int
    sender: int
    recipient: int
