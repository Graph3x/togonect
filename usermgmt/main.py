from fastapi import FastAPI
from config import settings
from session import engine
from base_class import Base

from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.middleware.sessions import SessionMiddleware
from google.oauth2 import id_token
from google.auth.transport import requests


def create_tables():
    Base.metadata.create_all(bind=engine)


def start_application():
    app = FastAPI(title=settings.PROJECT_NAME,
                  version=settings.PROJECT_VERSION)
    create_tables()
    return app


app = start_application()

origins = [
    "http://localhost:3000",
]

app.add_middleware(SessionMiddleware, secret_key='TODOsecretkey')  # TODO
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/auth")
def authentication(request: Request, token: str):
    try:
        user = id_token.verify_oauth2_token(token, requests.Request(
        ), "482211007182-h2fa91plomr40ve2urcc9pne9du53gqo.apps.googleusercontent.com")

        if user['email_verified']:
            return f'test_token_for_{user["name"]}'  # TODO
        else:
            return 'error_email_not_verified'

    except ValueError:
        return 'authentication failed'


@app.get('/')
def check(request: Request, token: str):

    if token != 'null':
        return 'authenticated'
    else:
        return 'error_token_not_valid'
