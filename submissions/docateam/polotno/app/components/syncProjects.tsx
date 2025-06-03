import { observer } from 'mobx-react-lite';
import { InputGroup } from '@blueprintjs/core';
import { SectionTab } from 'polotno/side-panel';
import { MdFolder } from 'react-icons/md';
import {fetchSyncedProjects, type SyncedProject} from '../api/syncedProjects';
import React from "react";

export const SyncedProjectsPanel = observer(({ store }) => {
  const [projects, setProjects] = React.useState<SyncedProject[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  async function loadProjects() {
    try {
      const data = await fetchSyncedProjects();
      setProjects(data.filter((project) =>
          project.filename.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } catch (error) {
      console.error('Erreur lors du chargement des projets synchronisés:', error);
    }
  }

  React.useEffect(() => {
    loadProjects();
  }, [searchTerm]);

  const openProject = async (project: SyncedProject) => {
    try {
      // Téléchargement du fichier du projet via l'URL
      const response = await fetch(project.url);
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement du projet');
      }

      const projectData = await response.json();

      store.loadJSON(projectData);

      console.log('Projet chargé avec succès:', project.filename);
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du projet:', error);
      alert('Impossible d\'ouvrir le projet.');
    }
  };

  return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <InputGroup
            leftIcon="search"
            placeholder="Rechercher..."
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              marginBottom: '20px',
            }}
        />
        <p>Projets synchronisés :</p>
        <ul>
          {projects.map((project) => (
              <li
                  key={project.id}
                  onClick={() => openProject(project)}
                  style={{ cursor: 'pointer', marginBottom: '10px' }}
              >
                <strong>{project.filename}</strong> ({new Date(project.updated_at).toLocaleString()})
              </li>
          ))}
        </ul>
      </div>
  );
});

export const CustomSyncedProjects = {
  name: 'synced-projects',
  Tab: (props) => (
      <SectionTab name="Projets" {...props}>
        <MdFolder />
      </SectionTab>
  ),
  Panel: SyncedProjectsPanel,
};