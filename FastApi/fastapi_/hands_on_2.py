from fastapi import FastAPI
from pydantic import BaseModel
app=FastAPI()

class Author(BaseModel):
    name:str
    email:str

data=[]
class Book(BaseModel):
    id:int
    title:str
    author:Author
    price:float
    published_year:int

class BookInput(BaseModel):
    title:str
    Author:Author
    price:float
    published_year:int

class BookResponse(BaseModel):
    message:str
    Book:Book

@app.get("/")
def hello_world():
    return "Welcome to Book Management"

@app.post("/books")
def upload_book(BookInput:BookInput):
    AuthorData=Author(name=BookInput.Author.name,email=BookInput.Author.email)
    currentBook=Book(id=len(data)+1,title=BookInput.title,author=AuthorData,price=BookInput.price,published_year=BookInput.published_year)
    data.append(currentBook)
    return {"message":"Book added successfully","Book":currentBook}

class BaseConfigModel(BaseModel):
    model_config={
    "str_strip_whitespace":True,
    "validate_assignment":True
    }
class BaseBook(BaseConfigModel):
    title:str
    isbn:str
    published_year:int

class BaseAuthor(BaseConfigModel):
    name:str
    email:str

class BookCreate(BaseConfigModel):
    price:float
    stock:int

class BookResponse1(BaseConfigModel):
    id:int
    isAvailable:bool
    Book:Book

class BookWithAuthor(BaseBook,BaseAuthor):
    id:int
    isAvailable:bool
    stock:int
    price:float
    book:BaseBook
    author:BaseAuthor


data.append(BookWithAuthor(id=1,title="Harry potter",isbn="b1-1001",published_year=2005,name="Aswinnath",email="aswinnathte125@gmail.com",isAvailable=True,stock=1,price=1001))


@app.post("/books/copy/{book_id}")
def copy_book(book_id:int):
    for book in data:
        if book.id==book_id:
            new_copy=book.model_copy(update={"id":len(data)+1,"published_year":2025,"price":book.price*2})
            data.append(new_copy)
            return {"message":"Book updated with new details","Book":new_copy}
    return {"error":f"book with {book_id} id is not found"}

@app.post("/books/va lidate")
def validated_book(book:BookInput):
    author_details=Author.model_validate(book.Author)
    book_instance=Book(id=len(data)+1,title=book.title,author=author_details,price=book.price,published_year=book.published_year)
    book_response=BookResponse.model_validate({"message":"book validated and added","Book":book_instance})
    return book_response
