import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="mb-8">
        <h2>Upload Photo</h2>
        <p class="text-muted mt-2">Add a new photo to start visualizing.</p>
      </div>

      <div class="card p-8 dropzone" 
           (click)="fileInput.click()"
           (dragover)="onDragOver($event)"
           (dragleave)="onDragLeave($event)"
           (drop)="onDrop($event)"
           [class.drag-over]="isDragging">
        <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/png, image/jpeg" style="display: none;">
        
        <div *ngIf="!previewUrl" class="text-center">
          <div class="upload-icon mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <h3 class="mb-2">Click or drag image to upload</h3>
          <p class="text-muted mb-4">SVG, PNG, JPG (max. 5MB)</p>
          <button class="btn btn-outline">Browse Files</button>
        </div>

        <div *ngIf="previewUrl" style="width: 100%; text-align: center;">
          <img [src]="previewUrl" alt="Preview" class="preview-img">
          <div class="mt-6 flex justify-center gap-4">
            <button class="btn btn-outline" (click)="clearPreview($event)">Cancel</button>
            <button class="btn btn-primary" (click)="upload($event)" [disabled]="isUploading">
              {{ isUploading ? 'Uploading...' : 'Start Designing' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dropzone {
      border: 2px dashed var(--border-color);
      box-shadow: none;
      background: transparent;
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .dropzone:hover, .dropzone.drag-over {
      border-color: var(--primary-start);
      background: var(--surface-hover);
    }
    .upload-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto;
      border-radius: 50%;
      background: var(--surface-hover);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
    }
    .dropzone:hover .upload-icon {
      background: rgba(99, 102, 241, 0.1);
      color: var(--primary-start);
    }
    .preview-img {
      max-height: 400px;
      max-width: 100%;
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow-soft);
    }
  `]
})
export class UploadComponent {
  projectService = inject(ProjectService);
  router = inject(Router);

  isDragging = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isUploading = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Max 5MB.');
      return;
    }
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = e => this.previewUrl = reader.result;
    reader.readAsDataURL(file);
  }

  clearPreview(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.previewUrl = null;
  }

  upload(event: Event) {
    event.stopPropagation();
    if (!this.selectedFile) return;
    this.isUploading = true;
    
    this.projectService.uploadImage(this.selectedFile).subscribe({
      next: (project: any) => {
        this.router.navigate(['/editor', project._id]);
      },
      error: () => {
        this.isUploading = false;
        alert('Upload failed');
      }
    });
  }
}
