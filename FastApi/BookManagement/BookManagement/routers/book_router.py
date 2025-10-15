from fastapi import APIRouter
from models.book_models import BookCreate,BookInventory,BookResponse
from database.books_db import books
from typing import Optional

book_router=APIRouter()



@book_router.get("/",response_model=BookResponse)
def get_all_books():
    return {"message":"books retreived","Books":books}

@book_router.get("/search")
def get_book_query(title:Optional[str]=None,author:Optional[str]=None):
    ans=[]
    for book in books:
        if (title is None or book.Book.title==title) or (author is None or book.Book.author==author):
            ans.append(book)
    return {"message":"books retreived","Books":ans}
