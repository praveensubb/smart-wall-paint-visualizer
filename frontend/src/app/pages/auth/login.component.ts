import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-layout">
      <div class="auth-visual hidden-mobile">
        <div class="shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
        </div>
        <div class="visual-content">
          <h2 style="color: white; font-size: 2.5rem; line-height: 1.2;">Welcome back to<br>SmartPaint.</h2>
          <p style="color: rgba(255,255,255,0.8); margin-top: 1rem;">Continue designing your perfect space.</p>
        </div>
      </div>
      
      <div class="auth-form-container">
        <div class="form-wrapper">
          <div class="mb-8">
            <h2 class="mb-2">Sign in</h2>
            <p class="text-muted">Enter your details to access your dashboard.</p>
          </div>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex-col gap-4">
            <div class="form-group">
              <label class="form-label">Email address</label>
              <input type="email" formControlName="email" class="form-control" placeholder="name@example.com">
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" formControlName="password" class="form-control" placeholder="••••••••">
            </div>
            
            <div *ngIf="error" class="error-msg">{{error}}</div>
            
            <button type="submit" [disabled]="loginForm.invalid" class="btn btn-primary mt-2" style="width: 100%; padding: 1rem;">Sign In</button>
          </form>
          
          <p class="text-center mt-8 text-muted">
            Don't have an account? <a routerLink="/register" style="color: var(--primary-start); font-weight: 500;">Create one</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      display: flex;
      min-height: calc(100vh - 110px);
      margin: -2rem -2rem 0;
    }
    .auth-visual {
      flex: 1;
      background: linear-gradient(135deg, #0f172a, #1e1b4b);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      padding: 4rem;
    }
    .shapes {
      position: absolute;
      inset: 0;
      opacity: 0.5;
    }
    .shape {
      position: absolute;
      background: linear-gradient(135deg, var(--primary-start), var(--primary-end));
      filter: blur(80px);
      border-radius: 50%;
    }
    .shape-1 { width: 400px; height: 400px; top: -100px; left: -100px; }
    .shape-2 { width: 300px; height: 300px; bottom: 100px; right: -50px; }
    .visual-content { position: relative; z-index: 10; }
    
    .auth-form-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-color);
      padding: 2rem;
    }
    .form-wrapper {
      width: 100%;
      max-width: 400px;
    }
    .error-msg {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.85rem;
      margin-top: -0.5rem;
    }
    @media (max-width: 768px) {
      .hidden-mobile { display: none; }
      .auth-layout { margin: 0; }
    }
  `]
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  error = '';

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => this.error = err.error?.message || 'Login failed'
      });
    }
  }
}
