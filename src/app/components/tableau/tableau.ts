import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-tableau',
  imports: [],
  templateUrl: './tableau.html',
  styleUrl: './tableau.scss',
})
export class Tableau implements OnInit, OnDestroy {
  @ViewChild('viz', { static: true }) vizElement!: ElementRef<HTMLDivElement>;

  private trigger?: HTMLElement;
  private link?: HTMLElement;
  private background?: HTMLElement;
  private nav?: HTMLElement;
  private divElement?: HTMLElement | null;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.initializeTableauViz();
  }

  ngOnDestroy(): void {
    // Clean up event listeners
    if (this.link) {
      this.link.removeEventListener('mouseenter', this.handleEnter.bind(this));
      this.link.removeEventListener('mouseleave', this.handleLeave.bind(this));
    }
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



  private handleEnter(): void {
    if (!this.trigger || !this.background || !this.nav || !this.divElement)
      return;

    this.background.classList.add('open');
    this.divElement.style.setProperty('opacity', '0.1');

    const dropdown = this.trigger.querySelector('.dropdown') as HTMLElement;
    if (dropdown) {
      const dropdownCoords = dropdown.getBoundingClientRect();
      const navCoords = this.nav.getBoundingClientRect();

      const coords = {
        height: dropdownCoords.height,
        width: dropdownCoords.width,
        top: dropdownCoords.top - navCoords.top,
        left: dropdownCoords.left - navCoords.left,
      };

      this.background.style.setProperty('width', `${coords.width}px`);
      this.background.style.setProperty('height', `${coords.height}px`);

      const transformValue =
        document.body.offsetWidth > 1100
          ? `translate(${coords.left - 50}px, ${coords.top - 10}px)`
          : `translate(${coords.left}px, ${coords.top}px)`;

      this.background.style.setProperty('transform', transformValue);
    }
  }

  private handleLeave(): void {
    if (!this.trigger || !this.background || !this.divElement) return;

    this.trigger.classList.remove('trigger-enter', 'trigger-enter-active');
    this.background.classList.remove('open');
    this.divElement.style.removeProperty('opacity');
  }
}
