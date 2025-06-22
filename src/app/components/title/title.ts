import { Component } from '@angular/core';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [],
  template: ` <h1 class="title">Harvey - Projects</h1> `,
  styles: [
    `
      .title {
        font-size: 40px;
        margin-left: 200px;
      }

      @media (max-width: 600px) {
        .title {
          font-size: 30px;
          margin-left: 0px;
        }
      }
    `,
  ],
})
export class Title {}
