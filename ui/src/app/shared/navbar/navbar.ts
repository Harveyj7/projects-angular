import {
  Component,
  effect,
  inject,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NAVBAR } from '../../../constants/navbar';
import { AuthService, User } from '../services/auth.service';
import { LoginModal } from '../login-modal/login-modal';
import { filter } from 'rxjs';
interface PopoverState {
  show: WritableSignal<boolean>;
  content: WritableSignal<string>;
}
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  navbar = NAVBAR;
  currentUser: Signal<User | null>;
  currentComponent: string = '';
  aboutText: string = this.navbar.about.text;
  infoText: string = this.navbar.information.text;
  contactText: string = this.navbar.contact.text;
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private router = inject(Router);

  aboutmeState: PopoverState = {
    show: signal(false),
    content: signal(this.aboutText),
  };

  infoState: PopoverState = {
    show: signal(false),
    content: signal(this.infoText),
  };

  contactState: PopoverState = {
    show: signal(false),
    content: signal(this.contactText),
  };

  loginState: PopoverState = {
    show: signal(false),
    content: signal(this.aboutText),
  };
  constructor() {
    this.currentUser = this.authService.currentUser;
    effect(() => {
      if (this.currentUser()) {
        console.log(this.currentUser() + 'Logged in');
      } else {
        console.log('Not logged in');
      }
    });
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentComponent = event.url.replace('/', '');
      });
    this.currentComponent = this.router.url.replace('/', '');
  }

  openLoginModal(): void {
    this.dialog.open(LoginModal, {
      width: '400px',
      data: {},
    });
  }

  logout(): void {
    this.authService.logout();
  }

  showPopover(state: PopoverState): void {
    console.log(state.content());
    state.content.set(state.content());
    state.show.set(true);
  }

  hidePopover(state: PopoverState): void {
    state.show.set(false);
  }

}









