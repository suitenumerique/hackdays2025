import { observer } from 'mobx-react-lite';
import { Button } from '@blueprintjs/core';
import { useProject } from './project';
import { Cloud } from '@blueprintjs/icons';

export const CloudWarning = observer(() => {
  const project = useProject();
  if (project.cloudEnabled) {
    return null;
  }
  return (
    <div>
    </div>
  );
});
