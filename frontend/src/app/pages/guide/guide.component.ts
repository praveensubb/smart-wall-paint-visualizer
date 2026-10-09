import { Component } from '@angular/core';

@Component({
  selector: 'app-guide',
  standalone: true,
  template: `
    <div class="container mt-4 glass-card p-4">
      <h2>How to Use Smart Wall Paint Visualizer</h2>
      <div class="mt-4">
        <h3>1. Upload your photo</h3>
        <p class="text-muted">Take a clear, well-lit photo of the room you want to paint. Upload it from your dashboard.</p>
        
        <h3 class="mt-4">2. Map your walls</h3>
        <p class="text-muted">In the editor, use the Polygon tool. Click around the edges of the wall you want to paint to create a selection area.</p>

        <h3 class="mt-4">3. Pick a color or pattern</h3>
        <p class="text-muted">Browse the palette on the right. Select a solid color, adjust the finish (matte/glossy), or choose a pattern overlay.</p>

        <h3 class="mt-4">4. Save and Compare</h3>
        <p class="text-muted">Save your design. You can create multiple designs for the same room to compare options.</p>
      </div>
    </div>
  `
})
export class GuideComponent {}
