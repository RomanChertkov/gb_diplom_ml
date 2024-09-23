import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pickle



app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

@app.post("/get-topics")
async def get_topics(texts: list[str]):
    with open('./text_classifier_sgd', 'rb') as trained_model:
        model = pickle.load(trained_model)
        
    predicted_topic = model.predict(list(texts))
    #predicted_topic = ['экономика', 'политика']
    return {'topics':list(predicted_topic)}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)