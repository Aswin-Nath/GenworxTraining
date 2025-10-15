from fastapi import APIRouter
from models.author_models import AuthorResponse
from database.authors_db import authors

author_router=APIRouter()

@author_router.get("/",response_model=AuthorResponse)
def get_all_authors():
    return {"message":"successfully retreived","authors":authors}   