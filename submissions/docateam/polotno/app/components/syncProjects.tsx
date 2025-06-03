import { observer } from 'mobx-react-lite';
import { InputGroup, Button, Dialog } from '@blueprintjs/core';
import { SectionTab } from 'polotno/side-panel';
import { MdFolder } from 'react-icons/md';
import { WiStars } from 'react-icons/wi';
import {fetchSyncedProjects, type SyncedProject} from '../api/syncedProjects';
import React from "react";
import { generateAndSaveProject } from '../api/ia';

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

  const [isModalOpen, setIsModalOpen] =  React.useState(false);
  const [prompt, setPrompt] =  React.useState('Fais une présentation sur le bac de Français');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCreateWithAI = async () => {
    try {
      setIsLoading(true);
      console.log('Prompt saisi :', prompt);
      await generateAndSaveProject(prompt, store);
      await loadProjects();
      alert('Projet généré et sauvegardé dans Fichiers avec succès !');
    } catch (error) {
      console.error('Erreur lors de la génération du projet avec l\'IA :', error);
      alert('Une erreur est survenue lors de la génération du projet.');
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

        <Button
            intent="success"
            onClick={() => setIsModalOpen(true)}
            style={{ margin: '10px' }}
        >
          Créer avec l'IA
          <WiStars size={24} />
        </Button>

        <Dialog
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Créer avec l'IA"
        >
          <div className="bp4-dialog-body">
            <p>Saisissez un prompt pour générer un projet :</p>
            <InputGroup
                placeholder="Entrez votre prompt ici..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            {isLoading && <div className="loader">Chargement...</div>}
          </div>
          <div className="bp4-dialog-footer">
            <div className="bp4-dialog-footer-actions">
              <Button onClick={() => setIsModalOpen(false)}>Annuler</Button>
              <Button intent="primary" onClick={handleCreateWithAI}>
                Générer
              </Button>
            </div>
          </div>
        </Dialog>

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
      <SectionTab name="Projects" {...props}>
        <MdFolder />
      </SectionTab>
  ),
  Panel: SyncedProjectsPanel,
};