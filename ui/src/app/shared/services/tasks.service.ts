import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';
import {TaskDto} from '../dtos/task-dto';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private apiUrl = '/api/tasks';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private _tasks = signal<TaskDto[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly taskCount = computed(() => this._tasks().length);
  readonly completedTasks = computed(() =>
    this._tasks().filter((task) => task.status === 'completed')
  );
  readonly pendingTasks = computed(() =>
    this._tasks().filter((task) => task.status === 'pending')
  );

  constructor(private http: HttpClient) {
    this.loadTasks();
  }

  loadTasks(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<TaskDto[]>(this.apiUrl).subscribe({
      next: (tasks) => {
        this._tasks.set(tasks);
        this._loading.set(false);
      },
      error: (error) => {
        this._error.set(error.message || 'Failed to load tasks');
        this._loading.set(false);
      },
    });
  }

  getTasks(): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(this.apiUrl);
  }

  getTask(id: number): Observable<TaskDto> {
    return this.http.get<TaskDto>(`${this.apiUrl}/${id}`);
  }

  createTask(
    task: Omit<TaskDto, 'id' | 'created_at' | 'updated_at'>
  ): Observable<TaskDto> {
    this._loading.set(true);
    return this.http.post<TaskDto>(this.apiUrl, task, this.httpOptions).pipe(
      tap({
        next: (newTask) => {
          this._tasks.update((tasks) => [...tasks, newTask]);
          this._loading.set(false);
        },
        error: (error) => {
          this._error.set(error.message || 'Failed to create task');
          this._loading.set(false);
        },
      })
    );
  }

  updateTask(
    id: number, task: Partial<Omit<TaskDto, 'id' | 'created_at' | 'updated_at'>>
  ): Observable<TaskDto> {
    this._loading.set(true);
    return this.http
      .put<TaskDto>(`${this.apiUrl}/${id}`, task, this.httpOptions)
      .pipe(
        tap({
          next: (updatedTask) => {
            this._tasks.update((tasks) =>
              tasks.map((t) => (t.id === id ? updatedTask : t))
            );
            this._loading.set(false);
          },
          error: (error) => {
            this._error.set(error.message || 'Failed to update task');
            this._loading.set(false);
          },
        })
      );
  }

  deleteTask(id: number): Observable<void> {
    this._loading.set(true);
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        tap({
          next: () => {
            // Remove task from local state
            this._tasks.update((tasks) => tasks.filter((t) => t.id !== id));
            this._loading.set(false);
          },
          error: (error) => {
            this._error.set(error.message || 'Failed to delete task');
            this._loading.set(false);
          },
        })
      );
  }

  // Alternative: Convert Observable to Signal using toSignal()
  // This creates a signal that automatically updates when the Observable emits
  getTasksAsSignal() {
    return toSignal(this.getTasks(), { initialValue: [] });
  }

  getTaskAsSignal(id: number) {
    return toSignal(this.getTask(id), { initialValue: null });
  }

  // Utility methods for signal-based operations
  addTaskToState(task: TaskDto): void {
    this._tasks.update((tasks) => [...tasks, task]);
  }

  removeTaskFromState(id: number): void {
    this._tasks.update((tasks) => tasks.filter((t) => t.id !== id));
  }

  updateTaskInState(updatedTask: TaskDto): void {
    this._tasks.update((tasks) =>
      tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  }

  clearError(): void {
    this._error.set(null);
  }
}
