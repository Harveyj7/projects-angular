import {
  Component,
  effect,
  ElementRef,
  inject,
  QueryList,
  Renderer2,
  Signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NAVBAR } from '../../../constants/navbar';
import { AuthService, User } from '../../services/auth.service';
import { LoginModal } from '../login-modal/login-modal';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  navbar = NAVBAR;
  currentUser: Signal<User | null>;
  currentComponent: string = '';

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
  private renderer = inject(Renderer2);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.currentUser = this.authService.currentUser;
    effect(() => {
      if (this.currentUser()) {
        console.log(this.currentUser() + 'Loggged in');
      } else {
        console.log('Not logged in');
      }
    });
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentComponent = event.url.replace('/', '') || 'home';
      });

    this.currentComponent = this.router.url.replace('/', '') || 'home';
  }

  openLoginModal(): void {
    this.hideDropdown();
    this.dialog.open(LoginModal, {
      width: '400px',
      data: {},
    });
  }

  logout(): void {
    this.authService.logout();
  }

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
