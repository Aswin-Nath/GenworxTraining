# from fastapi import FastAPI
# from fastapi
from fastapi import FastAPI,Request,HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime
from app.routers.author_router import author_router
from app.routers.book_router import book_router
from app.routers.borrow_router import borrow_router
from app.routers.user_router import user_router
app=FastAPI()
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "timestamp": datetime.utcnow().isoformat(),
            "error": {
                "type": "HTTPException",
                "message": exc.detail or "An unexpected error occurred.",
                "status_code": exc.status_code,
                "path": request.url.path,
                "method": request.method,
            },
        },
    )
app.include_router(author_router,prefix="/authors",tags=["Authors"])
app.include_router(book_router,prefix="/books",tags=["Books"])
app.include_router(borrow_router,prefix="/books",tags=["Borrows"])
app.include_router(user_router,prefix="/users",tags=["Users"])

app.add_exception_handler(HTTPException, http_exception_handler)

@app.get("/")
def hello_world():
    return {"message":"Welcome to Library Booking Management"}

