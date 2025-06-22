import {
  Component,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
  <main>
  <router-outlet />
  <footer>Website developed by Harvey Jensen</footer>
  </main>
  `,
  styles: [],
})
export class App implements AfterViewInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
  }
}
