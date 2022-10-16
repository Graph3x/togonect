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
    settings.FRONTEND_ORIGIN,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#######################################################################################################################


@app.get("/auth/google")
def authentication(token, db: Session = Depends(get_db)):
    try:
        user = id_token.verify_oauth2_token(token, requests.Request(
        ), "482211007182-h2fa91plomr40ve2urcc9pne9du53gqo.apps.googleusercontent.com")

        if user['email_verified']:
            user_in_db = crud.get_user_by_email(db, user['email'])
            if user_in_db:
                return user_in_db.token
            else:
                future_user = schemas.UserCreate(
                    email=user['email'], username=user['name'], gtoken=token, token=utils.generate_token(user['email'], settings.TOKEN_LEN), profile_picture=user['picture'], token_expiration=30)
                new_user = crud.create_user(db, future_user)
                return new_user.token
        else:
            raise HTTPException(
                status_code=400, detail="400-1")

    except ValueError:
        raise HTTPException(status_code=400, detail="400-0")


@app.get('/users/getid')
def get_user_id(token: str, db: Session = Depends(get_db)):
    if utils.validate_token(db, token):
        dbuser = crud.get_user_by_email(db, token[:-256])
        return dbuser.id
    else:
        raise HTTPException(status_code=401, detail="401-2")


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="404-3")
    return db_user


@app.put("/users/{user_id}/edit")
def edit_user(user_id: int, token: str, new_user: schemas.EditableUser, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="404-3")
    if utils.validate_token_user(token, db_user):
        do_edit = crud.edit_user(db, user_id, new_user)
        if do_edit == True:
            return 'OK'
        if do_edit == 'username':
            raise HTTPException(status_code=400, detail='400-4')
        else:
            raise HTTPException(status_code=400, detail='500-5')
    raise HTTPException(status_code=401, detail="401-2")


@app.delete("/users/{user_id}")
def delete_user(user_id: int, token: str, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="404-3")
    if utils.validate_token_user(token, db_user):
        if crud.delete_user(db, db_user=db_user):
            return 'OK'
    raise HTTPException(status_code=401, detail="401-2")


@app.get("/users/{user_id}/deletetoken")
def delete_token(user_id: int, token: str, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="404-3")
    if utils.validate_token_user(token, db_user):
        new_token = utils.generate_token(
            db_user.email, settings.TOKEN_LEN)
        crud.change_token(db, db_user, new_token)
        return new_token

    raise HTTPException(status_code=401, detail="401-2")


@app.get("/users/{users_id}/friends", response_model=list[schemas.Friend])
def get_friends(users_id: int, token: str, db: Session = Depends(get_db)):
    usr = db.query(models.User).filter(models.User.id == users_id).first()
    if usr:
        if token == usr.token:
            return usr.friends
        raise HTTPException(status_code=401, detail="401-2")
    raise HTTPException(status_code=404, detail="404-3")


@app.get("/users/{recipient_id}/request")
def send_frequest(recipient_id: int, token: str, db: Session = Depends(get_db)):
    if utils.validate_token(db, token):
        sender = crud.get_user_by_email(db, token[:-256])

        recpt = crud.get_user(db, recipient_id)
        if recpt and recpt != sender:

            if crud.get_frequest(db, sender.id, recipient_id):
                print(sender.id)
                print(recipient_id)
                raise HTTPException(status_code=401, detail="400-6")
            if crud.get_frequest(db, recipient_id, sender.id):
                raise HTTPException(status_code=401, detail="400-7")
            crud.add_frequest(db, sender.id, recipient_id)
            return True
        raise HTTPException(status_code=401, detail="400-8")
    raise HTTPException(status_code=401, detail="401-2")


@app.get("/frequests")
def get_frequests(token: str, db: Session = Depends(get_db)):
    if utils.validate_token(db, token):
        user = crud.get_user_by_email(db, token[:-256])
        frqs = crud.get_users_frequests(db, user.id)
        return frqs

    raise HTTPException(status_code=401, detail="401-2")


@app.get("/frequests/{req_id}/accept")
def accept_frequest(token: str, req_id: int, db: Session = Depends(get_db)):
    if utils.validate_token(db, token):
        user = crud.get_user_by_email(db, token[:-256])
        frq = db.query(models.Frequest).filter(
            models.Frequest.id == req_id, models.Frequest.recipient == user.id, models.Frequest.status == 'pending').first()
        if frq:
            frq.status = 'accepted'
            crud.add_friend(db, frq.sender, frq.recipient)
            crud.add_friend(db, frq.recipient, frq.sender)
            return 'OK'

        raise HTTPException(status_code=404, detail="404-9")

    raise HTTPException(status_code=401, detail="401-2")


