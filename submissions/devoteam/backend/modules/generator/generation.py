from typing import Optional
import json
import logging
import time
from modules.generator.evaluation import evaluate_response, predict_quality
# Configuration du logger
logger = logging.getLogger(__name__)

# ------------------------------------------------------------------
# Fonction de génération de réponse via modèle
# ------------------------------------------------------------------
def generate_model_response(client, prompt: str, model: str, temperature: float = 0.6,
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
        in_think_block = False
        for chunk in completion:
            content = chunk.choices[0].delta.content if hasattr(chunk.choices[0].delta, 'content') else None
            if content:
                # Vérifier si on entre dans un bloc think
                if "<think>" in content:
                    in_think_block = True
                    # Ne pas inclure le contenu avant <think>
                    content = content.split("<think>")[0]
                
                # Vérifier si on sort d'un bloc think
                if "</think>" in content:
                    in_think_block = False
                    # Ne garder que le contenu après </think>
                    content = content.split("</think>")[1]
                
                # N'ajouter le contenu que si on n'est pas dans un bloc think
                if not in_think_block and content:
                            # Envoyer la réponse complète une seule fois
                    yield json.dumps({
                        "type": "generating",
                        "message": content
                    })



    except Exception as e:
        # Logger l'erreur dans le backend
        logger.error(f"Erreur lors de la génération: {str(e)}", exc_info=True)
        # Envoyer l'erreur au frontend dans le bon format
        yield json.dumps({
            "type": "error",
            "message": str(e)
        })

def generate_stream(client,prompt, model_response, temperature, top_p):
    total_time = 0
    total_calls = 0
    full_response = ""

    try:
        start_time = time.time()
        for chunk_json in generate_model_response(client,prompt, model_response, temperature, top_p):
            chunk = json.loads(chunk_json)
            full_response += chunk["message"]
            yield f"data: {json.dumps({'type': 'generating', 'content': chunk['message']})}\n\n"


        # Signal de fin de génération
        yield f"data: {json.dumps({'type': 'completed', 'content': full_response})}\n\n"

        # Générer et envoyer l'évaluation
        try:
            evaluation_json_str = evaluate_response(prompt, full_response)
            evaluation_obj = json.loads(evaluation_json_str)
            quality_obj = predict_quality(evaluation_obj)
            
            yield f"data: {json.dumps({'type': 'evaluation', 'evaluation': evaluation_obj, 'quality': quality_obj})}\n\n"

        except Exception as eval_error:
            yield f"data: {json.dumps({'type': 'error', 'message': str(eval_error)})}\n\n"
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
