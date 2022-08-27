import string
import random
import crud
from sqlalchemy.orm import Session
from models import User


def generate_token(iden, N):
    return iden + ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(N))


def validate_token(db: Session, token: str):
    try:
        email = token[:-256]
        user = crud.get_user_by_email(db, email=email)
        return token == user.token
    except Exception:
        return False


def validate_token_user(token: str, user: User):
    try:
        return token == user.token
    except Exception:
        return False


def validate_username(username: str):
    if len(username) < 1:
        return False

    if len(username) > 32:
        return False

    return True
