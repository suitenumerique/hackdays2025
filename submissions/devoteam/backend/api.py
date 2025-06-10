import json
import logging
import traceback
import csv
import os
import io
from typing import Dict, Any, Optional
from flask import Flask, request, jsonify, render_template,send_file,Response, stream_with_context
from sentence_transformers import SentenceTransformer
from modules.processing.file import process_file
from modules.processing.clean import clean_text
from modules.processing.chunking import split_text_into_chunks
from modules.embeddings.builder import build_faiss_index, embed_chunks
from modules.embeddings.search import search_best_chunks
from modules.summary.prompt import generate_dynamic_prompt
from modules.summary.generation import stream_response
from modules.doc_generator.parser import parse_html_to_docx
from modules.doc_generator.pdf_creator import parse_html_to_pdf
from modules.generator.generation import generate_stream
from utils import get_client 
from io import BytesIO
from routes import router_bp, classifier_bp, generator_bp
from services.pipeline import detect_ministry, detect_doc_type, generate_document
import pdfkit
from jinja2 import Environment, FileSystemLoader, TemplateNotFound
import tempfile


app = Flask(__name__, template_folder='./../frontend/templates',static_folder='./../frontend/static')

app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
#Chargement global du modèle SentenceTransformer
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
last_summary_pdf = None
# Enregistrement des blueprints API
app.register_blueprint(router_bp)
app.register_blueprint(classifier_bp)
app.register_blueprint(generator_bp)

@app.route('/summary')
def index1():
    return render_template('summary.html')


@app.route('/docgen')
def docgen():
    return render_template('docgen_v2.html')

# Endpoint full pipeline (routage → classification → génération)
@app.post("/api/full_pipeline")
def full_pipeline():
    data = request.get_json(silent=True)
    if not data or "text" not in data:
        return jsonify(error="Le champ 'text' est requis"), 400

    text = data["text"]
    try:
        ministry = detect_ministry(text)
        doc_type = detect_doc_type(text, ministry)
        document = generate_document(text, ministry, doc_type)
    except Exception as e:
        return jsonify(error=str(e)), 500

    return jsonify(
        ministry=ministry,
        document_type=doc_type,
        document=document
    )

@app.route('/resumer', methods=['POST'])
def resumer_stream():
    language = request.form.get("language", "francais")
    files = request.files.getlist("files")
    sections_raw = request.form.get('sections')
    sections = json.loads(sections_raw) if sections_raw else []
    all_texts = [process_file(f, f.filename) for f in files]
    full_text = "\n".join(all_texts)
    cleaned = clean_text(full_text)
    chunks = split_text_into_chunks(cleaned)
    embeddings = embed_chunks(chunks, embedding_model)
    index = build_faiss_index(embeddings)
    query_embedding = embedding_model.encode(sections_raw, convert_to_numpy=True)
    best_indices = search_best_chunks(index, query_embedding)
    selected_chunks = [chunks[i] for i in best_indices if i < len(chunks)]
    context = "\n\n".join(selected_chunks)
    prm = generate_dynamic_prompt(context, sections, language)
    client = get_client()

    return Response(
        stream_with_context(stream_response(client, prm)()
),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        }
    )


@app.route('/telecharger-docx', methods=['POST'])
def telecharger_docx():
    # Récupérer le contenu HTML du résumé
    resume_html = request.form.get('content', '')

    doc = parse_html_to_docx(resume_html)
    # Sauvegarde dans un buffer
    file_stream = io.BytesIO()
    doc.save(file_stream)
    file_stream.seek(0)

    return send_file(
        file_stream,
        download_name="resume.docx",
        as_attachment=True
    )
# ------------------------------------------------------------------
# Routes pour servir les différentes pages du frontend
# ------------------------------------------------------------------
@app.route("/")
def tools_selection_page():
    # Page de sélection des prompts (index.html)
    return render_template("index.html")

