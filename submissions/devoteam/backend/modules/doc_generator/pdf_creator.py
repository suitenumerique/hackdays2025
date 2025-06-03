from bs4 import BeautifulSoup
from fpdf import FPDF
import os
class PDF(FPDF):
    def __init__(self):
        super().__init__()
        # ✅ Calcule le chemin ABSOLU vers la police depuis CE fichier
        font_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "../../../../all-in-one/frontend/fonts/DejaVuSans.ttf")
        )

        # ✅ Optionnel : aide au débogage
        print("Font path:", font_path)
        # Vérification optionnelle
        if not os.path.exists(font_path):
            raise FileNotFoundError(f"Font file not found at {font_path}")
        self.add_font("DejaVu", "", font_path, uni=True)
        self.add_font("DejaVu", "B", font_path, uni=True)
        self.set_font("DejaVu", "", 12)

    def header(self):
        self.set_font("DejaVu", "B", 16)
        self.cell(0, 10, "Réponse", ln=True, align="C")
        self.ln(10)

    def chapter_title(self, title):
        self.set_font("DejaVu", "B", 14)
        self.set_text_color(50, 50, 50)
        self.cell(0, 10, title, ln=True)
        self.ln(5)

    def paragraph(self, text, bold=False):
        self.set_font("DejaVu", "B" if bold else "", 12)
        self.set_text_color(0, 0, 0)
        self.multi_cell(0, 10, text)
        self.ln(1)

def parse_html_to_pdf(content_html: str) -> FPDF:
    soup = BeautifulSoup(content_html, 'html.parser')
    pdf = PDF()
    pdf.add_page()

    for element in soup.contents:
        if element.name == 'h3':
            pdf.chapter_title(element.get_text(strip=True))
        elif element.name == 'b':
            pdf.paragraph(element.get_text(strip=True), bold=True)
        elif element.name == 'br':
            pdf.ln(5)
        elif element.name is None:
            if element.strip():
                pdf.paragraph(element.strip())
        else:
            pdf.paragraph(element.get_text(strip=True))

    return pdf  # ⬅️ on retourne l'objet PDF
