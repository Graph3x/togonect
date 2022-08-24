from pydantic import BaseModel


class UserBase(BaseModel):
    username: str
    profile_picture: str


class UserCreate(UserBase):
    email: str
    token: str
    gtoken: str


class User(UserBase):
    id: int
    is_active: bool
    token_expiration: int

    class Config:
        orm_mode = True
