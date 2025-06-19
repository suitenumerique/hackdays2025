import os
from dotenv import load_dotenv


load_dotenv()

class Config:
    OPENAI_API_KEY      = os.getenv("OPENAI_API_KEY")
    OPENAI_BASE_URL     = os.getenv("OPENAI_BASE_URL", "https://integrate.api.nvidia.com/v1")

    #ROUTER_MODEL        = os.getenv("ROUTER_MODEL", "mistralai/mistral-small-24b-instruct")
    #CLASSIFIER_MODEL    = os.getenv("CLASSIFIER_MODEL", "mistralai/mistral-small-24b-instruct")
    #GENERATOR_MODEL     = os.getenv("GENERATOR_MODEL", "mistralai/mistral-small-24b-instruct")

    ROUTER_MODEL        = os.getenv("ROUTER_MODEL", "meta/llama-3.2-1b-instruct")
    CLASSIFIER_MODEL    = os.getenv("CLASSIFIER_MODEL", "meta/llama-3.2-1b-instruct")
    GENERATOR_MODEL     = os.getenv("GENERATOR_MODEL", "meta/llama-3.2-1b-instruct")


    TEMPERATURE_ROUTER  = float(os.getenv("TEMP_ROUTER", 0.0))
    TEMPERATURE_CLASSIF = float(os.getenv("TEMP_CLASSIF", 0.2))
    TEMPERATURE_GEN     = float(os.getenv("TEMP_GEN", 0.2))

    API_KEY_NVIDIA      = os.getenv("API_KEY_NVIDIA")
