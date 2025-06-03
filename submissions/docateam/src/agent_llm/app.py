import os

import streamlit as st
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from openai import OpenAI
from prompt_template import json_exemple, prompt_generic, slide1_template, last_slide_template


def main():
    st.title("Génération du JSON")

    load_dotenv()

    client = OpenAI(
        base_url="https://albert.api.etalab.gouv.fr/v1",
        api_key=os.getenv("API_KEY"),
    )

    prompt_template = PromptTemplate.from_template(prompt_generic)
    final_prompt = prompt_template.format(
        json_example=json_exemple,
        slide1_template=slide1_template,
        last_slide_template=last_slide_template,
        client_request="Créer moi une présentation sur la souvereinité numérique",
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
