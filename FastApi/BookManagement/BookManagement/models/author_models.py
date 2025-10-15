from pydantic import BaseModel
from typing import List
class AuthorBase(BaseModel):
    name:str
    email:str

class AuthorCreate(AuthorBase):
    pass

class AuthorModel(AuthorBase):
    author_id:int


class AuthorResponse(BaseModel):
    message:str
    authors:List[AuthorModel]


