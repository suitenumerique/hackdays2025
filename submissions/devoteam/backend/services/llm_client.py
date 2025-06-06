from openai import OpenAI, OpenAIError
from config import Config

class LLMClient:
    def __init__(self):
        if not Config.OPENAI_API_KEY:
            raise RuntimeError("API key manquante")
        self.client = OpenAI(
            base_url=Config.OPENAI_BASE_URL,
            api_key=Config.OPENAI_API_KEY
        )

    def chat(self, model, messages, temperature, max_tokens=512):
        try:
            res = self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            return res.choices[0].message.content.strip()
        except OpenAIError as e:
            raise RuntimeError(f"Erreur LLM ({model}) : {e}")
