import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  email: string;
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Signal for current user
  public currentUser = signal<User | null>(null);

  constructor() {
    // Check if user is stored in localStorage on service initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.currentUser.set(user);
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(email: string, password: string): Promise<boolean> {
    return this.processAuthentication(email, password);
  }

  register(email: string, password: string): Promise<boolean> {
    return this.processAuthentication(email, password);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  private processAuthentication(
    email: string,
    password: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Basic validation
      if (!email || !password) {
        reject('Email and password are required');
        return;
      }

      if (!this.isValidEmail(email)) {
        reject('Please enter a valid email address');
        return;
      }

      if (password.length < 6) {
        reject('Password must be at least 6 characters long');
        return;
      }

      // Simulate API call delay
      setTimeout(() => {
        // TODO: Replace with actual API call
        // For demo purposes, we'll simulate successful authentication
        const user: User = {
          email,
          id: Math.random().toString(36).substr(2, 9),
          name: 'harvey',
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.currentUser.set(user);
        resolve(true);
      }, 1000);
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
