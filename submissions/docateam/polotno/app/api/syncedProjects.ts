import {APP_BASE} from "../config";

export interface SyncedProject {
  id: string;
  filename: string;
  created_at: string;
  updated_at: string;
  url: string;
}

export const fetchSyncedProjects = async (): Promise<SyncedProject[]> => {
  const response = await fetch(
      `${APP_BASE}:8071/api/v1.0/items/9cb24815-9e14-4585-a508-34188d64fba4/children/?page_size=100000&ordering=-type%2C-created_at&type=file`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('DRIVE_TOKEN')}`
        },
      }
  );

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des projets synchronisés');
  }

  return (await response.json()).results;
};