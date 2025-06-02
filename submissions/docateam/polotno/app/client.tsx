import './styles.css';
import { createRoot } from 'react-dom/client';
import { onPatch, applyPatch } from 'mobx-state-tree';
import PartySocket from 'partysocket';
import usePartySocket from 'partysocket/react';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { SidePanel } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';

import { createStore } from 'polotno/model/store';

// import css styles from blueprint framework (used by polotno)
// if you bundler doesn't support such import you can use css from CDN (see bellow)
import '@blueprintjs/core/lib/css/blueprint.css';
import React from 'react';

const store = createStore({
  key: 'your-key',
});

const page = store.addPage();

export const App = ({ store }) => {
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
        <SidePanel store={store} />
      </SidePanelWrap>
      <WorkspaceWrap>
        <Toolbar store={store} downloadButtonEnabled />
        <Workspace store={store} />
        <ZoomButtons store={store} />
      </WorkspaceWrap>
    </PolotnoContainer>
  );
};

createRoot(document.getElementById('app')!).render(<App store={store} />);
