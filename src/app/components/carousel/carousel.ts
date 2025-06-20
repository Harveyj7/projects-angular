import {
  Component,
  AfterViewInit,
  ElementRef,
  Renderer2,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PROJECTS } from '../../../constants/projects';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel implements AfterViewInit {
  private carousel?: HTMLElement | null;
  private boxes?: NodeListOf<HTMLElement>;
  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;
  public projects = PROJECTS;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.carousel = this.el.nativeElement.querySelector('.carousel-container');
    this.boxes = this.el.nativeElement.querySelectorAll('.carousel-box');

    if (this.carousel) {
      // Add mouse event listeners for carousel container
      this.carousel.addEventListener('mousedown', (e: MouseEvent) => {
        this.isDown = true;
        this.carousel!.classList.add('active');
        this.startX = e.pageX - this.carousel!.offsetLeft;
        this.scrollLeft = this.carousel!.scrollLeft;
        e.preventDefault();
      });

      this.carousel.addEventListener('mouseleave', () => {
        this.isDown = false;
        this.carousel!.classList.remove('active');
      });

      this.carousel.addEventListener('mouseup', () => {
        this.isDown = false;
        this.carousel!.classList.remove('active');
      });

      this.carousel.addEventListener('mousemove', (e: MouseEvent) => {
        if (!this.isDown) return;
        e.preventDefault();
        const x = e.pageX - this.carousel!.offsetLeft;
        const walk = (x - this.startX) * 2; // Adjust scroll speed
        this.carousel!.scrollLeft = this.scrollLeft - walk;
      });

      // Prevent text selection during drag
      this.carousel.addEventListener('selectstart', (e: Event) => {
        e.preventDefault();
      });
    }

    // Add individual box interactions
    this.boxes?.forEach((box: HTMLElement, index: number) => {
      box.addEventListener('mousedown', (e: MouseEvent) => {
        // Prevent default to avoid text selection
        e.preventDefault();
      });

      box.addEventListener('click', (e: MouseEvent) => {
        if (this.isDown) {
          e.preventDefault();
        }
      });
    });
  }

  // Generate array for template iteration
  getBoxNumbers(): number[] {
    return Array.from({ length: 8 }, (_, i) => i + 1);
  }

  // Get project name by box number
  getProjectName(boxNumber: number): { text: string; href: string; src: any } {
    const projectKeys = Object.keys(this.projects);
    const projectKey = projectKeys[boxNumber - 1]; // Convert to 0-based index
    return projectKey
      ? this.projects[projectKey as keyof typeof this.projects]
      : { text: `Project ${boxNumber}`, href: '#', src: null };
  }
}
