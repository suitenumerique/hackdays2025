import fitz
def extract_text_from_pdf(file_obj):
    text = ""
    try:
        doc = fitz.open(stream=file_obj.read(), filetype="pdf")
        for page in doc:
            text += page.get_text() + "\n"
    except Exception as e:
        raise ValueError(f"Erreur lors de l'extraction du PDF: {e}")
    return text