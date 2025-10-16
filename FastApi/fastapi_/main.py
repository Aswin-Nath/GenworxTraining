from fastapi import FastAPI
from routes.book import book_router
from routes.authors import author_router
from routes.reviews import review_router
app=FastAPI()

app.include_router(book_router,prefix="/books",tags=["Books"])
app.include_router(author_router,prefix="/authors",tags=["Authors"])
app.include_router(review_router,prefix="/books",tags=["Reviews"])

@app.get("/")
def welcome():
    return "Welcome to the Book Management"