import { syncProject } from '../api/syncProject';

export const generateAndSaveProject = async (clientRequest: string, store: any) => {
  try {
    // Construction de l'URL avec les paramètres de requête
    const url = new URL('http://127.0.0.1:8000/generate-json-text');
    url.searchParams.append('client_request', clientRequest);

    // Appel API pour générer le JSON
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ client_request: clientRequest }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la génération du JSON');
    }

    const generatedJson = await response.json();

    // Chargement du JSON dans le store
    store.loadJSON(generatedJson);

    // Sauvegarde du projet
    await syncProject({
      filename: 'bac_de_francais.json',
      file: JSON.stringify(generatedJson),
    });
  } catch (error) {
    console.error('Erreur lors de la génération ou de la sauvegarde du projet :', error);
  }
};