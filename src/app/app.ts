import { Component, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import {Navbar} from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar],
  template: `
    <main class="main-content">
      <app-navbar></app-navbar>
      <router-outlet />
      <footer>Website developed by Harvey Jensen</footer>
    </main>
  `,
  styles: [
    `
      .main-content {
        padding-bottom: 60px; /* Add space for the fixed footer */
      }

      footer {
        text-align: center;
        padding: 10px;
        position: fixed;
        bottom: 0;
        width: 100%;
        background-color: white; /* Add background to prevent transparency */
        border-top: 1px solid #ddd; /* Optional: add a subtle border */
        box-shadow: 0 -2px 4px rgba(0,0,0,0.1); /* Optional: add shadow */
      }
    `,
  ],
})
export class App implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
  }
}
