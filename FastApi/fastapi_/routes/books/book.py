from fastapi import APIRouter,HTTPException,Depends,dependencies
from pydantic import BaseModel

data=[{"id":1,"title":"Book1","author":"rowling","year":2001},{"id":1,"title":"Book2","author":"rowling","year":2002}]
tokens=set()
tokens.add("AB101")

def validator(token:str):
    if token not in tokens:
        raise HTTPException(status_code=404,detail="Not authenticated to use this url")
    return token

book_router=APIRouter(dependencies=[Depends(validator)])


@book_router.get("/")
def get_all_books():
    return data

@book_router.get("/search")
def get_book_by_author(author:str):
    ans=[]
    for book in data:
        if book["author"]==author:
            ans.append(book)
    if ans:
        return {"message":"Books found","Books":ans}
    else:
        return {"message":"Books not found","Books":[]}

@book_router.get("/{book_id}")
def get_book_by_id(book_id:int):
    for book in data:
        if book["id"]==book_id:
            return {"message":"Book found","Book":book}
    return HTTPException(status_code=404,detail="Book not found")

class BookModel(BaseModel):
    title:str
    author:str

@book_router.post("/")
def add_book(Book:BookModel):
    data.append({"id":len(data)+1,"title":Book.title,"author":Book.author})
    return {"message":"Book added successfully"}

# books=[("Harry Potter","rowling",2001)]