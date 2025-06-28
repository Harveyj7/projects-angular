import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

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
    return this.http.post<Task>(this.apiUrl, task, this.httpOptions);
  }

  // PUT /api/tasks/:id - Update a task
  updateTask(
    id: number,
    task: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>
  ): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task, this.httpOptions);
  }

  // DELETE /api/tasks/:id - Delete a task
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }
}
