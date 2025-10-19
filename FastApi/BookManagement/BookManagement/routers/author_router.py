from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.sync_db import get_db
from schemas.authors import Author
from models.author_models import AuthorCreate, AuthorResponse, AuthorModel

author_router = APIRouter()


@author_router.post("/", response_model=AuthorModel, status_code=status.HTTP_201_CREATED)
def create_author(author: AuthorCreate, db: Session = Depends(get_db)):
    new_author = Author(**author.model_dump())
    db.add(new_author)
    db.commit()
    db.refresh(new_author)
    return new_author


@author_router.get("/", response_model=AuthorResponse)
def get_authors(db: Session = Depends(get_db)):
    authors = db.query(Author).all()
    return {"message": "Authors fetched successfully", "authors": authors}


@author_router.get("/{author_id}", response_model=AuthorModel)
def get_author(author_id: int, db: Session = Depends(get_db)):
    author = db.query(Author).filter(Author.author_id == author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    return author


@author_router.put("/{author_id}", response_model=AuthorModel)
def update_author(author_id: int, updated_author: AuthorCreate, db: Session = Depends(get_db)):
    author = db.query(Author).filter(Author.author_id == author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    for key, value in updated_author.model_dump().items():
        setattr(author, key, value)
    db.commit()
    db.refresh(author)
    return author


@author_router.delete("/{author_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_author(author_id: int, db: Session = Depends(get_db)):
    author = db.query(Author).filter(Author.author_id == author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    db.delete(author)
    db.commit()
    return None
