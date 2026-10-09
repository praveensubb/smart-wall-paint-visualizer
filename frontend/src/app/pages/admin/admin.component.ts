import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container admin-layout">
      <div class="sidebar hidden-mobile">
        <h3 class="mb-6">Admin Settings</h3>
        <ul class="nav-menu">
          <li class="active">Overview</li>
          <li>Users</li>
          <li>Colors</li>
          <li>Patterns</li>
        </ul>
      </div>

      <div class="main-content">
        <div class="mb-8">
          <h2>Overview</h2>
          <p class="text-muted mt-2">Platform statistics and activity.</p>
        </div>
        
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
          <div class="card p-6 flex flex-col justify-between">
            <div class="text-muted font-medium mb-2">Total Users</div>
            <div class="text-gradient" style="font-size: 2.5rem; font-weight: 700; line-height: 1;">{{stats()?.totalUsers || 0}}</div>
          </div>
          <div class="card p-6 flex flex-col justify-between">
            <div class="text-muted font-medium mb-2">Saved Designs</div>
            <div class="text-gradient" style="font-size: 2.5rem; font-weight: 700; line-height: 1;">{{stats()?.totalDesigns || 0}}</div>
          </div>
          <div class="card p-6 flex flex-col justify-between">
            <div class="text-muted font-medium mb-2">Images Uploaded</div>
            <div class="text-gradient" style="font-size: 2.5rem; font-weight: 700; line-height: 1;">{{stats()?.imagesUploaded || 0}}</div>
          </div>
          <div class="card p-6 flex flex-col justify-between">
            <div class="text-muted font-medium mb-2">Avg Session</div>
            <div class="text-gradient" style="font-size: 2.5rem; font-weight: 700; line-height: 1;">{{stats()?.avgSessionDuration || '0'}}</div>
          </div>
        </div>

        <div class="grid mt-8" style="grid-template-columns: 1fr 1fr; gap: 2rem;">
          <div class="card p-6">
            <h3 class="mb-4">Recent Users</h3>
            <div class="table-wrapper">
              <table class="data-table">
                <tbody>
                  <tr *ngFor="let u of users()">
                    <td>
                      <div style="font-weight: 500;">{{u.name}}</div>
                      <div class="text-muted" style="font-size: 0.85rem;">{{u.email}}</div>
                    </td>
                    <td style="text-align: right;"><span class="badge">{{u.role}}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="card p-6">
            <h3 class="mb-4">Activity Log</h3>
            <div class="activity-list">
              <div *ngFor="let act of activity()" class="activity-item flex justify-between py-2 border-b">
                <div>
                  <span style="font-weight: 500;">{{act.userId?.name || 'Unknown'}}</span> {{act.action}}
                </div>
                <div class="text-muted" style="font-size: 0.8rem;">{{act.createdAt | date:'shortTime'}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout { display: flex; gap: 3rem; }
    .sidebar { width: 220px; flex-shrink: 0; }
    .main-content { flex: 1; min-width: 0; }
    .nav-menu { list-style: none; }
    .nav-menu li { padding: 0.75rem 1rem; border-radius: 8px; color: var(--text-muted); cursor: pointer; margin-bottom: 0.5rem; font-weight: 500; }
    .nav-menu li:hover { background: var(--surface-hover); color: var(--text-main); }
    .nav-menu li.active { background: rgba(99, 102, 241, 0.1); color: var(--primary-start); }
    
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table td { padding: 0.75rem 0; border-bottom: 1px solid var(--border-color); }
    .data-table tr:last-child td { border-bottom: none; }
    
    .activity-list .activity-item:last-child { border-bottom: none; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .border-b { border-bottom: 1px solid var(--border-color); }

    @media (max-width: 768px) {
      .hidden-mobile { display: none; }
      .admin-layout { flex-direction: column; }
      .grid { grid-template-columns: 1fr !important; }
    }
  `]
})
export class AdminComponent implements OnInit {
  api = inject(ApiService);
  stats = signal<any>(null);
  users = signal<any[]>([]);
  activity = signal<any[]>([]);

  ngOnInit() {
    this.api.get('/admin/stats').subscribe(res => this.stats.set(res));
    this.api.get('/admin/users').subscribe((res: any) => this.users.set(res.slice(0, 10)));
    this.api.get('/admin/activity').subscribe((res: any) => this.activity.set(res.slice(0, 15)));
  }
}
