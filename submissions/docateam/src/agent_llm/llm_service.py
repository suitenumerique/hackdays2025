import json
import os
import re

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from langchain_core.prompts import PromptTemplate
from openai import OpenAI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from .prompt_template import (
    json_exemple,
    last_slide_template,
    prompt_generic,
    slide1_template,
)

load_dotenv()

client = OpenAI(
    base_url="https://albert.api.etalab.gouv.fr/v1",
    api_key=os.getenv("API_KEY"),
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autorise toutes les origines
    allow_methods=["*"],  # Autorise toutes les méthodes (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Autorise tous les en-têtes
)

class LLMRequest(BaseModel):
    prompt: str


class GenerateJSONRequest(BaseModel):
    client_request: str


@app.post("/llm/query", tags=["LLM"])
async def query_llm(request: LLMRequest):
    try:
        response = client.chat.completions.create(
            model="albert-large",
            messages=[{"role": "user", "content": request.prompt}],
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-json-text", tags=["LLM"])
async def generate_json_text(
    client_request: str = Query(
        ..., description="Requête utilisateur pour la génération de slides"
    )
):
    try:
        prompt_template = PromptTemplate.from_template(prompt_generic)
        final_prompt = prompt_template.format(
            slide2_template=json_exemple,
            slide1_template=slide1_template,
            last_slide_template=last_slide_template,
            client_request=client_request,
        )
        print("[LOG] Prompt envoyé au LLM:\n", final_prompt)
        response = client.chat.completions.create(
            model="albert-small",
            messages=[{"role": "user", "content": final_prompt}],
        )
        content = response.choices[0].message.content
        extract_json = re.search(r"({.*})", content, re.DOTALL)
        if extract_json:
            final_output = extract_json.group(1)
            try:
                json_obj = json.loads(final_output)
                return json_obj
            except Exception:
                return final_output
        else:
            print("[LOG] Aucun JSON valide trouvé dans la réponse de l'IA.")
            raise HTTPException(
                status_code=500,
                detail="Aucun JSON valide trouvé dans la réponse de l'IA.",
            )
    except Exception as e:
        print("[LOG] Erreur lors de la génération:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# Documentation Swagger
@app.get("/", include_in_schema=False)
async def root():
    return {"message": "Accédez à /docs pour la documentation Swagger"}
