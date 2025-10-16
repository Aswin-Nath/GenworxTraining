from fastapi import APIRouter,Request
from fastapi.templating import Jinja2Templates
from .book import get_all_books
router=APIRouter()
templates=Jinja2Templates(directory="../../templates")
@router.get("/books/dashboard")
async def get_books_1(request:Request):
    response=get_all_books()
    return templates.TemplateResponse("book_list.html",{"request":request,"books":response})