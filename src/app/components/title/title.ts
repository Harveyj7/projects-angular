import { Component } from '@angular/core';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [],
  template: `
    <h1 class="title">Harvey - Projects</h1>
  `,
  styles: [`
    .title {
      font-size: 40px;
      font-weight: bold;
      color: #333;
      white-space: nowrap;
    }
    
    @media (max-width: 600px) {
      .title {
        font-size: 32px;
        text-align: center;
        margin: 15px 0;
        display: block;
      }
    }
  `]
})
export class Title {} 