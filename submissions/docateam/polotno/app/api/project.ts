interface Project {
  filename: string;
  file: Blob,
}

const bucketName = 'drive-media-storage';

export const syncProject = async (project: Project) => {
  const payload = {
    type: 'file',
    filename: project.filename,
  };

  try {
    // Envoi des métadonnées
    const metadataResponse = await fetch(
        'http://localhost:8071/api/v1.0/items/9cb24815-9e14-4585-a508-34188d64fba4/children/',
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
    const minioResponse = await fetch(`http://localhost:9000/${bucketName}`, {
      method: 'POST',
      body: formData,
    });

    if (!minioResponse.ok) {
      throw new Error('Erreur lors de l\'envoi des données à MinIO');
    }

    console.log('Données envoyées avec succès à MinIO:', await minioResponse.text());

    // Appel pour signaler la fin de l'upload
    const uploadEndedResponse = await fetch(`http://localhost:8071/api/v1.0/items/${metadatas.id}/upload-ended/`, {
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