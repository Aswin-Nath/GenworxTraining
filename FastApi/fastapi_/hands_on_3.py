from fastapi import FastAPI,HTTPException,Request
from pydantic import BaseModel,Field
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from typing import Optional
app=FastAPI()
import logging

# Configure logging once at startup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
class BaseBook(BaseModel):
    title:str =Field(...,min_length=3)
    published_year:int
    isbn:str
    

class BookAuthor(BaseModel):
    name:str=Field(...,min_length=3)
    email:str

class BookWithAuthor(BaseModel):
    id:int=Field(...,gt=0)
    stock:int
    price:float
    author:BookAuthor
    book:BaseBook

class BookInput(BaseModel):
    title:str
    published_year:int
    price:float
    isbn:str
    author:BookAuthor

class BookResponse(BaseModel):
    message:str
    Book:BookWithAuthor
@app.exception_handler(RequestValidationError)
async def validation(request:Request,errorHandler:RequestValidationError):
    return JSONResponse(status_code=422,conten={
        "error":"input data invalid",
        "message":"please verify your inputs",
        "path":str(request.url)
    })
@app.exception_handler(RequestValidationError)
async def global_validation(request:Request,errorHandler:RequestValidationError):
    return JSONResponse(
        status_code=500,

        content={
            "error":"internal server error",
            "message":"some problem on our side,we are working on it",
            "path":str(request.url)
        }
    )
ids=set()
data=[]
author_data=BookAuthor(name="aswinnath",email="aswinnathte125@gmail.com")
book_data=BaseBook(title="harry potter",published_year=2005,isbn="bk-1001")
data.append(BookWithAuthor(id=1,stock=100,price=1000,author=author_data,book=book_data))
ids.add(1)
@app.get("/")
def funtion():
    return "Welcome to Booking Management"


@app.get("/books")
def get_all_books(limit:Optional[int]=None,author_name:Optional[str]=None):
    new_data=[]
    for book in data:
        if limit is not None and len(new_data)==limit:
            break
        if limit is None and not author_name is None:
            new_data.append(book)
            continue
        if author_name is not None and book.author.name==author_name:
            new_data.append(book)
    return new_data

@app.get("/books/search")
def get_book_query(author:str,title:str,max_price:int):
    new_data=[]
    for book in data:
        if book.author.name==author and book.book.title==title and book.price<=max_price:
            new_data.append(data)
    return {"matching data":new_data}

@app.get("/books/{book_id}")
def get_book_by_id(book_id:int):
    found=False
    for book in data:
        if book.id==book_id:
            return {"message":"Book retrieved successfully","Book":book}
    if not found:
        error_message={"error":"Not found","message":f"no book found with id {book_id}"}
        raise HTTPException(status_code=404,detail=error_message)
    
@app.get("/discount")
def apply_discount(price:float,discount:Optional[float]=0):
    new_price=price
    new_price-=((new_price*discount)/100)
    return new_price

@app.post("/books")
def add_book(book:BookInput):
    if len(data)+1 in ids:
        raise HTTPException(status_code=400,detail="Duplicate ID is found")
    author_data=BookAuthor.model_validate(book.author)
    book_data=BaseBook(title=book.title,published_year=book.published_year,isbn=book.isbn)
    book_instance=BookWithAuthor(id=len(data)+1,stock=1,price=book.price,author=author_data,book=book_data)
    data.append(book_instance)
    return BookResponse(message="Book is successfully added",Book=book_instance)

@app.delete("/books/{book_id}")
def delete_book_by_id(book_id:int):
    new_data=[]
    found=False
    for book in data:
        if book.id!=book_id:
            new_data.append(book)
        else:
            found=True
    if not found:
        raise HTTPException(status_code=404,detail={"message":f"book with id {book_id} not found"})
    else:
        return {"message":"book deleted successfully"}

class BookModel(BaseModel):
    title:str


@app.put("/books/{book_id}")
def update_book(book_id:int,new_price:float,Book:BookModel,author:Optional[str]=None,new_title:Optional[str]=None):
    for i in range(len(data)):
        if data[i].id==book_id:
            data[i].book.title=Book.title
            data[i].price=new_price
            return {"message":"price of the book updated","Book":data}
    error_message={"error":"Not found","message":f"no book found with id {book_id}"}
    raise HTTPException(status_code=404,detail=error_message)

@app.get("/books/author")
def get_books_by_author(author:str):
    if author is None:
        logger.error("Author name not provided in query parameter")
        raise HTTPException(status_code=404, detail="Author name is not given")
    ans = [book for book in data if book.author.name == author]
    if not ans:
        logger.warning(f"No books found for author: {author}")
    else:
        logger.info(f"Retrieved {len(ans)} books for author: {author}")
    return {"message": "Retrieved", "Books": ans}

@app.get("/runtime_test")
def get_():
    return 10/0

# class BookModel(BaseModel):
#     id:int
#     title:str
#     price:float

# class BookInputModel(BaseModel):
#     title:str
#     price:float

# data=[]

# @app.post("/books")
# def upload_book(Book:BookInputModel):
#     book_instance=BookModel(id=len(data)+1,title=Book.title,price=Book.price)
#     return {"message":"Booked created successfully",Book:book_instance}

# @app.get("/books/filter")
# def filter(min_price:Optional[int]=None,max_price:Optional[int]=None):
#     ans=[]
#     for book in data:
#         if (min_price is None or book.price>=min_price) and (max_price is None or book.price<=max_price):
#             ans.append(book)
#     return ans

# @app.get("/convert")
# def convert(qty:int,available:bool,rating:float):
#     return {"message":"Query accepted successfully"}
