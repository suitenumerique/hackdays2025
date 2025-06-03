import {APP_BASE} from "../config";

interface SyncProject {
  filename: string;
  file: string,
}

const bucketName = 'drive-media-storage';

export const syncProject = async (project: SyncProject) => {
  const payload = {
    type: 'file',
    filename: project.filename,
  };

  try {
    // Vérification si le fichier existe déjà
    const checkResponse = await fetch(
        `${APP_BASE}:8071/api/v1.0/items/9cb24815-9e14-4585-a508-34188d64fba4/children/?page_size=100000&ordering=-type%2C-created_at&type=file`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('DRIVE_TOKEN')}`
          },
        }
    );

    if (!checkResponse.ok) {
      throw new Error('Erreur lors de la vérification de l\'existence du fichier');
    }

    const checkData = await checkResponse.json();
    const existingFile = checkData.results.find((item: { filename: string }) => item.filename === project.filename);

    if (existingFile) {
      console.log('Le fichier existe déjà, suppression en cours...');

      // Suppression du fichier existant
      const deleteResponse = await fetch(
          `${APP_BASE}:8071/api/v1.0/items/${existingFile.id}/`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('DRIVE_TOKEN')}`
            },
          }
      );

      if (!deleteResponse.ok) {
        throw new Error('Erreur lors de la suppression du fichier existant');
      }

      console.log('Fichier existant supprimé avec succès.');
    }

    // Envoi des métadonnées
    const metadataResponse = await fetch(
        `${APP_BASE}:8071/api/v1.0/items/9cb24815-9e14-4585-a508-34188d64fba4/children/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('DRIVE_TOKEN')}`
          },
          body: JSON.stringify(payload),
        }
    );

    if (!metadataResponse.ok) {
      throw new Error('Erreur lors de l\'envoi des métadonnées');
    }

    const metadatas = await metadataResponse.json();

    // Préparation des données pour MinIO
    const key = `item/${metadatas.id}/${project.filename}`;

    if (!metadatas.policy) {
      throw new Error("No policy found");
    }
    const { fields } = metadatas.policy!;
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", project.file);

    // Envoi des données à MinIO
    const minioResponse = await fetch(`${APP_BASE}:9000/${bucketName}`, {
      method: 'POST',
      body: formData,
    });

    if (!minioResponse.ok) {
      throw new Error('Erreur lors de l\'envoi des données à MinIO');
    }

    console.log('Données envoyées avec succès à MinIO:', await minioResponse.text());

    // Appel pour signaler la fin de l'upload
    const uploadEndedResponse = await fetch(`${APP_BASE}:8071/api/v1.0/items/${metadatas.id}/upload-ended/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('DRIVE_TOKEN')}`
      },
    });

    if (!uploadEndedResponse.ok) {
      throw new Error('Erreur lors de l\'appel à upload-ended');
    }

    console.log('Upload terminé signalé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'envoi des métadonnées:', error);
    throw error;
  }
};