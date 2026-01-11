import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-student-materials',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="materials-container">
      <header class="page-header animate-fade-in">
        <div class="title-area">
          <h1>Cours & <span class="highlight">Supports</span></h1>
          <p class="text-muted">Accédez aux ressources partagées par vos enseignants.</p>
        </div>
      </header>

      <div class="materials-grid animate-fade-up">
        <div *ngFor="let material of materials" class="material-card glass-card">
          <div class="card-body">
            <div class="file-icon-wrap" [class]="material.fileType">
              <i [class]="getFileIcon(material.fileType)"></i>
            </div>
            <div class="material-details">
              <h3>{{ material.name }}</h3>
              <p class="module-name">{{ material.module?.name }}</p>
              <div class="meta-info">
                <span><i class="far fa-user me-1"></i> {{ material.uploadedBy?.name }}</span>
                <span><i class="far fa-hdd me-1"></i> {{ material.size }}</span>
              </div>
            </div>
            <a [href]="material.fileUrl" target="_blank" class="download-btn">
              <i class="fas fa-download"></i>
            </a>
          </div>
          <div class="card-footer">
             <span class="date">Ajouté le {{ material.createdAt | date:'dd MMM yyyy' }}</span>
             <span class="file-type-badge">{{ material.fileType | uppercase }}</span>
          </div>
        </div>

        <div *ngIf="materials.length === 0" class="col-12 text-center py-5 empty-state">
           <i class="fas fa-folder-open mb-3"></i>
           <p>Aucun support n'est disponible pour votre classe pour le moment.</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .materials-container { display: flex; flex-direction: column; gap: 2rem; }
    
    .page-header {
      h1 { font-size: 2rem; font-weight: 800; color: #0f172a; .highlight { color: #0055a4; } }
    }

    .materials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .glass-card {
      background: white; border-radius: 20px; overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9;
      transition: all 0.3s ease;
      &:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
    }

    .material-card {
      display: flex; flex-direction: column;
      
      .card-body {
        padding: 1.5rem; display: flex; align-items: center; gap: 1.2rem;
      }
      
      .file-icon-wrap {
        width: 60px; height: 60px; border-radius: 14px; display: flex;
        align-items: center; justify-content: center; font-size: 1.8rem;
        &.pdf { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        &.ppt { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        &.zip { background: rgba(107, 114, 128, 0.1); color: #6b7280; }
        &.other { background: rgba(0, 85, 164, 0.1); color: #0055a4; }
      }

      .material-details {
        flex: 1;
        h3 { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 0.3rem; }
        .module-name { color: #0055a4; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.5rem; }
        .meta-info {
          display: flex; gap: 1rem; font-size: 0.75rem; color: #64748b; font-weight: 500;
        }
      }

      .download-btn {
        width: 45px; height: 45px; border-radius: 50%; background: #f8fafc;
        display: flex; align-items: center; justify-content: center;
        color: #0055a4; text-decoration: none; transition: all 0.2s ease;
        &:hover { background: #0055a4; color: white; }
      }

      .card-footer {
        background: #f8fafc; padding: 0.8rem 1.5rem; display: flex;
        justify-content: space-between; align-items: center;
        .date { font-size: 0.7rem; color: #94a3b8; font-weight: 600; }
        .file-type-badge { font-size: 0.65rem; font-weight: 900; color: #64748b; letter-spacing: 1px; }
      }
    }

    .empty-state {
      background: white; border-radius: 20px; padding: 5rem; color: #94a3b8; border: 2px dashed #e2e8f0;
      i { font-size: 3rem; opacity: 0.2; }
      p { font-weight: 600; font-size: 1.1rem; }
    }

    .animate-fade-in { animation: fadeIn 0.6s ease-out; }
    .animate-fade-up { animation: fadeUp 0.6s ease-out both; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class StudentMaterialsComponent implements OnInit {
    materials: any[] = [];
    currentUser: any;

    constructor(private http: HttpClient, private authService: AuthService) {
        this.authService.currentUser.subscribe(user => this.currentUser = user);
    }

    ngOnInit(): void {
        this.loadMaterials();
    }

    loadMaterials(): void {
        if (!this.currentUser?.classGroup?._id) return;
        this.http.get<any[]>('/api/student/materials', {
            params: { classGroupId: this.currentUser.classGroup._id }
        }).subscribe({
            next: (data) => this.materials = data,
            error: (err) => console.error('Error loading materials', err)
        });
    }

    getFileIcon(type: string): string {
        switch (type) {
            case 'pdf': return 'far fa-file-pdf';
            case 'ppt': return 'far fa-file-powerpoint';
            case 'zip': return 'far fa-file-archive';
            default: return 'far fa-file-alt';
        }
    }
}
