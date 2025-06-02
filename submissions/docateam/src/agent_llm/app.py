import os

import streamlit as st
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from openai import OpenAI
from prompt_template import prompt_generic


def main():
    st.title("Test de l'API Albert")

    load_dotenv()

    client = OpenAI(
        base_url="https://albert.api.etalab.gouv.fr/v1",
        api_key=os.getenv("API_KEY"),
    )

    prompt_template = PromptTemplate.from_template(prompt_generic)
    final_prompt = prompt_template.format(
        slide_template="""
                {
                "width": 940,
                "height": 788,
                "fonts": [],
                "pages": [
                    {
                    "id": "page-1",
                    "children": [],
                    "width": "auto",
                    "height": "auto",
                    "background": "white",
                    "bleed": 0,
                    "duration": 5000
                    }
                ],
                "audios": [],
                "unit": "px",
                "dpi": 72
                }""",
        client_request="Créer une slide de présentation de l'équipe avec Oussime, Didier et Michel",
    )

    if st.button("Générer la présentation"):
        st.write("Génération de la présentation en cours...")
        response = client.chat.completions.create(
            model="albert-small",
            messages=[{"role": "user", "content": final_prompt}],
        )

        st.write("Réponse de l'IA :")
        st.write(response.choices[0].message.content)


if __name__ == "__main__":
    main()
