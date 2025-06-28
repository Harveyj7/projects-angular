import { Component, OnInit } from '@angular/core';
import { TasksService, Task } from '../../services/tasks.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-api',
  imports: [CommonModule],
  templateUrl: './api.html',
  styleUrl: './api.scss',
})
export class Api implements OnInit {
  tasks: Task[] = [];
  showData: boolean = false;
  loading: boolean = false;
  error: string = '';

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.loading = true;
    this.error = '';

    this.tasksService.getTasks().subscribe({
      next: (response: Task[]) => {
        console.log('Tasks API Response:', response);
        this.tasks = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
        this.error = 'Failed to fetch data from server';
        this.loading = false;
      },
    });
  }

  toggleDataDisplay(): void {
    this.showData = !this.showData;
  }

  getObjectKeys(obj: Task): string[] {
    return Object.keys(obj);
  }
}
