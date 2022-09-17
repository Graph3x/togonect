from datetime import datetime, time
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
        return 'username'
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        user.username = new_data.username
        db.commit()
        return True
    except Exception:
        return 'other'


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
        models.Frequest.sender == user_id).all()

    frequests2 = db.query(models.Frequest).filter(
        models.Frequest.recipient == user_id).all()

    return set(frequests1 + frequests2)


def get_game(db: Session, iden: int):
    try:
        return db.query(models.Game).filter(models.Game.id == iden).first()
    except Exception:
        return False


def add_game(db: Session, game: dict):

    fcover = -1
    if 'cover' in game.keys():
        fcover = int(game['cover'])

    try:
        new_game = models.Game(
            id=game['id'], name=game['name'], cover=utils.get_remote_cover(fcover))
        db.add(new_game)
        db.commit()
        db.refresh(new_game)

        return new_game

    except Exception as e:
        print(e)
        return False


def add_user_game(db: Session, user: models.User, game: models.Game):
    try:
        user.games.append(game)
        db.commit()

        return True

    except Exception:
        return False


def remove_user_game(db: Session, user: models.User, game: models.Game):
    try:
        user.games.remove(game)
        db.commit()

        return True

    except Exception as e:
        return False


def add_invite(db: Session, author: models.User, gameid: int, slots: int = None, itime: time = None):
    try:
        invite = models.Invite(
            game_id=gameid, author_id=author.id)
        if slots:
            invite.slots = slots
        if itime:
            if itime > datetime.now():
                invite.time = itime
            else:
                return 'time'
        invite.users.append(author)
        db.add(invite)
        db.commit()
        db.refresh(invite)

        return True

    except Exception as e:
        return False


def get_invite(db: Session, iden: int):
    try:
        return db.query(models.Invite).filter(models.Invite.id == iden).first()
    except Exception:
        return False


def remove_invite(db: Session, invite: models.Invite):
    try:
        db.delete(invite)
        db.commit()
        return True
    except Exception as e:
        print(e)
        return False


def join_event(db: Session, user: models.User, event: models.Invite):
    try:
        user.invite = event
        db.commit()
    except Exception:
        return False


def leave_event(db: Session, user: models.User):
    try:
        user.invite = None
        db.commit()
    except Exception:
        return False


def get_user_by_name(db: Session, name: str):
    return db.query(models.User).filter(models.User.username == name).all()


def get_full_user_by_email(db: Session, mail: str):
    return db.query(models.User).filter(models.User.email == mail).all()


def get_game_by_name(db: Session, name: str):
    return db.query(models.Game).filter(models.Game.name == name).all()
