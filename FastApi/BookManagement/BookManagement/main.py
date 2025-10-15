from fastapi import FastAPI
from routers.author_router import author_router
from routers.book_router import book_router
from routers.borrow_router import borrow_router
app=FastAPI()

app.include_router(author_router,prefix="/authors",tags=["Authors"])
app.include_router(book_router,prefix="/books",tags=["Books"])
app.include_router(borrow_router,prefix="/books",tags=["Borrows"])
@app.get("/")
def hello_world():
    return {"message":"Welcome to Library Booking Management"}

