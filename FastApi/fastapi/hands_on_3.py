from fastapi import FastAPI
from pydantic import BaseModel
app=FastAPI()

class BaseBook(BaseModel):
    title:str
    published_year:int
    isbn:str
    

class BookAuthor(BaseModel):
    name:str
    email:str

class BookWithAuthor(BaseModel):
    id:int
    stock:int
    price:float
    author:BookAuthor
    book:BaseBook

class BookInput(BaseModel):
    title:str
    published_year:int
    price:float
    author:BookAuthor

class BookResponse(BaseModel):
    message:str
    Book:BookWithAuthor

data=[]
author_data=BookAuthor(name="aswinnath",email="aswinnathte125@gmail.com")
book_data=BaseBook(title="harry potter",published_year=2005,isbn="bk-1001")
data.append(BookWithAuthor(id=1,stock=100,price=1000,author=author_data,book=book_data))

@app.get("/")
def funtion():
    return "Welcome to Booking Management"


@app.get("/books")
def get_all_books():
    return data

@app.post("/books")
def add_book(book:BookInput):
    author_data=BookAuthor.model_validate(book.author)
    book_data=BaseBook(title=book.title,published_year=book.published_year,isbn=book.isbn)
    book_instance=BookWithAuthor(id=len(data)+1,stock=1,price=book.price,author=author_data,book=book_data)
    data.append(book_instance)
    return BookResponse(message="Book is successfully added",Book=book_instance)

