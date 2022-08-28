from pydantic import BaseModel


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

    class Config:
        orm_mode = True


class EditableUser(BaseModel):
    username: str

    class Config:
        orm_mode = True


class FullUser(User):
    email: str
    token_expiration: int

    class Config:
        orm_mode = True


class Frequest(BaseModel):
    id: int
    sender: int
    recipient: int
