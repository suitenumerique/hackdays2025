import React, { useEffect } from 'react';
import {fetchPhotos, type PhotoItem} from '../api/photoLibrary';
import { SectionTab } from 'polotno/side-panel';
import {Button} from "@blueprintjs/core";

export const PhotosPanel = ({ store }) => {
  const [photos, setPhotos] = React.useState<PhotoItem[]>([]);

  const loadPhotos = async () => {
    try {
      const data = await fetchPhotos();
      setPhotos(data.results);
    } catch (error) {
      console.error("Erreur lors du chargement des photos:", error);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  return (
      <SectionTab name="Photos" onClick={() => {}} active={true}>
        <div>
          <Button onClick={loadPhotos} text="Rafraîchir" style={{ marginBottom: '10px' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {photos.map(photo => (
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
                    style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }}
                />
            ))}
          </div>
        </div>
      </SectionTab>
  );
};


export const PhotosSection = {
  name: 'photos',
  Tab: () => <div className="go3977838046 polotno-side-panel-tab active">
    <div ><span aria-hidden="true" className="bp5-icon bp5-icon-media"><svg
        data-icon="media" height="16" role="img" viewBox="0 0 16 16" width="16"><path
        d="M239.8 180.2C250.8 180.2 259.8 189.2 259.8 200.2S250.8 220.2 239.8 220.2S219.8 211.2 219.8 200.2S228.8 180.2 239.8 180.2zM299.8 280.2H19.8C8.8 280.2 -0.2 271.2 -0.2 260.2V60.2C-0.2 49.2 8.8 40.2 19.8 40.2H299.8C310.8 40.2 319.8 49.2 319.8 60.2V260.2C319.8 271.2 310.8 280.2 299.8 280.2zM279.8 100.2L179.8 160.2L159.8 120.2L99.8 200.2L39.8 100.2V240.2H279.8V100.2z"
        fillRule="evenodd" transform="scale(0.05, -0.05) translate(-160, -160)"
        style={{transformOrigin: 'center center'}}></path></svg></span></div>
    <div style={{paddingTop: '5px'}}>Photos</div>
  </div>,
  Panel: PhotosPanel,
};