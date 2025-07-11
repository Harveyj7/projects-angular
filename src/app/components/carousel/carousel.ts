import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { PROJECTS } from '../../../constants/projects';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

interface ProjectData {
  text: string;
  href: string;
  src: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel implements AfterViewInit {
  @ViewChild('carouselContainer', { static: false })
  private carouselRef!: ElementRef<HTMLElement>;
  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;
  private hasDragged = false;
  public projectsArray: ProjectData[] = Object.values(PROJECTS);

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    // Browser-specific setup can now run directly since we're not server-side rendered
  }

  onCarouselMouseDown(e: MouseEvent): void {
    if (!this.carouselRef?.nativeElement) return;

    this.isDown = true;
    this.hasDragged = false;
    const carousel = this.carouselRef.nativeElement;
    carousel.classList.add('active');
    this.startX = e.pageX - carousel.offsetLeft;
    this.scrollLeft = carousel.scrollLeft;
    e.preventDefault();
  }

  onCarouselMouseMove(e: MouseEvent): void {
    if (!this.isDown || !this.carouselRef?.nativeElement) return;

    e.preventDefault();
    const carousel = this.carouselRef.nativeElement;
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - this.startX) * 2; // Scroll speed multiplier

    // If we've moved more than a few pixels, consider it a drag
    if (Math.abs(walk) > 5) {
      this.hasDragged = true;
    }

    carousel.scrollLeft = this.scrollLeft - walk;
  }

  onCarouselMouseLeave(): void {
    this.resetCarousel();
  }

  onCarouselMouseUp(): void {
    this.resetCarousel();
  }

  onCarouselBoxClick(event: MouseEvent, href: string): void {
    // Prevent navigation if the user was dragging
    if (this.hasDragged) {
      event.preventDefault();
      return;
    }

    // Check if it's an external URL
    if (href.startsWith('http://') || href.startsWith('https://')) {
      // Open external URL in a new tab
      window.open(href, '_blank');
    } else {
      // Navigate to internal route
      this.router.navigate([href]);
    }
  }

  private resetCarousel(): void {
    this.isDown = false;
    this.hasDragged = false;
    this.carouselRef?.nativeElement?.classList.remove('active');
  }
}
