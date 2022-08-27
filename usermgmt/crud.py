from sqlalchemy.orm import Session

import models
import schemas
import utils


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        email=user.email, username=user.username, token=user.token, gtoken=user.gtoken, token_expiration=30, profile_picture=user.profile_picture)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, db_user: models.User):
    db.delete(db_user)
    db.commit()
    return True


def edit_user(db: Session, user_id: int, new_data: schemas.EditableUser):
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        user.username = new_data.username
        db.commit()
        return True
    except Exception:
        return False


def edit_user(db: Session, user_id: int, new_data: schemas.EditableUser):
    if not utils.validate_username(new_data.username):
        return False
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        user.username = new_data.username
        db.commit()
        return True
    except Exception:
        return False


def change_token(db: Session, user: models.User, new_token: str):
    try:
        user.token = new_token
        user.token_expiration = 30
        db.commit()
        return True
    except Exception:
        return False
