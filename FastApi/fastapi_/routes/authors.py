from fastapi import APIRouter
from pydantic import BaseModel
author_router=APIRouter()

authors=[{"id":1,"name":"rowling","email":"rowling@gmail.com"}]
@author_router.get("/")
def get_all_authors():
    return authors

class AuthorModel(BaseModel):
    name:str
    email:str

@author_router.post("/")
def add_author(author:AuthorModel):
    authors.append({"id":len(authors)+1,"name":author.name,"email":author.email})
    return {"message":"author added successfully"}
