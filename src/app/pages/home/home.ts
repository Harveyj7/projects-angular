import { Component } from '@angular/core';
import { Carousel } from '../../components/carousel/carousel';
import { Title } from '../../components/title/title';
import { Navbar } from '../../components/navbar/navbar';
import { PROJECTS } from '../../../constants/projects';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Carousel, Title, Navbar],
  template: `
    <div class="header-container">
      <app-navbar [projects]="projects"></app-navbar>
      <app-title></app-title>
    </div>
    <app-carousel></app-carousel>
  `,
  styles: [`
    @import url("https://fonts.googleapis.com/css2?family=Bree+Serif&display=swap");
    
    *,
    *:before,
    *:after {
      box-sizing: inherit;
      font-family: "Bree Serif", serif;
    }
    
    .header-container {
      position: relative;
    }
    
    h1 {
      padding: 0.5%;
      text-align: center;
      font-size: 50px;
    }

    @media (max-width: 600px) {
      .header-container {
        margin-top: 20px;
        text-align: center;
      }
    
      h1 {
        font-size: 40px;
      }
    }
  `]
})
export class Home {  
  protected projects = PROJECTS;
}