@app.route("/chatbot")
def index():
    return render_template("chatbot.html")  


@app.route("/reformulation")
def reformulation_page():
    # Page de reformulation (reformulation.html)
    return render_template("reformulation.html")

@app.route("/generation")
def generation_page():
    # Page de génération (generation.html)
    return render_template("generation.html")

@app.route("/results")
def results_page():
    # Page des résultats (results.html)
    return render_template("results.html")

@app.route("/login")
def login_page():
    # Page des résultats (results.html)
    return render_template("login.html")

@app.route("/backlog")
def backlog_page():
    # Page des résultats (results.html)
    return render_template("template_backlog.html")
# ------------------------------------------------------------------
# Définition des modèles disponibles
# ------------------------------------------------------------------
models = {
    "A": "deepseek-ai/deepseek-r1-distill-qwen-7b",
    "B": "deepseek-ai/deepseek-r1-distill-qwen-14b",
    "C": "deepseek-ai/deepseek-r1-distill-qwen-32b",
    "D": "qwen/qwq-32b",  # Exemple de nom pour le modèle D
    "E": "mistralai/mistral-small-24b-instruct",  # Exemple de nom pour le modèle E
    "F": "meta/llama-3.1-405b-instruct",     # Exemple de nom pour le modèle F
    "G": "meta/llama-3.2-1b-instruct",
    "H": "meta/llama-3.2-3b-instruct",
    "I": "google/gemma-2b", 
    "J": "deepseek-ai/deepseek-r1-distill-llama-8b",
    "K": "tiiuae/falcon3-7b-instruct",
    "L": "meta/llama3-70b-instruct",
    "M": "writer/palmyra-creative-122b"
}

# ------------------------------------------------------------------
# Fonctions de validation et d'analyse du JSON d'évaluation
# ------------------------------------------------------------------
def validate_evaluation_json(evaluation_data: Dict[str, Any]) -> bool:
    if not isinstance(evaluation_data, dict):
        raise PromptReformulationError("Le format des données d'évaluation est invalide (dictionnaire attendu)")
    if "évaluation" not in evaluation_data:
        raise PromptReformulationError("Clé 'évaluation' manquante dans les données d'évaluation")
    if not isinstance(evaluation_data["évaluation"], list):
        raise PromptReformulationError("Le format de l'évaluation est invalide (liste attendue)")
    if len(evaluation_data["évaluation"]) == 0:
        raise PromptReformulationError("La liste d'évaluation est vide")
    if "note" not in evaluation_data["évaluation"][-1]:
        raise PromptReformulationError("Note globale manquante dans le dernier élément d'évaluation")
    for i, criterion in enumerate(evaluation_data["évaluation"][:-1]):
        if "critère" not in criterion or "note" not in criterion:
            raise PromptReformulationError(f"Le critère à l'indice {i} n'a pas le format attendu")
    return True


# ------------------------------------------------------------------
# Fonction de génération de reformulation CoT
# ------------------------------------------------------------------
def generate_cot_prompt_stream(prompt: str, model: str, temperature: float = 0.6,
                               top_p: float = 0.7, top_k: Optional[int] = None):
    client = get_client()
    cot_request = f"""
    Transformez la requête suivante en une version explicite avec une approche "Chain of Thought" (CoT) avant d'y répondre.
    Encadrez la partie raisonnement interne avec <think> ... </think> :
    "{prompt}"
    """

    cot_completion = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": cot_request}],
        temperature=temperature,
        top_p=top_p,
        max_tokens=1024,
        stream=True
    )

    capture = False
    think_buffer = ""

    for chunk in cot_completion:
        content = chunk.choices[0].delta.content if hasattr(chunk.choices[0].delta, 'content') else None
        if content:
            while content:
                print(f"[BACKEND] Content chunk: {content}")  # Log du contenu
                if not capture:
                    start_index = content.find("<think>")
                    if start_index != -1:
                        yield content[:start_index]  # Stream la partie avant <think>
                        content = content[start_index + len("<think>"):]
                        capture = True
                    else:
                        yield content  # Continue à streamer normalement
                        break
                else:
                    end_index = content.find("</think>")
                    if end_index != -1:
                        think_buffer += content[:end_index]
                        content = content[end_index + len("</think>"):]
                        capture = False
                    else:
                        think_buffer += content
                        break



