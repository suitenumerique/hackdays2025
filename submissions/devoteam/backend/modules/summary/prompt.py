# --- PROMPT DYNAMIQUE ---
def generate_dynamic_prompt(context, sections, language='francais'):
    if language=='francais':
        header = 'Tu es un assistant spécialisé en recherche scientifique. Génère un résumé structuré et sous forme des paragraphes avec :\n- Introduction\n'
        for s in sections: header += f'- {s}\n'
        header += '- Conclusion\n\nContenu extrait :\n' + context + '\n\nRédige le résumé suivant cette structure.'
    else:
        header = 'You are a scientific assistant. Generate a structured summary and in the form of paragraphs with :\n- Introduction\n'
        for s in sections:header += f'- {s}\n'
        header += '- Conclusion\n\nExtracted content:\n' + context + '\n\nWrite the summary following this structure.'

    return header