from operator import and_
from sqlalchemy.orm import Session
import sqlalchemy
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


def add_friend(db: Session, user_id: int, friend_id: int):
    try:
        friend = models.Friend(user_id=user_id, friend_id=friend_id)
        db.commit()
        user = db.query(models.User).filter(models.User.id == user_id).first()
        user.friends.append(friend)
        db.commit()
        return True
    except Exception as e:
        return False


def remove_friend(db: Session, user_id: int, friend_id: int):
    try:
        friend1 = db.query(models.Friend).filter(
            models.Friend.user_id == user_id, models.Friend.friend_id == friend_id).first()

        friend2 = db.query(models.Friend).filter(
            models.Friend.user_id == friend_id, models.Friend.friend_id == user_id).first()

        #user1 = db.query(models.User).filter(models.User.id == user_id).first()
        #user2 = db.query(models.User).filter(models.User.id == friend_id).first()

        # user.friends.append(friend)

        db.delete(friend1)
        db.delete(friend2)
        db.commit()
        return True
    except Exception as e:
        return False


def add_frequest(db: Session, sender_id: int, recipient_id: int):
    try:
        frequest = models.Frequest(
            sender=sender_id, recipient=recipient_id, status='pending')
        db.add(frequest)
        db.commit()

        return True

    except Exception:
        return False


def get_frequest(db: Session, sender_id: int, recipient_id: int):
    return db.query(models.Frequest).filter(models.Frequest.sender == sender_id and models.Frequest.recipient == recipient_id).first()


def get_users_frequests(db: Session, user_id: int):
    frequests1 = db.query(models.Frequest).filter(
        models.Frequest.sender == user_id, models.Frequest.status == 'pending').all()

    frequests2 = db.query(models.Frequest).filter(
        models.Frequest.sender == user_id, models.Frequest.status == 'rejected').all()

    frequests3 = db.query(models.Frequest).filter(
        models.Frequest.recipient == user_id, models.Frequest.status == 'pending').all()

    frequests4 = db.query(models.Frequest).filter(
        models.Frequest.recipient == user_id, models.Frequest.status == 'rejected').all()

    return set(frequests1 + frequests2 + frequests3 + frequests4)
