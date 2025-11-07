import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImageCarousel } from '../image-carousel/image-carousel';
import { CarouselImage } from '../fyp/fyp';

@Component({
  selector: 'app-matlab',
  imports: [RouterLink, ImageCarousel],
  templateUrl: './matlab.html',
  styleUrl: './matlab.scss',
})
export class Matlab {
  equationImage: CarouselImage[] = [
    { src: 'assets/images/fluideq.png', alt: 'Equation',width: 200, height: 60 }
  ];
  analysisImages: CarouselImage[] = [
    { src: 'assets/images/cfd.png', alt: 'CFD',width: 1388, height: 572 },
    { src: 'assets/images/graph.png', alt: 'graph',width: 1388, height: 572 }
  ];
  fbdImages: CarouselImage[] = [
    { src: 'assets/images/fbd.png', alt: 'FBD',width: 1388, height: 572 },
    { src: 'assets/images/pitch.png', alt: 'Pitch',width: 1388, height: 572 },
    { src: 'assets/images/simulink.png', alt: 'Simulink',width: 1388, height: 572 },
    ]
  resultImage:CarouselImage[] =[
    { src: 'assets/images/result.png', alt: 'Results',width: 1388, height: 572 },
  ]
}
