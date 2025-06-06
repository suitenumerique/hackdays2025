from modules.extraction.pdf import extract_text_from_pdf
from modules.extraction.docx import extract_text_from_docx
from modules.extraction.pptx import extract_text_from_pptx
from modules.extraction.xlsx import extract_text_from_xlsx
from modules.extraction.txt import extract_text_from_txt
from modules.extraction.zip import extract_text_from_zip
from modules.extraction.images import extract_text_from_image
extractors = {
    "pdf": extract_text_from_pdf,
    "docx": extract_text_from_docx,
    "pptx": extract_text_from_pptx,
    "xlsx": extract_text_from_xlsx,
    "txt": extract_text_from_txt,
    "zip": extract_text_from_zip,
    "jpg": extract_text_from_image,
    "jpeg": extract_text_from_image,
    "png": extract_text_from_image,
}

def process_file(file_obj, file_name):
    ext = file_name.split('.')[-1].lower()
    func = extractors.get(ext)
    return func(file_obj) if func else ""