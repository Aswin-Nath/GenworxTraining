import time
from fastapi import FastAPI,Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
app=FastAPI()
origins=["http://localhost:3000"]
app.add_middleware(CORSMiddleware,allow_origins=origins,allow_credentials=True,allow_headers=["*"],allow_methods=["GET","POST","OPTIONS"])

TrustedHostMiddleware(app,allowed_hosts=["https://example.com/"])
GZipMiddleware(app,minimum_size=100,compresslevel=3)


@app.middleware("http")
async def RequestTimerMiddleware(request:Request,call_next):
    start_time=time.perf_counter()
    response=await call_next(request)
    time_taken=time.perf_counter()-start_time
    print(f"TIME TAKEN {time_taken} REQUEST METHOD {request.method} REQUEST URl {request.url}")
    return response


@app.middleware("http")
async def HeaderInjectorMiddleware(request:Request,call_next):
    response=await call_next(request)
    response.headers["X-App-Name"]="Book Management API"
    return response

@app.middleware("http")
async def RequestErrorMiddleware(request:Request,call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as error:
        return JSONResponse(content={"error": error,"path": request.url,"timestamp": time.time()},status_code=500)

@app.middleware("http")
async def RequestLoggerMiddleware(request:Request,call_next):
    method=request.method
    url=request.url
    body=await request.body()
    response=await call_next(request)
    status_code=response.status_code
    print("URL",url,"METHOD",method)
    print("BODY",body)
    print("RESPONSE_CODE",status_code)
    return response

@app.get("/")
def welcome(name:int):
    return {"message":"Hello world"}