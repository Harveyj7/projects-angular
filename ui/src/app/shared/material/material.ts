import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-material',
  imports: [MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './material.html',
  styleUrl: './material.scss',
})
export class Material {}
