
# GristDocTour example

Here is the step by step guide to create a generic tour for a default basic document with Table1 :
https://support.getgrist.com/document-tours/ 

![Add table for example](add-table-GristDocTour.png)

# Changes to Grist-core codebase 

app/client/ui/DocTour.ts :
```TypeScript 
import {marked} from "marked";
import {renderer} from 'app/client/ui/DocTutorialRenderer';
import {sanitizeTutorialHTML} from "./sanitizeHTML";
...
const bodyHtmlContent = sanitizeTutorialHTML(marked.parse(getValue("Body"), {
      async: false, renderer
    }));
    const element = document.createElement('div');
    element.innerHTML = bodyHtmlContent;
```

New renderer file 
app/client/ui/DocTourRenderer.ts :
```TypeScript 
import {marked} from 'marked';

export const renderer = new marked.Renderer();

renderer.link = ({href, text}) => {
  return `<a href="${href}" target="_blank">${text}</a>`;
};

```
This specific renderer is implement in a Grist manner to make sure external links are opened in a new windows.