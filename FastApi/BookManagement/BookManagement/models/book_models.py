from pydantic import BaseModel
from models.author_models import AuthorBase,AuthorModel
from typing import List
from datetime import datetime
class BookBase(BaseModel):
    title:str
    price:float
    author:AuthorModel   
    published_year:int

class BookCreate(BookBase):
    pass

class BookInventory(BaseModel):
    book_id:int
    isAvailable:bool
    Book:BookBase


class BookResponse(BaseModel):      
    message:str
    Books:List[BookInventory]


class BorrowedBook(BaseModel):
    borrower_name:str
    Book:BookBase
    due_date:datetime

