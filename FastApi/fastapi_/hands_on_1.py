from fastapi import FastAPI
from typing import Optional
app=FastAPI()
from datetime import datetime
from pydantic import BaseModel,Field,field_validator


class Book(BaseModel):
    id: int = Field(..., gt=0, description="Book ID must be positive")
    title: str = Field(..., min_length=3, max_length=100, description="Title must be between 3-100 characters")
    author: str = Field(..., min_length=3, description="Author name must have at least 3 characters")
    price: float = Field(..., gt=0, lt=5000, description="Price must be between 0 and 5000")
    published_year: Optional[int] = Field(None, ge=1900, le=2025, description="Year must be between 1900 and 2025")

    @field_validator("title")
    def title_must_start_with_capital(cls, v):
        if not v[0].isupper():
            raise ValueError("Title must start with a capital letter")
        return v

    @field_validator("price")
    def warn_if_price_high(cls, v):
        if v > 1000:
            print(f"Warning: Price is high ({v}), but accepted.")
        return v

    @field_validator("published_year")
    def validate_published_year(cls, v):
        if v and v > datetime.now().year:
            raise ValueError("Published year cannot be greater than current year")
        return v
class InputBook(BaseModel):
    title:str
    author:str
    price:float
    published_year: Optional[int] = None



class BookResponse(BaseModel):
    message:str
    data:Book


data=[]

@app.post("/add",response_model=BookResponse)
def add_book(book:InputBook):
    currentInstance=Book(id=len(data)+1,author=book.author,title=book.title,price=book.price,published_year=book.published_year)
    data.append(currentInstance)
    return {"message": "Book added successfully", "data": currentInstance}


@app.get("/")
def welcome():
    return {"message":"Welcome to Book Management API"}


@app.get("/books/{book_id}")
def get_book_by_id(book_id:int):
    print("aaa")
    ans=[]
    for i in data:
        if i.id==book_id:
            return i
    return {"Not found"}

@app.get("/books")
def get_all_books():
    return data

@app.get("/books_by_author")
def get_book_by_author(author:str):
    ans=[]
    for i in data:
        if i.author.lower()==author.lower():
            ans.append(i)
    return ans