# ------------------------------------------------------------------
# Fonction pour stocker les résultats dans un CSV
# ------------------------------------------------------------------
def store_results(row: Dict[str, Any], filename="results.csv"):
    file_exists = os.path.isfile(filename)
    fieldnames = [
        "prompt_original", "model_cot", "model_response", "temperature", "top_p", "top_k",
        "evaluation_model", "reformulation_think_content", "reformulation_main_content",
        "response", "evaluation_details", "hallucination_phrases", "hallucination_probabilities",
        "hallucination_explanations", "weakest_criterion", "reformulated_prompt","inference_time_s",
        "num_tokens","emissions_gCO2"
    ]
    with open(filename, "a", newline='', encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        writer.writerow(row)


@app.route("/reformulate", methods=["POST"])
def reformulate():
    data = request.get_json()
    if not data or "original_prompt" not in data:
        return jsonify({"error": "Le champ 'original_prompt' est requis."}), 400

    original_prompt = data["original_prompt"]
    temperature = float(data.get("temperature", 0.6))
    top_p = float(data.get("top_p", 0.7))
    top_k = int(data.get("top_k", 40))
    model_key = data.get("model_cot", "A")
    model_used = models.get(model_key, "meta/llama-3.2-1b-instruct")

    def generate():
        try:
            for chunk in generate_cot_prompt_stream(
                original_prompt,
                model=model_used,
                temperature=temperature,
                top_p=top_p,
                top_k=top_k
            ):
                yield f"data: {chunk}\n\n"
        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"

    return Response(stream_with_context(generate()), mimetype="text/event-stream")
    
# ------------------------------------------------------------------
# Routes de l'API Flask pour la génération, la reformulation, l'itération, etc.
# ------------------------------------------------------------------
@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    if not data or "prompt" not in data:
        return jsonify({"error": "Le champ 'prompt' est requis."}), 400

    prompt = data["prompt"]
    print(f"[BACKEND] Prompt reçu : {prompt}")  # Log du prompt reçu
    if "backlog" in prompt:
        prompt=prompt + """Génère une réponse sous forme de tableau Markdown basé sur la requête suivante. Le tableau doit inclure les colonnes "ID", "User Story", "Priorité", "Estimation" et "Statut". Fournis au moins une ligne de données pertinente pour la requête. Ne donne que le tableau Markdown, sans texte supplémentaire avant ou après.

        Exemple de format de tableau Markdown attendu :

        | ID   | User Story                                                           | Priorité | Estimation | Statut  |
        |------|----------------------------------------------------------------------|----------|------------|---------|
        | US01 | En tant qu'utilisateur, je veux que mes messages soient corrigés... | Haute    | 8 pts      | À faire |
        | US02 | En tant qu'utilisateur, je veux que mes messages soient reformulés...| Moyenne  | 5 pts      | À faire |
        """
        print("yessssssssssssssssssssssssss")
        print(prompt)
    prompt = prompt + "Ne détaille pas ton processus de réflexion et réponds uniquement en français."
    #print(prompt)
    model_response_key = data.get("model_response", "A")
    temperature = data.get("temperature", 0.6)
    top_p = data.get("top_p", 0.7)
    top_k = data.get("top_k", 40)
    model_response = models.get(model_response_key, "meta/llama3-8b-instruct")
    client = get_client()

    
    return Response(
        stream_with_context(generate_stream(client,prompt, model_response, temperature, top_p)),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        }
    )




