import { Component, inject, OnInit, signal } from '@angular/core';
import { ProjectService } from '../../core/services/project.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-saved',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="mb-8">
        <h2>Saved Designs</h2>
        <p class="text-muted mt-2">Your rendered ideas and variations.</p>
      </div>
      
      <div *ngIf="designs().length === 0" class="card p-8 text-center" style="border: 1px dashed var(--border-color); background: transparent; box-shadow: none;">
        <p class="text-muted">No designs have been saved yet.</p>
      </div>
      
      <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
        <div class="card design-card" *ngFor="let d of designs()">
          <div class="img-wrapper">
            <img [src]="uploadsUrl + d.renderedImageUrl" alt="Rendered Design">
          </div>
          <div class="p-4 flex justify-between items-center">
            <a [href]="uploadsUrl + d.renderedImageUrl" download="design.png" target="_blank" class="btn btn-outline" style="padding: 0.5rem 1rem;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download
            </a>
            <button class="btn-ghost icon-btn" style="color: #ef4444;" (click)="deleteDesign(d._id)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .design-card { overflow: hidden; }
    .img-wrapper { height: 220px; border-bottom: 1px solid var(--border-color); }
    .img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .icon-btn { padding: 0.5rem; border-radius: 8px; border: none; cursor: pointer; }
  `]
})
export class SavedComponent implements OnInit {
  projectService = inject(ProjectService);
  designs = signal<any[]>([]);
  uploadsUrl = environment.uploadsUrl;

  ngOnInit() {
    this.loadDesigns();
  }

  loadDesigns() {
    this.projectService.getProjects().subscribe(projects => {
      this.designs.set(projects.filter(p => p.renderedImageUrl));
    });
  }

  deleteDesign(id: string) {
    if(confirm('Delete this design?')) {
      this.projectService.deleteProject(id).subscribe(() => this.loadDesigns());
    }
  }
}
