import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ColorService {
  private apiUrl = environment.apiUrl + '/colors';

  constructor(private http: HttpClient) {}

  getColors() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
