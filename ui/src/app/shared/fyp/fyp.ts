import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ImageCarousel } from '../image-carousel/image-carousel';

export interface CarouselImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

@Component({
  selector: 'app-fyp',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ImageCarousel,
  ],
  templateUrl: './fyp.html',
  styleUrl: './fyp.scss',
})
export class Fyp {
  workflowImages: CarouselImage[] = [
    { src: 'assets/images/workflow.png', alt: 'Workflow diagram', width: 1280, height: 572 },
    { src: 'assets/images/concept.PNG', alt: 'Concept design', width: 1388, height: 572 },
    { src: 'assets/images/Glider profile.png', alt: 'Glider profile',width: 1388, height: 572 },
    { src: 'assets/images/Buoyancy states.png', alt: 'Buoyancy states',width: 1388, height: 572}
  ];

  assemblyImages: CarouselImage[] = [
    { src: 'assets/images/gliderassembly.png', alt: 'Glider assembly',width: 1388, height: 572 },
    { src: 'assets/images/assembly.jpg', alt: 'Physical assembly',width: 1388, height: 572 },
    { src: 'assets/images/breadboard.jpg', alt: 'Breadboard circuit',width: 1388, height: 572 }
  ];

}
