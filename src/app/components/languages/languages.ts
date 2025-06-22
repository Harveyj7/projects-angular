import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { PROJECTS } from '../../../constants/projects';
import { Header } from '../header/header';

@Component({
  selector: 'app-languages',
  imports: [Header],
  templateUrl: './languages.html',
  styleUrl: './languages.scss',
})
export class Languages {
  projects = PROJECTS;
}
