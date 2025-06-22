import { Component } from '@angular/core';
import { Carousel } from '../../components/carousel/carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Carousel],
  template: ` <app-carousel></app-carousel> `,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=Bree+Serif&display=swap');

      *,
      *:before,
      *:after {
        box-sizing: inherit;
        font-family: 'Bree Serif', serif;
      }
    `,
  ],
})
export class Home {}
