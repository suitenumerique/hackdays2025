import './styles.css';
import { createRoot } from 'react-dom/client';
import { onPatch, applyPatch } from 'mobx-state-tree';
import PartySocket from 'partysocket';
import usePartySocket from 'partysocket/react';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
importimport { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { SidePanel, DEFAULT_SECTIONS } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';

import { createStore, type StoreType } from 'polotno/model/store';

import '@blueprintjs/core/lib/css/blueprint.css';
import React from 'react';
import {CustomPhotosSection} from "./components/photos";
import {CustomSyncedProjects} from "./components/syncProjects";
import {CustomToolbar} from "./components/toolbar";
import {ElementsSection, SizeSection, TextSection} from "polotno/side-panel/side-panel";

const store = createStore({
  key: 'your-key',
  showCredit: false
});

const page = store.addPage();

export const App = ({ store }: { store: StoreType }) => {
  const ignorePathRef = React.useRef(false);

  const socket = usePartySocket({
    // host defaults to the current URL if not set
    //host: process.env.PARTYKIT_HOST,
    // we could use any room name here
    room: 'example-room',
    onMessage(evt) {
      const event = JSON.parse(evt.data);
      if (event.type === 'patch') {
        console.log('patch received');
        ignorePathRef.current = true;
        applyPatch(store.pages, event.patch);
        ignorePathRef.current = false;
      }
      if (event.type === 'reset-state') {
        console.log('reset-state received');
        ignorePathRef.current = true;
        store.loadJSON(event.state);
        ignorePathRef.current = false;
      }
      if (event.type === 'request-state') {
        console.log('request-state received');
        const message = JSON.stringify({
          type: 'reset-state',
          state: store.toJSON(),
        });
        socket.send(message);
      }
    },
  });

  React.useEffect(() => {
    socket.send(JSON.stringify({ type: 'request-state' }));
    onPatch(store.pages, (patch) => {
      if (ignorePathRef.current) {
        return;
      }
      const message = JSON.stringify({ type: 'patch', patch: patch });
      socket.send(message);
    });
  }, []);

  return (
    <PolotnoContainer style={{ width: '100vw', height: '100vh' }}>
      <SidePanelWrap>
        <SidePanel store={store} sections={[CustomSyncedProjects, TextSection, ElementsSection, CustomPhotosSection, SizeSection]} />
      </SidePanelWrap>
      <WorkspaceWrap>
        <CustomToolbar store={store} downloadButtonEnabled />
    </WorkspaceWrap>
    </PolotnoContainer>
  );
};

createRoot(document.getElementById('app')!).render(<App store={store} />);
