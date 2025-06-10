import docx
def extract_text_from_docx(file_obj):
    text = ""
    try:
        doc = docx.Document(file_obj)
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        raise ValueError(f"Erreur lors de l'extraction du DOCX: {e}")
    return text