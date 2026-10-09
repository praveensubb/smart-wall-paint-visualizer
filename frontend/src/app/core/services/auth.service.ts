import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  
  currentUser = signal<any>(null);
  isAuthenticated = signal<boolean>(false);
  isAdmin = signal<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.get(`${this.apiUrl}/me`).subscribe({
        next: (user: any) => {
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
          this.isAdmin.set(user.role === 'admin');
        },
        error: () => this.logout()
      });
    }
  }

  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        this.currentUser.set(res.user);
        this.isAuthenticated.set(true);
        this.isAdmin.set(res.user.role === 'admin');
      })
    );
  }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        this.currentUser.set(res.user);
        this.isAuthenticated.set(true);
        this.isAdmin.set(res.user.role === 'admin');
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.isAdmin.set(false);
    this.router.navigate(['/login']);
  }

  toggleFavouriteColor(colorId: string) {
    return this.http.post(`${this.apiUrl}/favourites/colors/${colorId}`, {}).pipe(
      tap((favs: any) => {
        const user = this.currentUser();
        if (user) {
          this.currentUser.set({ ...user, favouriteColors: favs });
        }
      })
    );
  }
}
