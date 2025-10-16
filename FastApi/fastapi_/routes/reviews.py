from fastapi import APIRouter,HTTPException
from pydantic import BaseModel
review_router=APIRouter(prefix="/{book_id}/reviews")

reviews={1:[],2:[]}
reviews[1].append("Book is nice")
reviews[2].append("Book is not nice")

@review_router.get("/")
def review_by_id(book_id:int):
    if book_id not in reviews:
        raise HTTPException(status_code=404,detail="Book not found")
    return {"message":"reviews found","reviews":reviews[book_id]}

@review_router.post("/")
def post_by_id(book_id:int,review:str):
    if book_id not in reviews:
        reviews[book_id]=[]
    reviews[book_id].append(review)
    return {"message":"review added successfully"}
