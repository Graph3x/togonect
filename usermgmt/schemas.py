from pydantic import BaseModel


class UserBase(BaseModel):
    email: str
    username: str


class UserCreate(UserBase):
    token: str
    gtoken: str


class User(UserBase):
    id: int
    is_active: bool
    token_expiration: int

    class Config:
        orm_mode = True
