import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';

// Task interface with the specified attributes
export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  [key: string]: any; // Index signature to allow dynamic property access
}

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

  // Signal-based state management
  private _tasks = signal<Task[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals for derived state
  readonly taskCount = computed(() => this._tasks().length);
  readonly completedTasks = computed(() =>
    this._tasks().filter((task) => task.status === 'completed')
  );
  readonly pendingTasks = computed(() =>
    this._tasks().filter((task) => task.status === 'pending')
  );

  constructor(private http: HttpClient) {
    // Initialize by loading tasks
    this.loadTasks();
  }

  // Load all tasks and update signals
  loadTasks(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<Task[]>(this.apiUrl).subscribe({
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

  // GET /api/tasks - Get all tasks
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // GET /api/tasks/:id - Get a specific task
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  // POST /api/tasks - Create a new task
  createTask(
    task: Omit<Task, 'id' | 'created_at' | 'updated_at'>
  ): Observable<Task> {
    this._loading.set(true);
    return this.http.post<Task>(this.apiUrl, task, this.httpOptions).pipe(
      tap({
        next: (newTask) => {
          // Update local state with new task
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

  // PUT /api/tasks/:id - Update a task
  updateTask(
    id: number,
    task: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>
  ): Observable<Task> {
    this._loading.set(true);
    return this.http
      .put<Task>(`${this.apiUrl}/${id}`, task, this.httpOptions)
      .pipe(
        tap({
          next: (updatedTask) => {
            // Update local state
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

  // DELETE /api/tasks/:id - Delete a task
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
  addTaskToState(task: Task): void {
    this._tasks.update((tasks) => [...tasks, task]);
  }

  removeTaskFromState(id: number): void {
    this._tasks.update((tasks) => tasks.filter((t) => t.id !== id));
  }

  updateTaskInState(updatedTask: Task): void {
    this._tasks.update((tasks) =>
      tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  }

  clearError(): void {
    this._error.set(null);
  }
}
