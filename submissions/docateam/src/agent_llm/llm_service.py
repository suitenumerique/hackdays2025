from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url = 'https://albert.api.etalab.gouv.fr/v1',
    api_key=os.getenv('API_KEY'),
)

prompt="Tu peux générer une image en .png ? "
response = client.chat.completions.create(
    model="albert-small",
    messages=[
        {"role": "user", "content": prompt},
    ]
)

print(response.choices[0].message.content)