from typing import Dict, Any
from utils import get_client
import json
import re
import logging

# Configuration du logger
logger = logging.getLogger(__name__)

# ------------------------------------------------------------------
# Exception personnalisée pour la reformulation de prompt
# ------------------------------------------------------------------
class PromptReformulationError(Exception):
    """Exception personnalisée pour les erreurs de reformulation de prompt"""
    pass

# ------------------------------------------------------------------
# Fonction d'évaluation de réponse
# ------------------------------------------------------------------
def evaluate_response(question: str, response: str) -> str:
    client = get_client()
    evaluation_model = "deepseek-ai/deepseek-r1-distill-qwen-14b"
    evaluation_prompt = f"""
    Vous êtes un évaluateur expert chargé d'évaluer une réponse selon les critères suivants.

    1. **Pertinence contextuelle** (0-25) : La réponse est-elle directement liée à la question ?
    2. **Exhaustivité** (0-25) : La réponse couvre-t-elle tous les aspects essentiels sans omission ?
    3. **Conformité aux bonnes pratiques** (0-25) : Suit-elle les normes et méthodes reconnues ?
    4. **Absence d'erreurs critiques** (0-25) : Contient-elle des erreurs factuelles ou logiques ?

    **⚠️ TRES IMPORTANT** :
    - Aucune réponse ne peut atteindre 100/100. Sanctionnez toute imprécision ou exagération.
    - La note globale doit être strictement la somme des critères ci-dessus.

    **Pour le fact-checking :**
    - Chaque phrase sans source ou preuve concrète doit être marquée avec un risque d'hallucination de 10-30%.
    - Pour chaque phrase suspecte, précisez le type d'hallucination parmi :
      "Pertinence contextuelle", "Exhaustivité", "Conformité aux bonnes pratiques", ou "Absence d'erreurs critiques".

    **Question posée :**
    {question}

    **Réponse à évaluer :**
    {response}

    **Format de sortie attendu (strictement JSON) :**
    ```json
    {{
        "évaluation": [
            {{"critère": "Pertinence contextuelle", "note": <Note>, "explication": "<Explication>"}},
            {{"critère": "Exhaustivité", "note": <Note>, "explication": "<Explication>"}},
            {{"critère": "Conformité aux bonnes pratiques", "note": <Note>, "explication": "<Explication>"}},
            {{"critère": "Absence d'erreurs critiques", "note": <Note>, "explication": "<Explication>"}},
            {{"note": <Note_global>}}
        ],
        "fact-checking": [
            {{
                "phrase": "Phrase 1 suspecte",
                "hallucination_prob": <10-30>,
                "explication": "<Type d'hallucination>"
            }},
            {{
                "phrase": "Phrase 2 suspecte",
                "hallucination_prob": <10-30>,
                "explication": "<Type d'hallucination>"
            }},
            {{
                "phrase": "Phrase 3 suspecte",
                "hallucination_prob": <10-30>,
                "explication": "<Type d'hallucination>"
            }}
        ]
    }}
    ```
    Répondez uniquement en JSON sans texte supplémentaire.
    """
    try:
        eval_completion = client.chat.completions.create(
            model=evaluation_model,
            messages=[{"role": "user", "content": evaluation_prompt}],
            temperature=0.8,
            top_p=0.7,
            max_tokens=4096,
            stream=False
        )
        raw_response = eval_completion.choices[0].message.content
        print(f"Réponse brute du modèle: {raw_response}")
        
        cleaned_response = clean_json_response(raw_response)
        print(f"Réponse nettoyée: {cleaned_response}")
        
        try:
            json_response = json.loads(cleaned_response)
            evaluation = json_response.get("évaluation", [])
            total = 0
            for critere in evaluation:
                if "critère" in critere:
                    try:
                        total += float(critere.get("note", 0))
                    except (ValueError, TypeError):
                        logger.warning(f"Note invalide pour le critère {critere.get('critère')}: {critere.get('note')}")
                        pass

            # On ajoute "critère": "Total" pour remplacer "undefined" dans l'affichage
            note_globale = {
                "critère": "Total", 
                "note": total, 
                "explication": "Somme des notes des critères d'évaluation."
            }
            
            evaluation = [crit for crit in evaluation if "critère" in crit] + [note_globale]
            json_response["évaluation"] = evaluation

            return json.dumps(json_response)
        except json.JSONDecodeError as e:
            logger.error(f"Erreur de décodage JSON: {str(e)}")
            logger.error(f"JSON invalide: {cleaned_response}")
            raise PromptReformulationError(f"JSON invalide retourné par le modèle d'évaluation: {str(e)}")
    except Exception as e:
        logger.error(f"Erreur lors de l'évaluation: {str(e)}", exc_info=True)
        raise PromptReformulationError(f"Erreur lors de l'évaluation: {str(e)}")


def predict_quality(evaluation: Dict[str, Any]) -> Dict[str, Any]:
    global_note = None
    for crit in evaluation.get("évaluation", []):
        if crit.get("critère") == "Total":
            try:
                global_note = float(crit.get("note", 0))
            except (ValueError, TypeError):
                global_note = 0

    if global_note is None:
        global_note = 0
    if global_note >= 90:
        quality = "Excellent"
        confidence = 0.95
    elif global_note >= 75:
        quality = "Bon"
        confidence = 0.90
    elif global_note >= 50:
        quality = "Moyen"
        confidence = 0.80
    elif global_note >= 25:
        quality = "À améliorer"
        confidence = 0.70
    else:
        quality = "Insuffisant"
        confidence = 0.65
    return {
        "quality_prediction": quality,
        "confidence": confidence,
        "global_note": global_note
    }
# ------------------------------------------------------------------
# Fonction utilitaire pour nettoyer une réponse JSON
# ------------------------------------------------------------------



logger = logging.getLogger(__name__)



def clean_json_response(response_text: str) -> str:
    # Supprimer uniquement les balises <think> (pas leur contenu)
    response_text = response_text.replace("<think>", "").replace("</think>", "")

    # Extraire le JSON si présent entre ```json ... ```
    match = re.search(r"```json\s*(.*?)\s*```", response_text, re.DOTALL)
    if match:
        return match.group(1).strip()

    # Sinon, retourner tout le texte nettoyé
    return response_text.strip()
