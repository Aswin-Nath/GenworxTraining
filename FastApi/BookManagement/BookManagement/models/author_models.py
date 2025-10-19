from pydantic import BaseModel,ConfigDict
from typing import List
class AuthorBase(BaseModel):
    name:str
    email:str
class AuthorCreate(AuthorBase):
    pass

class AuthorModel(AuthorBase):
    author_id:int
    model_config=ConfigDict(from_attributes=True)
    
class AuthorResponse(BaseModel):
    message:str
    authors:List[AuthorModel]
    model_config=ConfigDict(from_attributes=True)