config = pdfkit.configuration(wkhtmltopdf='C:/wkhtmltox/bin/wkhtmltopdf.exe')
@app.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    try:
        print("Début de la génération du PDF")
        # Si on reçoit du JSON (application/json)
        if request.is_json:
            print("Requête JSON détectée")
            data = request.get_json()
            print(f"Données reçues: {data}")

            if 'items' in data:
                print("Génération du backlog")
                template_data = {
                    'title': data.get('title', 'Product Backlog'),
                    'items': data.get('items', [])
                }
                # Configuration du chemin de base pour les templates
                base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../frontend/templates'))
                print(f"Chemin des templates: {base_dir}")
                 # Charger le template HTML
                env = Environment(loader=FileSystemLoader(base_dir))
                template = env.get_template('template_backlog.html')

                # Rendre le template avec les données
                html_content = template.render(template_data)
                print("Template rendu avec succès")
                
                # Configuration de wkhtmltopdf
                  # Chemin Windows
                # Chemin absolu à utiliser comme "racine" des chemins relatifs (ex: ../static/...)
                base_url = base_dir  # Cela remonte à `frontend/templates`, donc `../static` pointe vers `frontend/static`

                options = {
                    'enable-local-file-access': '',
                    'quiet': ''
                }
                # Générer le PDF
                pdf_bytes = pdfkit.from_string(
                    html_content,
                    False,
                    configuration=config,
                    options=options
                )
                print("PDF généré avec succès")

                file_stream = io.BytesIO(pdf_bytes)
                file_stream.seek(0)
                return send_file(
                    file_stream,
                    download_name="product_backlog.pdf",
                    as_attachment=True,
                    mimetype='application/pdf'
                )
            

            elif 'html' in data:
                print("Génération du PDF à partir d'un HTML")
                # Assurez-vous que 'html' est bien extrait des données
                html_content = data.get('html', '') # Utilisez data.get('html', '') pour gérer le cas où 'html' est manquant
                if not html_content:
                     return jsonify({'error': 'Le champ "html" est manquant ou vide dans la requête.'}), 400

                # **Correction pour l'encodage :**
                # Ajouter la balise meta charset au début du HTML si elle n'est pas déjà présente
                if '<meta charset=' not in html_content.lower():
                    # Trouver la position juste après <head> ou <html>
                    head_end = html_content.lower().find('</head>')
                    if head_end != -1:
                         html_content = html_content[:head_end] + '<meta charset="UTF-8">' + html_content[head_end:]
                    else: # Ajouter après <html> si pas de <head> (moins idéal mais fonctionnel)
                         html_content = '<meta charset="UTF-8">' + html_content
                with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmpfile:
                    # Utiliser html_content ici
                    options = {
                    'enable-local-file-access': '', # Permet l'accès aux fichiers locaux
                    'encoding': 'UTF-8', # Option d'encodage répétée pour plus de sûreté
                    'no-outline': None,
                    'margin-top': '10mm',
                    'margin-right': '10mm',
                    'margin-bottom': '10mm',
                    'margin-left': '10mm',
                    'footer-center': 'Page [page] sur [topage]', # Ajout de la numérotation des pages
                    'footer-font-size': '8',
                    'footer-spacing': '5'
                    }
                    pdfkit.from_string(html_content, tmpfile.name,configuration=config,options=options)
                    return send_file(tmpfile.name, as_attachment=True, download_name="analyse_risques.pdf")
                
                # Si la requête est JSON mais ne contient ni 'items' ni 'html'
            else:
                 print("Requête JSON sans données valides (items ou html)")
                 return jsonify({'error': 'Requête JSON invalide: Le champ "items" ou "html" est requis.'}), 400
           
    except Exception as e:
            print(f"Erreur lors de la génération du PDF: {str(e)}")
            print(f"Traceback: {traceback.format_exc()}")
            return jsonify({'error': str(e)}), 500
        
if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5002)