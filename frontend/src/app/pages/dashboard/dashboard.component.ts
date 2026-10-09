import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="container">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2>My Projects</h2>
          <p class="text-muted mt-2">Manage your uploaded spaces and designs.</p>
        </div>
        <a routerLink="/upload" class="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Project
        </a>
      </div>

      <div *ngIf="loading()" class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem;">
        <div class="card skeleton" style="height: 240px;"></div>
        <div class="card skeleton" style="height: 240px;"></div>
        <div class="card skeleton" style="height: 240px;"></div>
      </div>

      <div *ngIf="!loading() && projects().length === 0" class="empty-state card p-8 text-center">
        <div class="empty-icon">🎨</div>
        <h3 class="mt-4">No projects yet</h3>
        <p class="text-muted mt-2 mb-4">Start by uploading a photo of your room.</p>
        <a routerLink="/upload" class="btn btn-primary">Upload Photo</a>
      </div>

      <div *ngIf="!loading() && projects().length > 0" class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem;">
        <div class="card project-card" *ngFor="let p of projects()">
          <div class="img-wrapper">
            <img [src]="uploadsUrl + (p.renderedImageUrl || p.originalImageUrl)" alt="Project">
            <div class="overlay flex items-center justify-center gap-2">
              <button (click)="openEditor(p._id)" class="btn btn-primary">Edit</button>
            </div>
          </div>
          <div class="p-4 flex justify-between items-center">
            <div>
              <div style="font-weight: 500;">Project</div>
              <div class="text-muted" style="font-size: 0.85rem;">{{p.createdAt | date:'mediumDate'}}</div>
            </div>
            <button (click)="deleteProject(p._id)" class="btn-ghost icon-btn" title="Delete" style="color: #ef4444; padding: 0.5rem; border-radius: 8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 300px;
      border: 1px dashed var(--border-color);
      box-shadow: none;
      background: transparent;
    }
    .empty-icon {
      font-size: 3rem;
      opacity: 0.5;
    }
    .project-card {
      overflow: hidden;
    }
    .img-wrapper {
      position: relative;
      height: 200px;
      overflow: hidden;
      border-bottom: 1px solid var(--border-color);
    }
    .img-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .img-wrapper .overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.5);
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .project-card:hover .img-wrapper img {
      transform: scale(1.05);
    }
    .project-card:hover .img-wrapper .overlay {
      opacity: 1;
    }
  `]
})
export class DashboardComponent implements OnInit {
  projectService = inject(ProjectService);
  authService = inject(AuthService);
  router = inject(Router);
  
  projects = signal<any[]>([]);
  loading = signal(true);
  uploadsUrl = environment.uploadsUrl;

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (res) => {
        this.projects.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openEditor(id: string) {
    this.router.navigate(['/editor', id]);
  }

  deleteProject(id: string) {
    if(confirm('Delete this project?')) {
      this.projectService.deleteProject(id).subscribe(() => this.loadProjects());
    }
  }
}
