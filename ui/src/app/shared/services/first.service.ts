import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) {}

  getHello() {
    return this.http.get<{message: string}>('/api/hello');
  }
}