@app.get("/frequests/{req_id}/reject")
def reject_frequest(token: str, req_id: int, db: Session = Depends(get_db)):
    if utils.validate_token(db, token):
        user = crud.get_user_by_email(db, token[:-256])
        frq = db.query(models.Frequest).filter(
            models.Frequest.id == req_id, models.Frequest.recipient == user.id, models.Frequest.status == 'pending').first()
        if frq:
            frq.status = 'rejected'
            db.commit()
            return 'OK'

        raise HTTPException(status_code=404, detail="404-9")

    raise HTTPException(status_code=401, detail="401-2")


@app.get("/frequests/{req_id}/cancel")
def remove_frequest(token: str, req_id: int, db: Session = Depends(get_db)):
    if utils.validate_token(db, token):
        user = crud.get_user_by_email(db, token[:-256])
        frq_pending = db.query(models.Frequest).filter(
            models.Frequest.id == req_id, models.Frequest.sender == user.id, models.Frequest.status == 'pending').first()

        frq_rejected = db.query(models.Frequest).filter(
            models.Frequest.id == req_id, models.Frequest.recipient == user.id, models.Frequest.status == 'rejected').first()

        if frq_pending:
            frq = frq_pending
        else:
            frq = frq_rejected
        if frq:
            db.delete(frq)
            db.commit()
            return 'OK'

        raise HTTPException(status_code=404, detail="404-9")

    raise HTTPException(status_code=401, detail="401-2")


@app.get("/users/{user_id}/full", response_model=schemas.FullUser)
def read_user(user_id: int, token: str, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="404-3")
    if token == db_user.token:
        return db_user
    raise HTTPException(status_code=401, detail="401-2")


@app.get("/users/{user_id}/unfriend")
def remove_friend(token: str, user_id: int, db: Session = Depends(get_db)):
    if utils.validate_token(db, token):
        user = crud.get_user_by_email(db, token[:-256])
        friends = user.friends
        for friend in friends:
            if friend.friend_id == user_id:
                frq1 = db.query(models.Frequest).filter(
                    models.Frequest.sender == user.id, models.Frequest.recipient == user_id).first()
                frq2 = db.query(models.Frequest).filter(
                    models.Frequest.sender == user_id, models.Frequest.recipient == user.id).first()

                if frq1:
                    frq = frq1
                else:
                    frq = frq2

                db.delete(frq)
                crud.remove_friend(db, user.id, user_id)
                return "OK"

        raise HTTPException(status_code=404, detail="404-10")

    raise HTTPException(status_code=401, detail="401-2")


@app.get('/games/search', response_model=list[schemas.Game])
def search_game(name: str):
    if utils.validate_str(name):
        games = utils.search_game(name)
        gamesort = sorted(games, key=lambda d: d['id'])
        if gamesort:
            return gamesort
        raise HTTPException(404, '404-11')
    raise HTTPException(504, '400-12')


@app.get('/games/{iden}', response_model=schemas.Game)
def get_game(iden: int, db: Session = Depends(get_db)):
    in_db = crud.get_game(db, iden)
    if in_db:
        return in_db
    remote = utils.get_remote_game(iden)
    if remote == []:
        raise HTTPException(404, '404-11')
    new_game = crud.add_game(db, remote[0])
    return new_game


@app.get('/games/{gid}/add')
def add_game(gid: int, token: str, db: Session = Depends(get_db)):
    if utils.validate_token(db, token):
        user = crud.get_user_by_email(db, token[:-256])
        game = crud.get_game(db, gid)
        if game in user.games:
            raise HTTPException(400, '400-13')
        if game:
            crud.add_user_game(db, user, game)
            return 'OK'
        remote = utils.get_remote_game(gid)
        if remote == []:
            raise HTTPException(404, '404-11')
        new_game = crud.add_game(db, remote[0])
        crud.add_user_game(db, user, new_game)
        return 'OK'
    raise HTTPException(status_code=401, detail="401-2")


@app.get('/games/{gid}/remove')
def remove_game(gid: int, token: str, db: Session = Depends(get_db)):
    if utils.validate_token(db, token):
        user = crud.get_user_by_email(db, token[:-256])
        game = crud.get_game(db, gid)
        if game not in user.games:
            raise HTTPException(400, '400-14')
        if game:
            crud.remove_user_game(db, user, game)
            return 'OK'
        remote = utils.get_remote_game(gid)
        if remote == []:
            raise HTTPException(404, '404-11')
        crud.remove_user_game(db, user, game)
        return 'OK'
    raise HTTPException(status_code=401, detail="401-2")


