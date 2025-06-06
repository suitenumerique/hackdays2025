from openai import OpenAI
from config import Config
# ------------------------------------------------------------------
# Fonction pour obtenir un client OpenAI
# ------------------------------------------------------------------

def get_client():
    return OpenAI(
        base_url=Config.OPENAI_BASE_URL,
        api_key=Config.API_KEY_NVIDIA
    )








