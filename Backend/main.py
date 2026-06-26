from fastapi import FastAPI, Depends
from routes.urlshort import router as urlshort
from routes.decodeurl import router as decode

app = FastAPI()

app.include_router(urlshort,prefix="/URLShortner",tags=["URL"])
app.include_router(decode,prefix="/URLShortner",tags=['URL'])
