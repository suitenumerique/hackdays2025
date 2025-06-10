import yaml
from jinja2 import Template

class PromptLoader:
    @staticmethod
    def load_yaml(path: str) -> dict:
        """Charge le YAML et renvoie un dict contenant 'template' et les métadonnées."""
        with open(path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)

    @staticmethod
    def render(path: str, **context) -> str:
        """Rend le template Jinja à partir du YAML et du contexte passé."""
        data = PromptLoader.load_yaml(path)
        template = Template(data["template"])
        return template.render(**context)
