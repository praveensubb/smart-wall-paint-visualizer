import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PatternService {
  private apiUrl = environment.apiUrl + '/patterns';

  constructor(private http: HttpClient) {}

  getPatterns() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
