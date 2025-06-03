import pandas as pd
def extract_text_from_xlsx(file_obj):
    text = ""
    try:
        df = pd.read_excel(file_obj)
        text = df.to_string()
    except Exception as e:
        raise ValueError(f"Erreur lors de l'extraction du XLSX: {e}")
    return text