from typing import Optional
import json
import logging
import time
import tiktoken
# Configuration du logger
logger = logging.getLogger(__name__)

# ------------------------------------------------------------------
# Fonction de reformulation de réponse via modèle
# ------------------------------------------------------------------
def reformulate_model_response(client, prompt: str, model: str, temperature: float = 0.6,
                            top_p: float = 0.7, top_k: Optional[int] = None):
    try:
        params = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
            "top_p": top_p,
            "max_tokens": 4096,
            "stream": True
        }
        if top_k is not None:
            params["top_k"] = top_k

        completion = client.chat.completions.create(**params)

        full_response = ""
        for chunk in completion:
            content = chunk.choices[0].delta.content if hasattr(chunk.choices[0].delta, 'content') else None
            if content:
                full_response += content
                yield json.dumps({
                    "type": "reformulating",
                    "message": content
                })

    except Exception as e:
        # Logger l'erreur dans le backend
        logger.error(f"Erreur lors de la reformulation: {str(e)}", exc_info=True)
        # Envoyer l'erreur au frontend dans le bon format
        yield json.dumps({
            "type": "error",
            "message": str(e)
        })

def reformulate_stream(client,prompt, model_response, temperature, top_p):
    total_time = 0
    total_calls = 0
    full_response = ""

    try:
        start_time = time.time()
        for chunk_json in reformulate_model_response(client,prompt, model_response, temperature, top_p):
            chunk = json.loads(chunk_json)
            full_response += chunk["message"]
            yield f"data: {json.dumps({'type': 'reformulating', 'content': chunk['message']})}\n\n"


        # Signal de fin de génération
        yield f"data: {json.dumps({'type': 'completed', 'content': full_response})}\n\n"

        # Calcul empreinte carbone
        duration = time.time() - start_time
        try:
            
            enc = tiktoken.encoding_for_model("gpt-3.5-turbo")
            total_tokens = len(enc.encode(prompt + full_response))
        except Exception:
            total_tokens = len((prompt + full_response).split())

        emissions_per_second = 0.000117
        emissions_per_token = 0.000021
        emissions = round((duration * emissions_per_second + total_tokens * emissions_per_token), 5)

        yield f"data: {json.dumps({'type': 'emissions', 'emissions_gCO2': emissions})}\n\n"

    except Exception as e:
        yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
