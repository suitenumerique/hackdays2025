from flask import Blueprint, request, jsonify
from services.pipeline import generate_document

bp = Blueprint("generator_bp", __name__, url_prefix="/api/generate")

@bp.post("")  # POST /api/generate
def generate_doc_route():
    data = request.get_json(silent=True)
    if not data:
        return jsonify(error="JSON invalide ou mal formé"), 400

    text          = data.get("text", "")
    ministry      = data.get("ministry", "")
    doc_type      = data.get("document_type", "")
    if not text or not ministry or not doc_type:
        return jsonify(error="Les champs 'text', 'ministry' et 'document_type' sont requis"), 400

    document = generate_document(text, ministry, doc_type)
    return jsonify(document=document)
