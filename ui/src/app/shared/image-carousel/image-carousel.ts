import { Component, Input, OnInit, OnDestroy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface CarouselImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './image-carousel.html',
  styleUrl: './image-carousel.scss',
})
export class ImageCarousel implements OnInit, OnDestroy{
  images = input.required<CarouselImage[]>();
  showIndicators = input.required<boolean>();
  showArrows= input.required<boolean>();
  currentIndex: number = 0;
  private autoPlayTimer: any;

  ngOnInit() {
    if (this.images().length > 1) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  previousSlide() {
    this.currentIndex = this.currentIndex === 0 ? this.images().length - 1 : this.currentIndex - 1;
    this.resetAutoPlay();
  }

  nextSlide() {
    this.currentIndex = this.currentIndex === this.images().length - 1 ? 0 : this.currentIndex + 1;
    this.resetAutoPlay();
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.resetAutoPlay();
  }

  private startAutoPlay() {
    this.autoPlayTimer = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  private stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
  }

  private resetAutoPlay() {
      this.stopAutoPlay();
      this.startAutoPlay();
  }
}
