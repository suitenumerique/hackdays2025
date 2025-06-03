def extract_text_from_image(file_obj):
    text = ""
    try:
        image = Image.open(file_obj)
        text = pytesseract.image_to_string(image)
    except Exception as e:
        raise ValueError(f"Erreur lors de l'extraction de l'image: {e}")
    return text