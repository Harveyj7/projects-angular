import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  Signal,
} from '@angular/core';
import { PROJECTS } from '../../../constants/projects';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel {
  @ViewChild('carouselContainer', { static: false })
  private carouselRef!: ElementRef<HTMLElement>;
  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;
  private hasDragged = false;
  private touchStartX = 0;
  private touchScrollLeft = 0;
  public projectsArray = Object.values(PROJECTS);
  private authService = inject(AuthService);
  currentUser: Signal<User | null>;

  constructor(private router: Router) {
    this.currentUser = this.authService.currentUser;
  }

  onCarouselMouseDown(e: MouseEvent): void {
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

  onCarouselTouchStart(e: TouchEvent): void {
    const carousel = this.carouselRef.nativeElement;
    this.hasDragged = false;
    this.touchStartX = e.touches[0].pageX - carousel.offsetLeft;
    this.touchScrollLeft = carousel.scrollLeft;
  }

  onCarouselTouchMove(e: TouchEvent): void {
    if (!this.carouselRef?.nativeElement) return;

    const carousel = this.carouselRef.nativeElement;
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - this.touchStartX) * 2;

    if (Math.abs(walk) > 5) {
      this.hasDragged = true;
    }

    carousel.scrollLeft = this.touchScrollLeft - walk;
  }
  onCarouselBoxClick(event: MouseEvent, href: string): void {
    if (this.hasDragged) {
      event.preventDefault();
      return;
    }

    if (href.includes('.html')) {
      window.location.href = href;
    } else {
      this.router.navigate([href]);
    }
  }

  resetCarousel(): void {
    this.isDown = false;
    this.hasDragged = false;
    this.carouselRef?.nativeElement?.classList.remove('active');
  }
}
