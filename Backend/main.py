from fastapi import FastAPI, Depends
from routes.urlshort import router as urlshort
from routes.decodeurl import router as decode
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(urlshort,prefix="/URLShortner",tags=["URL"])
app.include_router(decode,prefix="/URLShortner",tags=['URL'])
