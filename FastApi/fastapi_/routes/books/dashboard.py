from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
import httpx

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.get("/books/dashboard")
async def get_books_1(request: Request):
    transport = httpx.ASGITransport(app=request.app)
    async with httpx.AsyncClient(transport=transport, base_url=str(request.base_url)) as client:
        path = request.app.url_path_for("get_all_books")
        books = await client.get(path, params={"token": "AB101"})
        books.raise_for_status()
        books = books.json()
    return templates.TemplateResponse("book_list.html", {"request": request, "books": books})