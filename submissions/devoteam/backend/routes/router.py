from flask import Blueprint, request, jsonify
from services.pipeline import detect_ministry

bp = Blueprint("router_bp", __name__, url_prefix="/api")

@bp.post("/route")
def route_ministry():
    data = request.get_json(silent=True)
    if not data or "text" not in data:
        return jsonify(error="Le champ 'text' est requis"), 400
    text = data["text"]
    if not text:
        return jsonify(error="Le champ 'text' ne peut être vide"), 400
    ministry = detect_ministry(text)
    return jsonify(ministry=ministry)
