import zipfile
def extract_text_from_zip(file_obj):
    full_text = ""
    try:
        with zipfile.ZipFile(file_obj) as z:
            for name in z.namelist():
                ext = name.split('.')[-1].lower()
                if ext in ["pdf", "docx", "pptx", "xlsx", "txt", "jpg", "jpeg", "png"]:
                    with z.open(name) as f:
                        full_text += process_file(f, name) + "\n"
    except Exception as e:
        raise ValueError(f"Erreur lors de l'extraction du zip: {e}")
    return full_text