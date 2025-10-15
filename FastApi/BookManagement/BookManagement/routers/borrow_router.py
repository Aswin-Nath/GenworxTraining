from fastapi import APIRouter,HTTPException
from models.book_models import BookCreate,BookInventory,BookResponse,BorrowedBook
from database.books_db import books
from datetime import datetime, timezone
from typing import Optional


borrow_router=APIRouter()

@borrow_router.get("/{book_id}/borrow")
def borrow_book(book_id:int,borrower_name:str):
    for book in books:
        if book.book_id==book_id and book.isAvailable:
            book.isAvailable=False
            borrowed_instance=BorrowedBook(borrower_name=borrower_name,due_date=datetime.now(timezone.utc),Book=book.Book)
            return {"message":"Book borrowed","borrowed":borrowed_instance}
    raise HTTPException(status_code=404,detail="Book not found")

@borrow_router.post("/{book_id}/return")
def return_book(book_id:int):
    for book in books:
        if book.book_id==book_id:
            book.isAvailable=True
            return {"message":"Book returned succesfully"}
    raise HTTPException(status_code=404,detail="Book not found")