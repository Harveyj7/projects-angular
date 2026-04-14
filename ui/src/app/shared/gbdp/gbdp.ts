import { Component } from '@angular/core';
import { CarouselImage } from '../fyp/fyp';
import { ImageCarousel } from '../image-carousel/image-carousel';

@Component({
  selector: 'app-gbdp',
  imports: [ImageCarousel],
  templateUrl: './gbdp.html',
  styleUrl: './gbdp.scss',
})
export class Gbdp {
  ideationImages: CarouselImage[] = [
    {
      src: 'assets/images/ideationtable.PNG',
      alt: 'Ideation table',
      width: 1388,
      height: 572,
    },
    {
      src: 'assets/images/gbdpconcepts.png',
      alt: 'GBDP concepts',
      width: 1388,
      height: 572,
    },
    {
      src: 'assets/images/dysonramp.PNG',
      alt: 'Dyson ramp',
      width: 1388,
      height: 572,
    },
  ];
  CadImages: CarouselImage[] = [
    { src: 'assets/images/grabber.png', alt: 'grabber', width: 1388, height: 572, },
    { src: 'assets/images/OTD.png', alt: 'OTD', width: 1388, height: 572 },
    { src: 'assets/images/SKD.png', alt: 'SKD', width: 1388, height: 572 },
    { src: 'assets/images/skdconnections.png', alt: 'connections', width: 1388, height: 572 },
    { src: 'assets/images/rlpconnections.png',
      alt: 'connections',
      width: 1388,
      height: 572, },
    { src: 'assets/images/feagrid.png', alt: 'FEA', width: 1388, height: 572 },
  ];
}
