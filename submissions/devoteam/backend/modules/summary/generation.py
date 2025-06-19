import time
import json
import tiktoken
EMISSIONS_PER_SECOND = 0.000117
EMISSIONS_PER_TOKEN = 0.000021

def stream_response(client, prompt, model_name="mistralai/mistral-small-24b-instruct"):
    def generate():
        try:
            start_time = time.time()
            full_response = ""
            
            # Génération du résumé
            completion = client.chat.completions.create(
                model=model_name,
                messages=[{"role": "user", "content": prompt}],
                stream=True
            )
            
            for chunk in completion:
                content = chunk.choices[0].delta.content if hasattr(chunk.choices[0].delta, 'content') else None
                if content:
                    full_response += content
                    yield f"data: {json.dumps({'type': 'generating', 'content': content})}\n\n"

            # Calcul des émissions carbone
            duration = time.time() - start_time
            try:
                enc = tiktoken.encoding_for_model("gpt-3.5-turbo")
                total_tokens = len(enc.encode(prompt + full_response))
            except Exception:
                total_tokens = len((prompt + full_response).split())

            emissions = round((duration * EMISSIONS_PER_SECOND + total_tokens * EMISSIONS_PER_TOKEN), 5)
            yield f"data: {json.dumps({'type': 'emissions', 'emissions_gCO2': emissions})}\n\n"

        except Exception as e:
            error_message = str(e)
            print(f"Erreur dans la génération: {error_message}")
            yield f"data: {json.dumps({'type': 'error', 'message': error_message})}\n\n"
    return generate
