from unidecode import unidecode
import re
def clean_text(text):
    text = text.lower()
    text = unidecode(text)
    text = re.sub(r"[^a-z0-9\s.,;:?!'-]", " ", text)
    text = re.sub(r'\s+', ' ', text)
    return text