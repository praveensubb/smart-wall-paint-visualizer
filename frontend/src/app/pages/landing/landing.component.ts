import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="hero">
      <div class="hero-content text-center">
        <h1 class="hero-title">See your walls<br><span class="text-gradient">before you paint</span></h1>
        <p class="hero-subtitle">Upload a photo, map your walls, and instantly visualize thousands of premium colors and patterns with realistic shadows and lighting.</p>
        <div class="flex justify-center gap-4 mt-8">
          <a routerLink="/upload" class="btn btn-primary btn-lg">Start Designing Free</a>
          <a routerLink="/guide" class="btn btn-outline btn-lg flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z"/></svg>
            How it works
          </a>
        </div>
      </div>
    </div>

    <div class="container mt-8 mb-8">
      <div class="grid features-grid">
        <div class="card p-8 feature-card">
          <div class="icon-box">📸</div>
          <h3>Instant Upload</h3>
          <p class="text-muted mt-2">Take a photo of any space. Our platform handles the rest, preparing your canvas in seconds.</p>
        </div>
        <div class="card p-8 feature-card">
          <div class="icon-box">✨</div>
          <h3>Smart Mapping</h3>
          <p class="text-muted mt-2">Precision polygon tools let you mask walls perfectly, leaving furniture and fixtures untouched.</p>
        </div>
        <div class="card p-8 feature-card">
          <div class="icon-box">🎨</div>
          <h3>Realistic Render</h3>
          <p class="text-muted mt-2">Advanced blending preserves your room's natural shadows and highlights for a true-to-life look.</p>
        </div>
      </div>
    </div>
    
    <footer class="footer border-t mt-8 p-8 text-center text-muted">
      <div class="container">
        <p>&copy; 2026 SmartPaint. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .hero {
      padding: 6rem 1rem 4rem;
      background: radial-gradient(circle at 50% 0%, var(--surface-hover), transparent 70%);
    }
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }
    .hero-title {
      font-size: clamp(3rem, 8vw, 4.5rem);
      letter-spacing: -0.03em;
      margin-bottom: 1.5rem;
    }
    .hero-subtitle {
      font-size: 1.25rem;
      color: var(--text-muted);
      max-width: 600px;
      margin: 0 auto;
    }
    .btn-lg {
      padding: 1rem 2rem;
      font-size: 1.05rem;
    }
    .features-grid {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 4rem;
    }
    .icon-box {
      width: 48px;
      height: 48px;
      background: var(--surface-hover);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .border-t {
      border-top: 1px solid var(--border-color);
    }
  `]
})
export class LandingComponent {}
