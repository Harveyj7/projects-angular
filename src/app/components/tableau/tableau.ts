import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-tableau',
  imports: [],
  templateUrl: './tableau.html',
  styleUrl: './tableau.scss',
})
export class Tableau implements OnInit {
  @ViewChild('viz', { static: true }) vizElement!: ElementRef<HTMLDivElement>;

  private divElement?: HTMLElement | null;


  ngOnInit(): void {
    this.initializeTableauViz();
  }

  private initializeTableauViz(): void {
    const body = document.querySelector('body');
    this.divElement = document.getElementById('viz1613129136367');
    const vizElement = document.getElementsByTagName(
      'object',
    )[0] as HTMLObjectElement;

    if (vizElement && body && this.divElement) {
      // Set visualization dimensions
      vizElement.style.width = `${document.body.offsetWidth + 20}px`;
      this.divElement.style.webkitTransform = 'scale(0.96)';
      vizElement.style.height = '795px';

      // Load Tableau API script
      const scriptElement = document.createElement('script');
      scriptElement.src =
        'https://public.tableau.com/javascripts/api/viz_v1.js';
      scriptElement.type = 'text/javascript';

      if (vizElement.parentNode) {
        vizElement.parentNode.insertBefore(scriptElement, vizElement);
      }
    }
  }
}
