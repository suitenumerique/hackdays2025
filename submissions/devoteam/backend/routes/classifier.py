from flask import Blueprint, request, jsonify
from services.pipeline import detect_doc_type

bp = Blueprint("classifier_bp", __name__, url_prefix="/api/classify")

@bp.post("")  # POST /api/classify
def classify_document():
    data = request.get_json(silent=True)
    if not data:
        return jsonify(error="JSON invalide ou mal formé"), 400

    text     = data.get("text", "")
    ministry = data.get("ministry", "")
    if not text or not ministry:
        return jsonify(error="Les champs 'text' et 'ministry' sont requis"), 400

    doc_type = detect_doc_type(text, ministry)
    return jsonify(document_type=doc_type)
