def extract_text_from_txt(file_obj):
    try:
        text = file_obj.read().decode("utf-8")
    except Exception as e:
        raise ValueError(f"Erreur lors de l'extraction du TXT: {e}")
        text = ""
    return text