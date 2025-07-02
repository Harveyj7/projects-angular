import {
  Component,
  AfterViewInit,
  ElementRef,
  Renderer2,
  PLATFORM_ID,
  Inject,
  Input,
  ViewChild,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NAVBAR } from '../../../constants/navbar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements AfterViewInit {
  navbar = NAVBAR;

  // ViewChild references for DOM elements
  @ViewChild('dropdownBackground', { static: false })
  dropdownBackground!: ElementRef<HTMLElement>;
  @ViewChild('about', { static: false }) about!: ElementRef<HTMLElement>;
  @ViewChild('arrow', { static: false }) arrow!: ElementRef<HTMLElement>;
  @ViewChild('nav', { static: false }) nav!: ElementRef<HTMLElement>;
  @ViewChildren('menuItem') menuItems!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('triggerElement') triggerElements!: QueryList<
    ElementRef<HTMLElement>
  >;

  // Component state
  dropdownState = {
    isVisible: false,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  };

  // Styles for dynamic elements
  backgroundStyles: { [key: string]: string } = {
    position: 'absolute',
    background: 'white',
    'border-radius': '4px',
    'box-shadow':
      '0 50px 100px rgba(50, 50, 93, 0.1), 0 15px 35px rgba(50, 50, 93, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s, opacity 0.1s, transform 0.2s',
    'transform-origin': '50% 0',
    display: 'flex',
    'justify-content': 'center',
    opacity: '0',
    'z-index': '5',
    'pointer-events': 'none',
  };
  aboutStyles: { [key: string]: string } = {};
  arrowStyles: { [key: string]: string } = {};
  itemsOpacity = '1';

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
  }

  hideDropdown(): void {
    console.log('hideDropdown called');

    // Reset component state
    this.dropdownState.isVisible = false;
    this.itemsOpacity = '1';

    // Update background styles to hide
    this.backgroundStyles = {
      ...this.backgroundStyles,
      opacity: '0',
      'pointer-events': 'none',
    };
    this.aboutStyles = {};
    this.arrowStyles = {};

    console.log('Background styles after hide:', this.backgroundStyles);

    // Remove trigger classes from all trigger elements
    this.triggerElements?.forEach((trigger) => {
      this.renderer.removeClass(trigger.nativeElement, 'trigger-enter');
      console.log('Removed trigger-enter class from:', trigger.nativeElement);
    });
  }

  showDropdown(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    console.log('showDropdown called');
    const trigger = (event.target as HTMLElement).closest('li') as HTMLElement;
    if (!trigger) {
      console.log('No trigger found');
      return;
    }

    const dropdown = trigger.querySelector('.dropdown') as HTMLElement;
    if (!dropdown || !this.nav?.nativeElement) {
      console.log('No dropdown or nav found', {
        dropdown,
        nav: this.nav?.nativeElement,
      });
      return;
    }

    // Calculate dropdown coordinates
    const dropdownCoords = dropdown.getBoundingClientRect();
    const navCoords = this.nav.nativeElement.getBoundingClientRect();

    const coords = {
      height: dropdownCoords.height,
      width: dropdownCoords.width,
      top: dropdownCoords.top - navCoords.top,
      left: dropdownCoords.left - navCoords.left,
    };

    console.log('Dropdown coords:', coords);

    // Update component state
    this.dropdownState = {
      isVisible: true,
      width: coords.width,
      height: coords.height,
      top: coords.top,
      left: coords.left,
    };

    // Update background styles to show
    this.backgroundStyles = {
      ...this.backgroundStyles,
      width: `${coords.width}px`,
      height: `${coords.height}px`,
      transform: `translate(${coords.left}px, ${coords.top}px)`,
      opacity: '1',
      'pointer-events': 'auto',
    };

    console.log('Background styles set:', this.backgroundStyles);

    this.aboutStyles = {
      'margin-left': '0px',
    };

    this.itemsOpacity = '1';

    // Add trigger class
    this.renderer.addClass(trigger, 'trigger-enter');
    console.log('Added trigger-enter class to:', trigger);
  }

  // Helper method to get current background styles
  getBackgroundStyles(): { [key: string]: string } {
    return this.backgroundStyles;
  }

  // Helper method to get current about styles
  getAboutStyles(): { [key: string]: string } {
    return this.aboutStyles;
  }

  // Helper method to get current arrow styles
  getArrowStyles(): { [key: string]: string } {
    return this.arrowStyles;
  }

  // Helper method to get current items opacity
  getItemsOpacity(): string {
    return this.itemsOpacity;
  }
}
