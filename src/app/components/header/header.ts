import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Title } from '../title/title';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Navbar, Title],
  template: `
    <div class="header-container">
      <app-navbar></app-navbar>
      <app-title></app-title>
    </div>
  `,
  styles: [
    `
      .header-container {
        display: flex;
        justify-content: left;
        align-items: center;
        margin-top: 10px;
      }
    `,
  ],
})
export class Header {}
