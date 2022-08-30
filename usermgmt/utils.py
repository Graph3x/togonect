import string
import random
import crud
from sqlalchemy.orm import Session
from models import User
import requests
import json
from config import settings


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


def search_game(name: str):
    headers = {
        'Client-ID': settings.TWITCH_ID,
        'Authorization': 'Bearer q0jy1ydsf7ogzelthcrqbzxh55y5mz',
    }

    body = f'search "{name}"; fields name, cover; limit 4;'

    response = requests.post(
        'https://api.igdb.com/v4/games', data=body, headers=headers)
    return json.loads(response.text)


def get_remote_game(iden: int):
    headers = {
        'Client-ID': settings.TWITCH_ID,
        'Authorization': 'Bearer q0jy1ydsf7ogzelthcrqbzxh55y5mz',
    }

    body = f'where id = {iden}; fields name, cover;'

    response = requests.post(
        'https://api.igdb.com/v4/games', data=body, headers=headers)
    return json.loads(response.text)


def get_remote_cover(iden: int):
    try:
        if iden == -1:
            return 'https://images.igdb.com/igdb/image/upload/t_cover_big/nocover.png'

        headers = {
            'Client-ID': settings.TWITCH_ID,
            'Authorization': 'Bearer q0jy1ydsf7ogzelthcrqbzxh55y5mz',
        }

        body = f'where id = {iden}; fields image_id;'

        response = requests.post(
            'https://api.igdb.com/v4/covers', data=body, headers=headers)

        raw_data = json.loads(response.text)
        if raw_data == []:
            return []
        img_id = raw_data[0]['image_id']

        return f'https://images.igdb.com/igdb/image/upload/t_cover_big/{img_id}.png'

    except Exception as e:
        return []
