from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.sync_db import get_db
from schemas.books import Book
from models.book_models import BookCreate, BookResponse, BookBase
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
book_router = APIRouter()

# @book_router.get("/{book_name}",response_model=BookResponse)
# def get_books_by_name(book_name:str,limit:int,offset:int,db:Session= Depends(get_db)):
#     books=db.query(Book).filter(Book.title.ilike(f"%{book_name}%")).offset(offset).limit(limit).all()
#     return {"message": "Books fetched successfully", "Books": books}


@book_router.get("/{book_name}", response_model=BookResponse)
async def get_books_by_name(
    book_name: str,
    limit: int,
    offset: int,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Book)
        .where(Book.title.ilike(f"%{book_name}%"))
        .offset(offset)
        .limit(limit)
    )
    books = result.scalars().all()

    return {"message": "Books fetched successfully", "Books": books}


@book_router.post("/", response_model=BookBase, status_code=status.HTTP_201_CREATED)
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    new_book = Book(**book.model_dump())
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book


@book_router.get("/", response_model=BookResponse)
def get_books(db: Session = Depends(get_db)):
    books = db.query(Book).all()
    formatted_books = [
        {
            "book_id": b.book_id,
            "Book": b
        }
        for b in books
    ]
    return {"message": "Books fetched successfully", "Books": formatted_books}


@book_router.get("/{book_id}", response_model=BookBase)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.book_id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@book_router.put("/{book_id}", response_model=BookBase)
def update_book(book_id: int, updated_book: BookCreate, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.book_id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    for key, value in updated_book.model_dump().items():
        setattr(book, key, value)
    db.commit()
    db.refresh(book)
    return book


@book_router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.book_id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
    return None


