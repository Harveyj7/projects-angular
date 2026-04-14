import { Component, OnInit } from '@angular/core';
import {inject,signal} from '@angular/core';
import { TasksService } from '../services/tasks.service';
import { TaskDto } from '../dtos/task-dto';
import { CommonModule } from '@angular/common';
import {DataService} from '../services/first.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-api',
  imports: [CommonModule],
  templateUrl: './api.html',
  styleUrl: './api.scss',
  standalone: true
})
export class Api implements OnInit {
  tasks: TaskDto[] = [];
  showData: boolean = false;
  loading: boolean = false;
  error: string = '';

  private tasksService = inject(TasksService);
  private dataService = inject(DataService);
  private springMessage = signal<string | undefined>('');

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.loading = true;
    this.error = '';
    this.dataService.getHello().subscribe({
      next: (response) => {
        this.springMessage.set(response.message);
        console.log('Received message:', this.springMessage());
        this.loading = false;
      },
      error: (err) => {
        console.error('Oops!', err);
        this.loading = false;
      }
    });

  // springMessage = toSignal(
  //     this.dataService.getHello().pipe(map(res => res.message)),
  //     { initialValue: '' }
  //   );

    this.tasksService.getTasks().subscribe({
      next: (response: TaskDto[]) => {
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

  getObjectKeys(obj: TaskDto): string[] {
    return Object.keys(obj);
  }
}
