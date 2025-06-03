import { Toolbar } from 'polotno/toolbar/toolbar';
import { Button } from '@blueprintjs/core';
import { DownloadButton } from 'polotno/toolbar/download-button';
import React from "react";
import {syncProject} from "../api/syncProject";

const ActionControls = ({ store }) => {
  const saveProject = async () => {
    try {
      await syncProject({
        filename: 'bac_francais.json',
        file: JSON.stringify(store.toJSON()),
      })
      alert('Projet sauvegardé avec succès dans Fichiers !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du projet:', error);
      alert('Erreur lors de la sauvegarde du projet.');
    }
  };

  return (
      <div>
        <DownloadButton store={store} />
        <Button
            intent="primary"
            onClick={saveProject}
            style={{ margin: '10px' }}
        >
          Save
        </Button>
      </div>
  );
};

export const CustomToolbar = ({ store }) => {
  return (
      <Toolbar
          store={store}
          components={{
            ActionControls,
          }}
      />
  );
};