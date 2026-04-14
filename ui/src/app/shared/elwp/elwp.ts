import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';

interface TimelineConfig {
  years: number[];
  defaultYear: number;
  description: string;
}

interface CurvePosition {
  transform: string;
  zIndex: number;
}

@Component({
  selector: 'app-elwp',
  imports: [],
  templateUrl: './elwp.html',
  styleUrl: './elwp.scss',
  standalone: true
})
export class Elwp implements OnInit, OnDestroy {
  @ViewChild('timelineContainer', { static: false })
  timelineContainer!: ElementRef<HTMLElement>;
  @ViewChild('timelineDescription', { static: false })
  timelineDescription!: ElementRef<HTMLElement>;
  @ViewChild('timelineDescriptionExtended', { static: false })
  timelineDescriptionExtended!: ElementRef<HTMLElement>;
  @ViewChild('seeMoreButton', { static: false })
  seeMoreButton!: ElementRef<HTMLElement>;

  // Timeline Configuration
  private readonly TIMELINE_CONFIG: TimelineConfig = {
    years: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
    defaultYear: 2022,
    description:
      'Here comes the medium-length description of the timeline component for',
  };

  // State management
  private activeIndex: number = 0;
  private isExtended: boolean = false;

  ngOnInit(): void {
    this.activeIndex = this.TIMELINE_CONFIG.years.indexOf(
      this.TIMELINE_CONFIG.defaultYear,
    );

    // Use setTimeout to ensure view is initialized
    setTimeout(() => {
      this.initializeTimeline();
    }, 0);
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateTimelinePositions();
  }

  // Helper function to calculate position along the curve
  private calculateCurvePosition(
    index: number,
    totalItems: number,
    activeIndex: number,
  ): CurvePosition {
    const basePosition = index / (totalItems - 1);
    let xPos: number;

    if (window.innerWidth <= 640) {
      // Hardcoded positional values for mobile
      xPos = basePosition * 780 - 380;
    } else {
      xPos = basePosition * 1440 - 720;
    }

    const yPos = Math.sin(basePosition * Math.PI) * 10 - 5;
    const distanceFromActive = Math.abs(index - activeIndex);
    const scale = Math.max((1 - distanceFromActive) * 1.5, 1);

    return {
      transform: `translate(${xPos}%, ${yPos}px) scale(${scale})`,
      zIndex: index === activeIndex ? 10 : 1,
    };
  }

  // Create timeline item element
  private createTimelineItem(year: number, index: number): HTMLElement {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `Timeline item for year ${year}`);
    item.textContent = year.toString();

    // Add click event
    item.addEventListener('click', () => this.setActiveIndex(index));

    // Add keyboard event for accessibility
    item.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.setActiveIndex(index);
      }
    });

    return item;
  }

  // Update timeline item positions
  private updateTimelinePositions(): void {
    if (!this.timelineContainer) return;

    const container = this.timelineContainer.nativeElement;
    const items = container.querySelectorAll('.timeline-item');

    items.forEach((item, index) => {
      const position = this.calculateCurvePosition(
        index,
        this.TIMELINE_CONFIG.years.length,
        this.activeIndex,
      );

      (item as HTMLElement).style.transform = position.transform;
      (item as HTMLElement).style.zIndex = position.zIndex.toString();

      // Update active state
      if (index === this.activeIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Update timeline content
  private updateTimelineContent(): void {
    if (!this.timelineDescription) return;

    const currentYear = this.TIMELINE_CONFIG.years[this.activeIndex];
    const description = this.timelineDescription.nativeElement;

    description.textContent = `${this.TIMELINE_CONFIG.description} ${currentYear}. ${this.TIMELINE_CONFIG.description} ${currentYear}. ${this.TIMELINE_CONFIG.description} ${currentYear}. ${this.TIMELINE_CONFIG.description} ${currentYear}`;
  }

  // Set active index and update UI
  public setActiveIndex(index: number): void {
    this.activeIndex = index;
    this.updateTimelinePositions();
    this.updateTimelineContent();
    // Reset extended state when changing years
    this.isExtended = false;
    this.updateExtendedContent();
  }

  // Handle see more button click
  public handleSeeMore(): void {
    this.isExtended = !this.isExtended;
    this.updateExtendedContent();
  }

  // Update extended content visibility and button text
  private updateExtendedContent(): void {
    if (!this.timelineDescriptionExtended || !this.seeMoreButton) return;

    const descriptionExtended = this.timelineDescriptionExtended.nativeElement;
    const seeMoreButton = this.seeMoreButton.nativeElement;

    if (this.isExtended) {
      descriptionExtended.style.display = 'block';
      seeMoreButton.textContent = 'See less';
    } else {
      descriptionExtended.style.display = 'none';
      seeMoreButton.textContent = 'See more';
    }
  }

  // Initialize timeline
  private initializeTimeline(): void {
    if (!this.timelineContainer) return;

    const container = this.timelineContainer.nativeElement;

    // Create timeline items
    this.TIMELINE_CONFIG.years.forEach((year, index) => {
      const item = this.createTimelineItem(year, index);
      container.appendChild(item);
    });

    // Set initial positions and content
    this.updateTimelinePositions();
    this.updateTimelineContent();
    this.updateExtendedContent();
  }
}
