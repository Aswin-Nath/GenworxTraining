from fastapi import FastAPI,Request,HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from routes.books.dashboard import router
import contextvars
from routes.books.book import data


request_var=contextvars.ContextVar("request",default=None)

app=FastAPI()
app.include_router(router)
app.mount("/static",StaticFiles(directory="static"),name="static")
templates=Jinja2Templates(directory="templates")
templates.env.globals["get_request"] = lambda: request_var.get()
@app.middleware("http")
async def ErroHandler(request:Request,call_next):
    try:
        response=await call_next(request)
        if response.status_code==404:
            return templates.TemplateResponse('404.html',{"request":request},status_code=404)
        return response
    except Exception as Error:
        raise HTTPException(status_code=500,detail=f"Error occured {Error}")

templates.env.globals["get_request"] = lambda: request_var.get()
@app.middleware("http")
async def store_request_middleware(request: Request, call_next):
    token = request_var.set(request)
    request.state.app_name="Book Management"
    response = await call_next(request)
    request_var.reset(token)
    return response


@app.get("/",response_class=HTMLResponse)
def hello_world(request:Request):
    return templates.TemplateResponse("home.html",{"request":request})

@app.get("/greet/{username}")
def greet_user(request:Request,username:str):
    return templates.TemplateResponse("greet.html",{"request":request,"name":username})

@app.get("/books")
def display_books(request:Request):
    return templates.TemplateResponse("book_list.html",{"request":request,"books":data})

@app.get("/about")
def display_about(request:Request):
    return templates.TemplateResponse("about.html",{"request":request})