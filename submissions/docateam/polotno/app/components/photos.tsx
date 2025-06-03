import { observer } from 'mobx-react-lite';
import { InputGroup } from '@blueprintjs/core';
import { SectionTab } from 'polotno/side-panel';
import { MdPhotoLibrary } from 'react-icons/md';
import {fetchPhotos, type PhotoItem} from '../api/photoLibrary';
import React from "react";

export const PhotosPanel = observer(({ store }) => {
  const [photos, setPhotos] = React.useState<PhotoItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  async function loadPhotos() {
    try {
      const data = await fetchPhotos();
      setPhotos(data.results.filter((photo) =>
          photo.title.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } catch (error) {
      console.error('Erreur lors du chargement des photos :', error);
    }
  }

  React.useEffect(() => {
    loadPhotos();
  }, [searchTerm]);

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
        <p>Photos disponibles :</p>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {photos.map((photo) => (
              <img
                  key={photo.id}
                  src={photo.url}
                  alt={photo.title}
                  onClick={() => {
                    store.activePage.addElement({
                      type: 'image',
                      src: photo.url,
                    });
                  }}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    margin: '5px',
                  }}
              />
          ))}
        </div>
      </div>
  );
});

export const CustomPhotosSection = {
  name: 'photos',
  Tab: (props) => (
      <SectionTab name="Photos" {...props}>
        <MdPhotoLibrary />
      </SectionTab>
  ),
  Panel: PhotosPanel,
};