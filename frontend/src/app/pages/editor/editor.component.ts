import { Component, inject, OnInit, ViewChild, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../core/services/project.service';
import { ColorService } from '../../core/services/color.service';
import { PatternService } from '../../core/services/pattern.service';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { paintWalls } from '../../utils/paint';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="editor-layout">
      <!-- Top Actions Bar -->
      <div class="top-bar glass-panel flex justify-between items-center px-6 py-3">
        <div class="flex items-center gap-4">
          <button class="btn btn-outline btn-sm" (click)="showBeforeAfter = !showBeforeAfter; renderOverlay()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.5rem"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            {{ showBeforeAfter ? 'Hide Compare' : 'Compare' }}
          </button>
        </div>
        <div class="flex items-center gap-4">
          <button class="btn btn-outline btn-sm" (click)="download()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.5rem"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download
          </button>
          <button class="btn btn-primary btn-sm" (click)="saveProject()">Save Design</button>
        </div>
      </div>

      <div class="editor-body">
        <!-- Left Tool Rail -->
        <div class="tool-rail card">
          <div class="tool-group">
            <button class="icon-btn" [class.active]="currentTool === 'polygon'" (click)="setTool('polygon')" title="Draw Polygon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l8 6-3 10H7l-3-10z"/></svg>
            </button>
            <button class="icon-btn" [class.active]="currentTool === 'edit'" (click)="setTool('edit')" title="Edit Points">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="22"/><line x1="2" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="22" y2="12"/></svg>
            </button>
          </div>
          
          <div class="divider"></div>
          
          <div class="tool-group">
            <button class="icon-btn" (click)="undo()" title="Undo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
            </button>
            <button class="icon-btn" (click)="redo()" title="Redo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
            </button>
          </div>

          <div class="divider"></div>

          <div class="tool-group">
            <button class="icon-btn" (click)="addWall()" title="Add New Wall">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <button class="icon-btn danger" (click)="clearCurrentWall()" title="Clear Wall">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </div>
        </div>

        <!-- Canvas -->
        <div class="canvas-wrapper">
          <div class="canvas-container" #container style="position: relative; display: inline-block;">
            <canvas #mainCanvas style="display: block; max-width: 100%; max-height: calc(100vh - 200px); box-shadow: var(--shadow-hover); border-radius: 4px;"></canvas>
            <canvas #overlayCanvas (mousedown)="onMouseDown($event)" (mousemove)="onMouseMove($event)" (mouseup)="onMouseUp($event)" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; cursor: crosshair;"></canvas>
            
            <div class="slider-control" *ngIf="showBeforeAfter" style="z-index: 3;">
               <input type="range" min="0" max="100" [(ngModel)]="sliderValue" (input)="renderOverlay()">
            </div>
          </div>
          <div class="notice">Final results may vary due to lighting, screen calibration and wall texture.</div>
        </div>

        <!-- Right Palette -->
        <div class="palette card">
          <div class="tabs flex mb-6">
            <div class="tab" [class.active]="tab === 'colors'" (click)="tab = 'colors'">Colors</div>
            <div class="tab" [class.active]="tab === 'patterns'" (click)="tab = 'patterns'">Patterns</div>
            <div class="tab" [class.active]="tab === 'adjust'" (click)="tab = 'adjust'">Adjust</div>
          </div>

          <div class="tab-content" *ngIf="tab === 'colors'">
            <div class="form-group mb-4">
              <input type="text" class="form-control" placeholder="Search colors..." [(ngModel)]="searchQuery">
            </div>
            <div class="color-grid">
              <div *ngFor="let c of filteredColors()" 
                   class="color-swatch" 
                   [style.background-color]="c.hex" 
                   [class.selected]="selectedColor?._id === c._id"
                   (click)="selectColor(c)"
                   [title]="c.name">
              </div>
            </div>
          </div>

          <div class="tab-content" *ngIf="tab === 'patterns'">
            <div class="pattern-grid">
              <div *ngFor="let p of patterns()" 
                   class="pattern-swatch" 
                   [class.selected]="selectedPattern?._id === p._id"
                   (click)="selectPattern(p)">
                <img [src]="uploadsUrl + p.imageUrl" [alt]="p.name">
              </div>
            </div>
          </div>

          <div class="tab-content" *ngIf="tab === 'adjust'">
            <div class="form-group mb-6">
              <div class="flex justify-between items-center mb-2">
                <label class="form-label mb-0">Opacity</label>
                <span class="text-muted text-sm">{{(opacity() * 100).toFixed(0)}}%</span>
              </div>
              <input type="range" class="custom-range" min="0" max="1" step="0.05" [ngModel]="opacity()" (ngModelChange)="setOpacity($event)">
            </div>
            
            <div class="form-group mb-6">
              <div class="flex justify-between items-center mb-2">
                <label class="form-label mb-0">Brightness</label>
                <span class="text-muted text-sm">{{brightness().toFixed(1)}}</span>
              </div>
              <input type="range" class="custom-range" min="0" max="2" step="0.1" [ngModel]="brightness()" (ngModelChange)="setBrightness($event)">
            </div>

            <div class="form-group">
              <label class="form-label">Finish</label>
              <div class="finish-toggles flex p-1 rounded-lg">
                <button class="flex-1 btn-ghost" [class.active]="finish() === 'matte'" (click)="setFinish('matte')">Matte</button>
                <button class="flex-1 btn-ghost" [class.active]="finish() === 'glossy'" (click)="setFinish('glossy')">Glossy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .editor-layout { display: flex; flex-direction: column; height: calc(100vh - 80px); background: var(--bg-color); margin-top: -2rem; }
    .top-bar { height: 56px; border-bottom: 1px solid var(--border-color); padding: 0 1.5rem; position: relative; z-index: 10; }
    .btn-sm { padding: 0.4rem 0.8rem; font-size: 0.85rem; border-radius: 8px; }
    
    .editor-body { display: flex; flex: 1; overflow: hidden; }
    
    .tool-rail { width: 64px; border-radius: 0; border-top: none; border-bottom: none; border-left: none; display: flex; flex-direction: column; align-items: center; padding: 1rem 0; gap: 1rem; z-index: 5; }
    .tool-group { display: flex; flex-direction: column; gap: 0.5rem; width: 100%; align-items: center; }
    .icon-btn { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; color: var(--text-muted); cursor: pointer; transition: all 0.2s; }
    .icon-btn:hover { background: var(--surface-hover); color: var(--text-main); }
    .icon-btn.active { background: rgba(99, 102, 241, 0.1); color: var(--primary-start); }
    .icon-btn.danger:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    .divider { width: 32px; height: 1px; background: var(--border-color); }
    
    .canvas-wrapper { flex: 1; position: relative; overflow: hidden; background-image: radial-gradient(var(--border-color) 1px, transparent 1px); background-size: 20px 20px; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    
    .palette { width: 320px; border-radius: 0; border-top: none; border-bottom: none; border-right: none; display: flex; flex-direction: column; padding: 1.5rem; z-index: 5; overflow-y: auto; }
    .tabs { background: var(--surface-hover); padding: 0.25rem; border-radius: 10px; }
    .tab { flex: 1; text-align: center; padding: 0.5rem; font-size: 0.85rem; font-weight: 500; color: var(--text-muted); cursor: pointer; border-radius: 6px; transition: all 0.2s; }
    .tab:hover { color: var(--text-main); }
    .tab.active { background: var(--surface-color); color: var(--text-main); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .tab-content { flex: 1; }
    
    .color-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem; }
    .color-swatch { aspect-ratio: 1; border-radius: 50%; cursor: pointer; border: 2px solid transparent; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.15s, border-color 0.15s; }
    .color-swatch:hover { transform: scale(1.15); }
    .color-swatch.selected { border-color: var(--primary-start); transform: scale(1.15); box-shadow: 0 0 0 2px var(--bg-color), 0 0 0 4px var(--primary-start); }
    
    .pattern-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
    .pattern-swatch { aspect-ratio: 1; cursor: pointer; border: 2px solid transparent; border-radius: 50%; overflow: hidden; transition: transform 0.15s; }
    .pattern-swatch img { width: 100%; height: 100%; object-fit: cover; }
    .pattern-swatch.selected { border-color: var(--primary-start); transform: scale(1.1); box-shadow: 0 0 0 2px var(--bg-color), 0 0 0 4px var(--primary-start); }
    
    .custom-range { width: 100%; height: 6px; background: var(--border-color); border-radius: 3px; outline: none; -webkit-appearance: none; }
    .custom-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--surface-color); border: 2px solid var(--primary-start); cursor: pointer; }
    
    .finish-toggles { background: var(--surface-hover); }
    .finish-toggles .btn-ghost { padding: 0.5rem; border-radius: 6px; font-size: 0.85rem; font-weight: 500; }
    .finish-toggles .active { background: var(--surface-color); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    
    .notice { position: absolute; bottom: 1rem; right: 1rem; background: var(--glass-bg); backdrop-filter: blur(8px); color: var(--text-main); padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.75rem; pointer-events: none; border: 1px solid var(--border-color); box-shadow: var(--shadow-soft); z-index: 10; }
    
    .slider-control { position: absolute; bottom: 2rem; width: 60%; left: 20%; background: var(--glass-bg); padding: 0.5rem; border-radius: 20px; backdrop-filter: blur(8px); }
    .slider-control input { width: 100%; }
    .text-sm { font-size: 0.85rem; }
    .mb-0 { margin-bottom: 0; }
  `]
})
export class EditorComponent implements OnInit {
  @ViewChild('mainCanvas', { static: true }) mainCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('overlayCanvas', { static: true }) overlayCanvasRef!: ElementRef<HTMLCanvasElement>;
  
  route = inject(ActivatedRoute);
  projectService = inject(ProjectService);
  colorService = inject(ColorService);
  patternService = inject(PatternService);
  authService = inject(AuthService);
  router = inject(Router);

  uploadsUrl = environment.uploadsUrl;
  projectId!: string;
  project: any;
  originalImage = new Image();
  baseCanvasImage!: HTMLCanvasElement; // For downscaled original
  
  colors = signal<any[]>([]);
  patterns = signal<any[]>([]);
  searchQuery = '';
  tab = 'colors';

  walls: {
    polygon: {x: number, y: number}[],
    colorId?: string,
    patternId?: string,
    opacity: number,
    finish: string,
    brightness: number,
    colorHex?: string,
    patternImg?: HTMLImageElement
  }[] = [];
  
  currentWallIndex = 0;
  
  currentTool: 'polygon' | 'edit' = 'polygon';
  isDrawing = false;
  draggedPointIndex = -1;

  history: any[] = [];
  redoStack: any[] = [];

  opacity = signal(0.8);
  brightness = signal(1.0);
  finish = signal('matte');

  selectedColor: any = null;
  selectedPattern: any = null;

  showBeforeAfter = false;
  sliderValue = 50; // 0 to 100

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    
    this.colorService.getColors().subscribe(res => this.colors.set(res));
    this.patternService.getPatterns().subscribe(res => {
      this.patterns.set(res);
      // Preload pattern images
      res.forEach(p => {
        const img = new Image();
        img.src = this.uploadsUrl + p.imageUrl;
        p.imgObj = img;
      });
    });

    this.projectService.getProject(this.projectId).subscribe(p => {
      this.project = p;
      this.originalImage.crossOrigin = "Anonymous";
      this.originalImage.onload = () => {
        this.initCanvas();
        if (p.wallSelections && p.wallSelections.length > 0) {
          this.walls = p.wallSelections;
          this.walls.forEach(w => {
            if (w.colorId) w.colorHex = typeof w.colorId === 'object' ? (w.colorId as any).hex : this.colors().find(c=>c._id === w.colorId)?.hex;
            if (w.patternId) {
              const pat = typeof w.patternId === 'object' ? w.patternId : this.patterns().find(pt=>pt._id === w.patternId);
              if (pat) w.patternImg = (pat as any).imgObj;
            }
          });
          this.currentWallIndex = 0;
          this.loadWallSettings();
        } else {
          this.addWall();
        }
        this.saveState();
        this.renderAll();
      };
      this.originalImage.src = this.uploadsUrl + p.originalImageUrl;
    });
  }

  filteredColors() {
    if (!this.searchQuery) return this.colors();
    return this.colors().filter(c => c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || c.categoryTags.some((t: string) => t.toLowerCase().includes(this.searchQuery.toLowerCase())));
  }

  initCanvas() {
    let width = this.originalImage.width;
    let height = this.originalImage.height;
    const maxW = 1600;
    
    if (width > maxW) {
      height = Math.floor(height * (maxW / width));
      width = maxW;
    }
    
    this.baseCanvasImage = document.createElement('canvas');
    this.baseCanvasImage.width = width;
    this.baseCanvasImage.height = height;
    const baseCtx = this.baseCanvasImage.getContext('2d')!;
    baseCtx.drawImage(this.originalImage, 0, 0, width, height);

    this.mainCanvasRef.nativeElement.width = width;
    this.mainCanvasRef.nativeElement.height = height;
    
    this.overlayCanvasRef.nativeElement.width = width;
    this.overlayCanvasRef.nativeElement.height = height;
  }

  setTool(tool: 'polygon' | 'edit') {
    this.currentTool = tool;
  }

  addWall() {
    this.walls.push({
      polygon: [],
      opacity: 0.8,
      finish: 'matte',
      brightness: 1.0
    });
    this.currentWallIndex = this.walls.length - 1;
    this.loadWallSettings();
    this.saveState();
  }

  clearCurrentWall() {
    if (this.walls[this.currentWallIndex]) {
      this.walls[this.currentWallIndex].polygon = [];
      this.saveState();
      this.renderAll();
    }
  }

  loadWallSettings() {
    const w = this.walls[this.currentWallIndex];
    if (w) {
      this.opacity.set(w.opacity ?? 0.8);
      this.brightness.set(w.brightness ?? 1.0);
      this.finish.set(w.finish ?? 'matte');
      
      this.selectedColor = w.colorId ? this.colors().find(c => c._id === (typeof w.colorId === 'object' ? (w.colorId as any)._id : w.colorId)) : null;
      this.selectedPattern = w.patternId ? this.patterns().find(p => p._id === (typeof w.patternId === 'object' ? (w.patternId as any)._id : w.patternId)) : null;
    }
  }

  setOpacity(val: any) { 
    const num = Number(val);
    this.opacity.set(num); 
    this.updateWallSetting('opacity', num); 
  }
  
  setBrightness(val: any) { 
    const num = Number(val);
    this.brightness.set(num); 
    this.updateWallSetting('brightness', num); 
  }
  
  setFinish(val: string) { 
    this.finish.set(val); 
    this.updateWallSetting('finish', val); 
  }
  
  selectColor(c: any) {
    this.selectedColor = c;
    this.selectedPattern = null;
    if (this.walls[this.currentWallIndex]) {
      this.walls[this.currentWallIndex].colorId = c._id;
      this.walls[this.currentWallIndex].colorHex = c.hex;
      this.walls[this.currentWallIndex].patternId = undefined;
      this.walls[this.currentWallIndex].patternImg = undefined;
      this.saveState();
      this.renderAll();
    }
  }

  selectPattern(p: any) {
    this.selectedPattern = p;
    this.selectedColor = null;
    if (this.walls[this.currentWallIndex]) {
      this.walls[this.currentWallIndex].patternId = p._id;
      this.walls[this.currentWallIndex].patternImg = p.imgObj;
      this.walls[this.currentWallIndex].colorId = undefined;
      this.walls[this.currentWallIndex].colorHex = undefined;
      this.saveState();
      this.renderAll();
    }
  }

  updateWallSetting(key: string, value: any) {
    if (this.walls[this.currentWallIndex]) {
      (this.walls[this.currentWallIndex] as any)[key] = value;
      this.saveState();
      this.renderAll();
    }
  }

  // Canvas Interactions
  getMousePos(evt: MouseEvent) {
    const rect = this.overlayCanvasRef.nativeElement.getBoundingClientRect();
    const scaleX = this.overlayCanvasRef.nativeElement.width / rect.width;
    const scaleY = this.overlayCanvasRef.nativeElement.height / rect.height;
    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY
    };
  }

  onMouseDown(e: MouseEvent) {
    const pos = this.getMousePos(e);
    const wall = this.walls[this.currentWallIndex];
    if (!wall) return;

    if (this.currentTool === 'polygon') {
      wall.polygon.push(pos);
      this.saveState();
      this.renderAll();
    } else if (this.currentTool === 'edit') {
      // Find point near click
      const hitRadius = 15;
      this.draggedPointIndex = wall.polygon.findIndex(p => 
        Math.hypot(p.x - pos.x, p.y - pos.y) < hitRadius
      );
    }
  }

  onMouseMove(e: MouseEvent) {
    if (this.currentTool === 'edit' && this.draggedPointIndex > -1) {
      const pos = this.getMousePos(e);
      this.walls[this.currentWallIndex].polygon[this.draggedPointIndex] = pos;
      this.renderOverlay();
    }
  }

  onMouseUp(e: MouseEvent) {
    if (this.currentTool === 'edit' && this.draggedPointIndex > -1) {
      this.draggedPointIndex = -1;
      this.saveState();
      this.renderAll();
    }
  }

  saveState() {
    this.history.push(JSON.stringify(this.walls));
    if (this.history.length > 20) this.history.shift();
    this.redoStack = [];
  }

  undo() {
    if (this.history.length > 1) {
      this.redoStack.push(this.history.pop());
      this.walls = JSON.parse(this.history[this.history.length - 1]);
      this.renderAll();
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop();
      this.history.push(state);
      this.walls = JSON.parse(state);
      this.renderAll();
    }
  }

  renderAll() {
    paintWalls(this.mainCanvasRef.nativeElement, this.baseCanvasImage, this.walls);
    this.renderOverlay();
  }

  renderOverlay() {
    const canvas = this.overlayCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0, 0, w, h);

    // Draw polygon UI elements (points/lines) if not in compare mode
    if (!this.showBeforeAfter) {
      const wall = this.walls[this.currentWallIndex];
      if (wall && wall.polygon.length > 0) {
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(wall.polygon[0].x, wall.polygon[0].y);
        wall.polygon.forEach(p => {
          ctx.lineTo(p.x, p.y);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(p.x - 4, p.y - 4, 8, 8);
          ctx.strokeRect(p.x - 4, p.y - 4, 8, 8);
        });
        if (wall.polygon.length > 2) ctx.closePath();
        ctx.stroke();
      }
    }

    // Draw slider line and clip original over painted
    if (this.showBeforeAfter) {
      const clipX = (this.sliderValue / 100) * w;
      
      // Draw original image part to the left of the slider
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, clipX, h);
      ctx.clip();
      ctx.drawImage(this.baseCanvasImage, 0, 0, w, h);
      ctx.restore();

      // Draw slider line
      ctx.beginPath();
      ctx.moveTo(clipX, 0);
      ctx.lineTo(clipX, h);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.stroke();
    }
  }

  async saveProject() {
    // Generate blob from canvas directly (main canvas holds the painted result)
    const canvas = this.mainCanvasRef.nativeElement;
    
    canvas.toBlob(blob => {
      if (!blob) return;
      const file = new File([blob], 'rendered.png', { type: 'image/png' });
      
      const payload = {
        wallSelections: this.walls.map(w => ({
          polygon: w.polygon,
          colorId: w.colorId,
          patternId: w.patternId,
          opacity: w.opacity,
          finish: w.finish,
          brightness: w.brightness
        })),
        renderedImage: file
      };

      this.projectService.saveProject(this.projectId, payload).subscribe({
        next: () => alert('Saved successfully!'),
        error: (err) => alert('Failed to save project')
      });
    });
  }

  download() {
    const link = document.createElement('a');
    link.download = 'my-room-design.png';
    link.href = this.mainCanvasRef.nativeElement.toDataURL('image/png');
    link.click();
  }
}
