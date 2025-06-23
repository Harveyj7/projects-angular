import { Component } from '@angular/core';
import { PROJECTS } from '../../../constants/projects';

@Component({
  selector: 'app-languages',
  imports: [],
  template: `<iframe
    src="assets/languages.html"
    width="100%"
    height="600px"
    frameborder="0"
    sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-popups"
  ></iframe> `,
  styles: `
  iframe {
    border: 1px solid #ccc;
  }
  `,
})
export class Languages {
  projects = PROJECTS;
}
