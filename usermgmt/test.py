from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


jirkove = []


class Jirka(BaseModel):
    name: str
    age: int
    choroba: str = None


@app.get('/')
def index():
    return {'jirkove': jirkove}


@app.post('/jirka')
def jirka(item: Jirka):
    jirkove.append(item)
    return {'message: wassap'}
