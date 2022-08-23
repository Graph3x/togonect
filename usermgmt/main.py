from fastapi import Depends, FastAPI, HTTPException
from config import settings
from fastapi.middleware.cors import CORSMiddleware

from google.oauth2 import id_token
from google.auth.transport import requests

from sqlalchemy.orm import Session

import crud
import models
import schemas
from database import SessionLocal, engine

import utils


def create_tables():
    models.Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def start_application():
    app = FastAPI(title=settings.PROJECT_NAME,
                  version=settings.PROJECT_VERSION)
    create_tables()
    return app


app = start_application()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/auth")
def authentication(token: str, db: Session = Depends(get_db)):
    try:
        user = id_token.verify_oauth2_token(token, requests.Request(
        ), "482211007182-h2fa91plomr40ve2urcc9pne9du53gqo.apps.googleusercontent.com")

        if user['email_verified']:
            user_in_db = crud.get_user_by_email(db, user['email'])
            if user_in_db:
                return user_in_db.token
            else:
                future_user = schemas.UserCreate(
                    email=user['email'], username='', gtoken=token, token=utils.generate_token(user['email'], 256))
                new_user = crud.create_user(db, future_user)
                return new_user.token
        else:
            return 'error_email_not_verified'

    except ValueError:
        return 'authentication failed'


# DEVELOPMENT ONLY#########TODO###########################################################


@app.get('/')
def check(token: str, db: Session = Depends(get_db)):
    if utils.validate_token(db, token):
        return 'allowed'
    else:
        return 'Denied'


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.delete_user(db, db_user=db_user)
