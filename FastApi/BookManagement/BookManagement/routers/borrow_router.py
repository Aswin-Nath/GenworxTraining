from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from database.sync_db import get_db
from schemas.books import Book
from models.book_models import BorrowedBook,BookBase

borrow_router = APIRouter()

@borrow_router.get("/{book_id}", response_model=BorrowedBook)
def borrow_book(book_id: int, borrower_name: str, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.book_id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if not book.isAvailable:
        raise HTTPException(status_code=400, detail="Book already borrowed")
    book.is_available = False
    db.commit()
    db.refresh(book)
    return BorrowedBook(
        borrower_name=borrower_name,
        due_date=datetime.now(timezone.utc),
        Book=BookBase.model_validate(book)
    )

@borrow_router.post("/{book_id}/return")
def return_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.book_id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    book.is_available = True
    db.commit()
    db.refresh(book)
    return {"message": f"Book '{book.title}' returned successfully"}
