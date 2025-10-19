from pydantic import BaseModel,ConfigDict
from models.author_models import AuthorBase,AuthorModel
from typing import List
from datetime import datetime
class BookBase(BaseModel):
    title:str
    price:float
    author_id:int   
    published_year:int
    isbn:str
    model_config=ConfigDict(from_attributes=True)
    is_available:bool

    
class BookCreate(BookBase):
    pass

class BookResponse(BaseModel):      
    message:str
    Books:List[BookBase]
    model_config=ConfigDict(from_attributes=True)


class BorrowedBook(BaseModel):
    borrower_name:str
    Book:BookBase
    due_date:datetime
    model_config=ConfigDict(from_attributes=True)