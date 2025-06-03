from pathlib import Path
from services.llm_client import LLMClient
from services.prompt_loader import PromptLoader
from config import Config

BASE_DIR    = Path(__file__).resolve().parent.parent
PROMPTS_DIR = BASE_DIR / "prompts"
llm         = LLMClient()

def detect_ministry(text: str) -> str:
    yaml_path = str(PROMPTS_DIR / "router.yaml")
    meta      = PromptLoader.load_yaml(yaml_path)
    prompt    = PromptLoader.render(yaml_path, text=text, ministries=meta["ministries"])
    return llm.chat(
        Config.ROUTER_MODEL,
        [{"role": "user", "content": prompt}],
        Config.TEMPERATURE_ROUTER
    )

def detect_doc_type(text: str, ministry: str) -> str:
    yaml_path = str(PROMPTS_DIR / "classifier.yaml")
    meta      = PromptLoader.load_yaml(yaml_path)
    prompt    = PromptLoader.render(
        yaml_path,
        ministry=ministry,
        text=text,
        doc_types=meta["doc_types"]
    )
    return llm.chat(
        Config.CLASSIFIER_MODEL,
        [{"role": "user", "content": prompt}],
        Config.TEMPERATURE_CLASSIF
    )

def generate_document(text: str, ministry: str, doc_type: str) -> str:
    yaml_path = str(PROMPTS_DIR / "generator.yaml")
    prompt    = PromptLoader.render(
        yaml_path,
        ministry=ministry,
        doc_type=doc_type,
        text=text
    )
    return llm.chat(
        Config.GENERATOR_MODEL,
        [{"role": "user", "content": prompt}],
        Config.TEMPERATURE_GEN
    )
