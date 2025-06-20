import {
  Component,
  AfterViewInit,
  ElementRef,
  Renderer2,
  PLATFORM_ID,
  Inject,
  Input,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  imports: [],
  standalone: true,
})
export class Navbar implements AfterViewInit {
  @Input() projects: any;

  private triggers?: NodeListOf<HTMLLIElement>;
  private background?: HTMLElement | null;
  private about?: HTMLElement | null;
  private arrow?: HTMLElement | null;
  private nav?: HTMLElement | null;
  private items?: NodeListOf<HTMLElement>;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.background = document.querySelector('.dropdownBackground');
    this.about = document.querySelector('.about');
    this.arrow = document.querySelector('.arrow');
    this.nav = document.querySelector('nav');
    this.items = document.querySelectorAll('.ul > li > a');
  }

  hideDropdown(): void {
    console.log('handleLeave');

    const triggerElements = document.querySelectorAll('ul > li');
    triggerElements.forEach((trigger) => {
      trigger.classList.remove('trigger-enter');
    });

    this.about?.style.removeProperty('margin-left');
    this.arrow?.style.removeProperty('left');
    this.items?.forEach((item) => {
      item.style.removeProperty('opacity');
    });
  }

  showDropdown(event: MouseEvent): void {
    console.log('hovered', event);
    let displace = 0;
    const trigger = (event.target as HTMLElement).closest('li') as HTMLElement;

    if (!trigger) return;

    const dropdown = trigger.querySelector('.dropdown') as HTMLElement;

    if (!dropdown || !this.nav || !this.background) return;

    const dropdownCoords = dropdown.getBoundingClientRect();
    trigger.classList.add('trigger-enter');

    const navCoords = this.nav.getBoundingClientRect();
    const coords = {
      height: dropdownCoords.height,
      width: dropdownCoords.width,
      top: dropdownCoords.top - navCoords.top,
      left: dropdownCoords.left - navCoords.left,
    };

    this.items?.forEach((item) => {
      item.style.setProperty('opacity', '1');
    });

    this.background.style.setProperty('width', `${coords.width}px`);
    this.background.style.setProperty('height', `${coords.height}px`);

    if (
      trigger.children[0]?.innerHTML === 'About Me' &&
      document.body.offsetWidth < 600
    ) {
      displace = 100;
      this.arrow?.style.setProperty('left', '30px');
    }

    this.background.style.setProperty(
      'transform',
      `translate(${coords.left + displace}px, ${coords.top}px)`
    );
    this.about?.style.setProperty('margin-left', `${2 * displace}px`);
  }
}
