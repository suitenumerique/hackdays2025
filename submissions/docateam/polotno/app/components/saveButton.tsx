import React from 'react';
import { Button } from '@blueprintjs/core';
import {syncProject} from "../api/project";

export const SaveButton = ({ store }) => {
  const saveProject = async () => {
    try {
      await syncProject({
        filename: 'project.json',
        file: JSON.stringify(store.toJSON()),
      })
      alert('Projet sauvegardé avec succès!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du projet:', error);
      alert('Erreur lors de la sauvegarde du projet.');
    }
  };

  return (
      <Button onClick={saveProject} text="Save (TEMP)" style={{ margin: '10px' }} />
  );
};