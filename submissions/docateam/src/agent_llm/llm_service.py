from fastapi import HTTPException, Request
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()

client = OpenAI(
    base_url = 'https://albert.api.etalab.gouv.fr/v1',
    api_key=os.getenv('API_KEY'),
)

app = FastAPI()

class LLMRequest(BaseModel):
    prompt: str

@app.post("/llm/query", tags=["LLM"])
async def query_llm(request: LLMRequest):
    try:
        response = client.chat.completions.create(
            model="albert-small",
            messages=[{"role": "user", "content": request.prompt}],
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Documentation Swagger
@app.get("/", include_in_schema=False)
async def root():
    return {"message": "Accédez à /docs pour la documentation Swagger"}