@app.post('/invites/add')
def add_invite(token: str, invite_data: schemas.CreateInvite, db: Session = Depends(get_db)):
    if utils.validate_token(db, token):
        user = crud.get_user_by_email(db, token[:-256])
        game = crud.get_game(db, invite_data.game_id)
        if game not in user.games:
            raise HTTPException(400, '400-14')
        if game:
            invite = crud.add_invite(db, user, game.id,
                                     invite_data.slots, invite_data.time)
            if invite == True:
                return 'OK'
            elif invite == 'time':
                raise HTTPException(400, '400-15')
            raise HTTPException(500, '500-16')
        raise HTTPException(404, '400-11')
    raise HTTPException(status_code=401, detail="401-2")


@app.get('/invites/{iden}/cancel')
def cancel_invite(token: str, iden: int, db: Session = Depends(get_db)):
    if utils.validate_token(db, token):
        user = crud.get_user_by_email(db, token[:-256])
        invite = crud.get_invite(db, iden)
        if not invite:
            raise HTTPException(404, '404-17')
        if invite.author_id == user.id:
            crud.remove_invite(db, invite)
            return 'OK'

    raise HTTPException(status_code=401, detail="401-2")


@app.get('/invites', response_model=list[schemas.Invite])
def get_invites(token: str, db: Session = Depends(get_db)):
    if utils.validate_token(db, token):
        user = crud.get_user_by_email(db, token[:-256])
        invites = crud.get_invites(db, user)
        return invites
    raise HTTPException(status_code=401, detail="401-2")


@app.get('/invites/{iden}', response_model=schemas.Invite)
def get_invite(token: str, iden: int, db: Session = Depends(get_db)):
    if utils.validate_token(db, token):
        invite = db.query(models.Invite).filter(
            models.Invite.id == iden).first()
        if not invite:
            raise HTTPException(404, '404-17')
        if invite not in crud.get_invites(db, crud.get_user_by_email(db, token[:-256])):
            raise HTTPException(401, detail='401-22')
        return invite

    raise HTTPException(status_code=401, detail="401-2")


@app.get('/invites/{iden}/join')
def join_event(token: str, iden: int, db: Session = Depends(get_db)):
    if utils.validate_token(db, token):
        user = crud.get_user_by_email(db, token[:-256])
        invite = crud.get_invite(db, iden)
        if not invite:
            raise HTTPException(404, '404-17')

        if invite.slots and invite.users:
            if len(invite.users) >= invite.slots:
                raise HTTPException(400, '404-18')
        if user.invite == None:
            if invite in crud.get_invites(db, user):
                crud.join_event(db, user, invite)
                return 'OK'
            raise HTTPException(400, '401-22')
        raise HTTPException(400, '400-19')

    raise HTTPException(status_code=401, detail="401-2")


@app.get('/invites/{iden}/leave')
def leave_event(token: str, iden: int, db: Session = Depends(get_db)):
    if utils.validate_token(db, token):
        user = crud.get_user_by_email(db, token[:-256])
        invite = user.invite
        if not invite:
            raise HTTPException(404, '404-17')
        if invite.author_id == user.id:
            raise HTTPException(400, '400-20')
        if user.invite != None:
            crud.leave_event(db, user)
            return 'OK'

    raise HTTPException(status_code=401, detail="401-2")


# IN PROGRESS ##############TODO###########################################################

@app.get('/search')
def search(token: str, query: str, db: Session = Depends(get_db)):
    if utils.validate_token(db, token):

        if not utils.validate_str(query):
            raise HTTPException(504, '400-12')

        email_usrs = crud.get_full_user_by_email(db, query)
        name_usrs = crud.get_user_by_name(db, query)
        games = utils.search_game(query)
        gamesort = sorted(games, key=lambda d: d['id'])

        result = [email_usrs]
        result.append(name_usrs)
        result.append(gamesort)
        if result:
            return result
        raise HTTPException(404, '404-21')

    else:
        raise HTTPException(status_code=401, detail="401-2")

# DEVELOPMENT ONLY #########TODO###########################################################


@app.get('/')
def check(token: str, db: Session = Depends(get_db)):
    if utils.validate_token(db, token):
        return 'OK'
    else:
        raise HTTPException(status_code=401, detail="401-2")


@app.get("/users/", response_model=list[schemas.FullUser])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users
