import {
  Component,
  AfterViewInit,
  ElementRef,
  Renderer2,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Chatbot } from './components/chatbot/chatbot';
import { Carousel } from './components/carousel/carousel';
import { Navbar } from './components/navbar/navbar';
import { PROJECTS } from '../constants/projects';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Chatbot, Carousel, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  protected projects = PROJECTS;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
  }
}
