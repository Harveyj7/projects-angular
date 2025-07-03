import {
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NAVBAR } from '../../../constants/navbar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  navbar = NAVBAR;

  @ViewChild('dropdownBackground', { static: false })
  dropdownBackground!: ElementRef<HTMLElement>;
  @ViewChild('about', { static: false }) about!: ElementRef<HTMLElement>;
  @ViewChild('arrow', { static: false }) arrow!: ElementRef<HTMLElement>;
  @ViewChild('nav', { static: false }) nav!: ElementRef<HTMLElement>;
  @ViewChildren('triggerElement') triggerElements!: QueryList<
    ElementRef<HTMLElement>
  >;

  private dropdownState = {
    isVisible: false,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  };

  public dynamicBackgroundStyles: { [key: string]: string } = {};

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  showDropdown(event: MouseEvent): void {
    const trigger = (event.target as HTMLElement).closest('li') as HTMLElement;
    const dropdown = trigger.querySelector('.dropdown') as HTMLElement;
    const dropdownCoords = dropdown.getBoundingClientRect();
    const navCoords = this.nav.nativeElement.getBoundingClientRect();
    const coords = {
      height: dropdownCoords.height,
      width: dropdownCoords.width,
      top: dropdownCoords.top - navCoords.top,
      left: dropdownCoords.left - navCoords.left,
    };

    this.dropdownState = {
      isVisible: true,
      width: coords.width,
      height: coords.height,
      top: coords.top,
      left: coords.left,
    };

    this.dynamicBackgroundStyles = {
      width: `${coords.width}px`,
      height: `${coords.height}px`,
      transform: `translate(${coords.left}px, ${coords.top}px)`,
      opacity: '1',
    };

    this.renderer.addClass(trigger, 'trigger-enter');
  }

  hideDropdown(): void {
    this.dropdownState.isVisible = false;
    this.dynamicBackgroundStyles = { opacity: '0' };
    this.triggerElements?.forEach((trigger) => {
      this.renderer.removeClass(trigger.nativeElement, 'trigger-enter');
    });
  }
}
