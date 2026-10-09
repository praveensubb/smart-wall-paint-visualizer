import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-layout">
      <div class="auth-visual hidden-mobile">
        <div class="shapes">
          <div class="shape shape-1" style="background: linear-gradient(135deg, #10B981, #3B82F6);"></div>
          <div class="shape shape-2" style="background: linear-gradient(135deg, #6366F1, #8B5CF6);"></div>
        </div>
        <div class="visual-content">
          <h2 style="color: white; font-size: 2.5rem; line-height: 1.2;">Start visualizing<br>your space.</h2>
          <p style="color: rgba(255,255,255,0.8); margin-top: 1rem;">Create an account to save and share your designs.</p>
        </div>
      </div>
      
      <div class="auth-form-container">
        <div class="form-wrapper">
          <div class="mb-8">
            <h2 class="mb-2">Create an account</h2>
            <p class="text-muted">Enter your details to get started.</p>
          </div>
          
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="flex-col gap-4">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" formControlName="name" class="form-control" placeholder="John Doe">
            </div>
            <div class="form-group">
              <label class="form-label">Email address</label>
              <input type="email" formControlName="email" class="form-control" placeholder="name@example.com">
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" formControlName="password" class="form-control" placeholder="••••••••">
            </div>
            
            <div *ngIf="error" class="error-msg">{{error}}</div>
            
            <button type="submit" [disabled]="registerForm.invalid" class="btn btn-primary mt-2" style="width: 100%; padding: 1rem;">Create Account</button>
          </form>
          
          <p class="text-center mt-8 text-muted">
            Already have an account? <a routerLink="/login" style="color: var(--primary-start); font-weight: 500;">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout { display: flex; min-height: calc(100vh - 110px); margin: -2rem -2rem 0; }
    .auth-visual { flex: 1; background: linear-gradient(135deg, #020617, #0f172a); position: relative; overflow: hidden; display: flex; align-items: center; padding: 4rem; }
    .shapes { position: absolute; inset: 0; opacity: 0.5; }
    .shape { position: absolute; filter: blur(80px); border-radius: 50%; }
    .shape-1 { width: 400px; height: 400px; top: -100px; left: -100px; }
    .shape-2 { width: 300px; height: 300px; bottom: 100px; right: -50px; }
    .visual-content { position: relative; z-index: 10; }
    .auth-form-container { flex: 1; display: flex; align-items: center; justify-content: center; background: var(--bg-color); padding: 2rem; }
    .form-wrapper { width: 100%; max-width: 400px; }
    .error-msg { background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 0.75rem; border-radius: 8px; font-size: 0.85rem; margin-top: -0.5rem; }
    @media (max-width: 768px) { .hidden-mobile { display: none; } .auth-layout { margin: 0; } }
  `]
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  error = '';

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => this.error = err.error?.message || 'Registration failed'
      });
    }
  }
}
