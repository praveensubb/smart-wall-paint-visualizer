import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private apiUrl = environment.apiUrl + '/projects';

  constructor(private http: HttpClient) {}

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getProjects() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProject(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  saveProject(id: string, data: any) {
    const formData = new FormData();
    if (data.renderedImage) {
      formData.append('renderedImage', data.renderedImage, 'rendered.png');
    }
    formData.append('wallSelections', JSON.stringify(data.wallSelections || []));
    
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deleteProject(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
