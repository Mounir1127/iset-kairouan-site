import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../../services/staff.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-staff-materials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="materials-page">
      <!-- HEADER -->
      <div class="header-wrap glass-card">
        <div class="header-main">
          <div class="title-wrap">
            <h2>Supports de Cours</h2>
            <p>Déposez et gérez vos supports pédagogiques (PDF, Slides, TD, TP).</p>
          </div>
          <div class="header-actions">
            <button class="btn-primary" (click)="triggerUpload()">
              <i class="fas fa-plus"></i> Nouveau Support
            </button>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <div class="content-row">
        <!-- DIRECTORY / MODULES LIST -->
        <div class="modules-sidebar glass-card">
          <h3>Mes Modules</h3>
          <div class="loading-mini" *ngIf="loadingModules">
            <i class="fas fa-spinner fa-spin"></i>
          </div>
          <div class="module-items" *ngIf="!loadingModules">
            <div *ngFor="let mod of modules" 
                 class="module-item" 
                 [class.active]="selectedModule?._id === mod._id"
                 (click)="selectModule(mod)">
              <i class="fas fa-folder" [class.fa-folder-open]="selectedModule?._id === mod._id"></i>
              <span>{{ mod.name }}</span>
              <span class="count">{{ getFileCount(mod._id) }}</span>
            </div>
          </div>
        </div>

        <!-- FILES GRID -->
        <div class="files-view glass-card">
          <div class="files-header">
            <h3>Fichiers dans <span>{{ selectedModule?.name || '...' }}</span></h3>
            <div class="view-controls">
              <button class="icon-btn active"><i class="fas fa-th-large"></i></button>
              <button class="icon-btn"><i class="fas fa-list"></i></button>
            </div>
          </div>

          <div class="loading-state" *ngIf="loadingFiles">
            <i class="fas fa-circle-notch fa-spin"></i>
            <p>Chargement des fichiers...</p>
          </div>

          <div class="files-grid" *ngIf="!loadingFiles">
            <div *ngFor="let file of filteredFiles" class="file-card">
              <div class="file-icon" [ngClass]="getFileType(file.fileType)">
                <i class="fas" [class.fa-file-pdf]="getFileType(file.fileType) === 'pdf'" 
                             [class.fa-file-powerpoint]="getFileType(file.fileType) === 'ppt'"
                             [class.fa-file-archive]="getFileType(file.fileType) === 'zip'"
                             [class.fa-file]="getFileType(file.fileType) === 'other'"></i>
              </div>
              <div class="file-info">
                <span class="file-name">{{ file.name }}</span>
                <span class="file-meta">{{ file.description || 'Pas de description' }} • {{ file.size || 'N/A' }}</span>
              </div>
              <div class="file-actions">
                <a [href]="file.fileUrl" class="mini-btn" target="_blank" title="Télécharger"><i class="fas fa-download"></i></a>
                <button class="mini-btn delete" title="Supprimer"><i class="fas fa-trash-alt"></i></button>
              </div>
            </div>

            <!-- EMPTY STATE -->
            <div class="empty-state" *ngIf="filteredFiles.length === 0 && selectedModule">
              <i class="fas fa-folder-open"></i>
              <p>Aucun fichier dans ce module</p>
              <button type="button" class="btn-upload-empty" (click)="triggerUpload()">
                <i class="fas fa-plus"></i> Ajouter un fichier
              </button>
            </div>

            <!-- UPLOAD PLACEHOLDER -->
            <div class="upload-placeholder" (click)="triggerUpload()" *ngIf="filteredFiles.length > 0">
              <i class="fas fa-cloud-upload-alt"></i>
              <span>Cliquer pour ajouter</span>
            </div>
          </div>
        </div>
      </div>

      <!-- UPLOAD MODAL -->
      <div class="modal-overlay" *ngIf="showUploadModal" (click)="closeUploadModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3><i class="fas fa-cloud-upload-alt"></i> Ajouter un Support</h3>
            <button class="btn-close" (click)="closeUploadModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="submitUpload()">
              <div class="form-group">
                <label>Module <span class="required">*</span></label>
                <select [(ngModel)]="uploadForm.moduleId" name="module" required class="form-control">
                  <option [value]="null">-- Sélectionner un module --</option>
                  <option *ngFor="let mod of modules" [value]="mod._id">{{ mod.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Nom du fichier <span class="required">*</span></label>
                <input type="text" [(ngModel)]="uploadForm.name" name="name" required class="form-control" placeholder="Ex: Cours Chapitre 1">
              </div>

              <div class="form-group">
                <label>Description</label>
                <textarea [(ngModel)]="uploadForm.description" name="description" class="form-control" rows="3" placeholder="Brève description du contenu..."></textarea>
              </div>

              <div class="form-group">
                <label>Type de fichier <span class="required">*</span></label>
                <select [(ngModel)]="uploadForm.fileType" name="fileType" required class="form-control">
                  <option value="pdf">PDF</option>
                  <option value="ppt">PowerPoint</option>
                  <option value="zip">Archive ZIP</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div class="form-group">
                <label>Source du fichier <span class="required">*</span></label>
                <div class="upload-mode-toggle">
                  <button type="button" 
                          class="toggle-btn" 
                          [class.active]="uploadMode === 'file'"
                          (click)="uploadMode = 'file'">
                    <i class="fas fa-upload"></i> Fichier local
                  </button>
                  <button type="button" 
                          class="toggle-btn" 
                          [class.active]="uploadMode === 'url'"
                          (click)="uploadMode = 'url'">
                    <i class="fas fa-link"></i> URL externe
                  </button>
                </div>
              </div>

              <!-- FILE UPLOAD MODE -->
              <div class="form-group" *ngIf="uploadMode === 'file'">
                <label>Sélectionner un fichier <span class="required">*</span></label>
                <div class="file-upload-zone" (click)="fileInput.click()">
                  <input #fileInput 
                         type="file" 
                         (change)="onFileSelected($event)" 
                         accept=".pdf,.ppt,.pptx,.zip,.rar,.doc,.docx"
                         style="display: none;">
                  <div class="upload-zone-content" *ngIf="!selectedFile">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Cliquez pour sélectionner un fichier</p>
                    <small>PDF, PowerPoint, ZIP, Word (Max 50 MB)</small>
                  </div>
                  <div class="selected-file-info" *ngIf="selectedFile">
                    <i class="fas fa-file-alt"></i>
                    <div class="file-details">
                      <strong>{{ selectedFile.name }}</strong>
                      <small>{{ formatFileSize(selectedFile.size) }}</small>
                    </div>
                    <button type="button" class="btn-remove-file" (click)="removeFile($event)">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <small class="form-hint">Note: Le fichier sera uploadé vers le serveur</small>
              </div>

              <!-- URL MODE -->
              <div class="form-group" *ngIf="uploadMode === 'url'">
                <label>URL du fichier <span class="required">*</span></label>
                <input type="url" [(ngModel)]="uploadForm.fileUrl" name="fileUrl" class="form-control" placeholder="https://example.com/file.pdf">
                <small class="form-hint">Lien direct vers le fichier hébergé (Google Drive, Dropbox, etc.)</small>
              </div>

              <div class="form-group">
                <label>Taille du fichier</label>
                <input type="text" [(ngModel)]="uploadForm.size" name="size" class="form-control" placeholder="Ex: 2.5 MB">
              </div>

              <div class="modal-actions">
                <button type="button" class="btn-secondary" (click)="closeUploadModal()">Annuler</button>
                <button type="submit" class="btn-primary" [disabled]="uploading">
                  <i class="fas" [class.fa-spinner]="uploading" [class.fa-spin]="uploading" [class.fa-upload]="!uploading"></i>
                  {{ uploading ? 'Envoi...' : 'Ajouter le support' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .materials-page { display: flex; flex-direction: column; gap: 2rem; animation: fadeIn 0.6s ease; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 24px; padding: 2.2rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03); }
    .header-main { display: flex; justify-content: space-between; align-items: center; h2 { font-size: 1.8rem; font-weight: 900; color: #0f172a; } p { color: #64748b; font-weight: 500; } .btn-primary { background: #0055a4; color: white; border: none; padding: 0.9rem 1.8rem; border-radius: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.8rem; transition: all 0.3s; &:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0, 85, 164, 0.2); } } }
    .content-row { display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem; }
    .modules-sidebar { h3 { font-size: 1.1rem; font-weight: 850; color: #0f172a; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.5px; } .module-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 14px; cursor: pointer; transition: all 0.3s; color: #64748b; font-weight: 600; margin-bottom: 0.5rem; i { font-size: 1.2rem; color: #94a3b8; } .count { margin-left: auto; padding: 0.2rem 0.6rem; background: #f1f5f9; border-radius: 6px; font-size: 0.75rem; } &:hover { background: #f8fafc; color: #0055a4; } &.active { background: #eff6ff; color: #0055a4; i { color: #0055a4; } } } }
    .files-view { .files-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; h3 { font-size: 1.3rem; font-weight: 800; color: #0f172a; span { color: #0055a4; } } .view-controls { display: flex; gap: 0.5rem; .icon-btn { width: 40px; height: 40px; border-radius: 10px; border: 1px solid #e2e8f0; background: white; color: #64748b; cursor: pointer; &.active { background: #0055a4; color: white; border-color: #0055a4; } } } } .files-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; } .empty-state { grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; color: #94a3b8; i { font-size: 4rem; margin-bottom: 1rem; opacity: 0.3; } p { font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; } .btn-upload-empty { background: #0055a4; color: white; border: none; padding: 0.9rem 1.8rem; border-radius: 14px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 0.8rem; transition: all 0.3s; &:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0, 85, 164, 0.2); } } } .file-card { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 20px; padding: 1.5rem; display: flex; flex-direction: column; align-items: center; text-align: center; transition: all 0.3s; &:hover { transform: translateY(-5px); border-color: #0055a4; background: white; box-shadow: 0 10px 20px rgba(0,0,0,0.05); } .file-icon { width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 1rem; &.pdf { background: #fee2e2; color: #ef4444; } &.ppt { background: #ffedd5; color: #f97316; } &.zip { background: #e0e7ff; color: #4f46e5; } &.other { background: #f1f5f9; color: #64748b; } } .file-name { display: block; font-weight: 700; font-size: 0.95rem; color: #0f172a; margin-bottom: 0.3rem; width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .file-meta { font-size: 0.75rem; color: #94a3b8; font-weight: 600; } .file-actions { margin-top: 1.2rem; display: flex; gap: 0.8rem; .mini-btn { width: 32px; height: 32px; border-radius: 8px; border: none; background: #e2e8f0; color: #475569; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; &:hover { background: #0055a4; color: white; } &.delete:hover { background: #ef4444; } } } } .upload-placeholder { border: 2px dashed #e2e8f0; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; cursor: pointer; color: #94a3b8; transition: all 0.3s; min-height: 200px; &:hover { border-color: #0055a4; color: #0055a4; background: #f0f7ff; } i { font-size: 2rem; } span { font-weight: 700; font-size: 0.9rem; } } }
    .loading-state, .loading-mini { padding: 2rem; text-align: center; color: #64748b; i { font-size: 2rem; margin-bottom: 1rem; } }
    
    /* MODAL STYLES */
    .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .modal-content { background: white; border-radius: 24px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); animation: slideUp 0.3s ease; }
    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .modal-header { padding: 2rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; h3 { font-size: 1.5rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 0.8rem; i { color: #0055a4; } } .btn-close { width: 40px; height: 40px; border-radius: 10px; border: none; background: #f1f5f9; color: #64748b; cursor: pointer; transition: all 0.3s; &:hover { background: #ef4444; color: white; } } }
    .modal-body { padding: 2rem; }
    .form-group { margin-bottom: 1.5rem; label { display: block; font-weight: 700; font-size: 0.9rem; color: #0f172a; margin-bottom: 0.5rem; .required { color: #ef4444; } } .form-control { width: 100%; padding: 0.8rem 1rem; border: 1px solid #e2e8f0; border-radius: 12px; font-family: inherit; font-size: 0.95rem; transition: all 0.3s; &:focus { outline: none; border-color: #0055a4; box-shadow: 0 0 0 3px rgba(0, 85, 164, 0.1); } } .form-hint { display: block; margin-top: 0.5rem; font-size: 0.8rem; color: #94a3b8; } }
    
    .upload-mode-toggle { display: flex; gap: 0.5rem; margin-top: 0.5rem; .toggle-btn { flex: 1; padding: 0.8rem 1rem; border: 2px solid #e2e8f0; background: white; border-radius: 12px; font-weight: 700; font-size: 0.9rem; color: #64748b; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; &:hover { border-color: #0055a4; color: #0055a4; } &.active { background: #0055a4; color: white; border-color: #0055a4; } } }
    
    .file-upload-zone { border: 2px dashed #e2e8f0; border-radius: 16px; padding: 2rem; text-align: center; cursor: pointer; transition: all 0.3s; margin-top: 0.5rem; &:hover { border-color: #0055a4; background: #f0f7ff; } .upload-zone-content { color: #94a3b8; i { font-size: 3rem; margin-bottom: 1rem; display: block; } p { font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem; color: #64748b; } small { font-size: 0.85rem; } } .selected-file-info { display: flex; align-items: center; gap: 1rem; background: #f8fafc; padding: 1rem; border-radius: 12px; i { font-size: 2rem; color: #0055a4; } .file-details { flex: 1; text-align: left; strong { display: block; font-size: 0.95rem; color: #0f172a; margin-bottom: 0.3rem; } small { color: #94a3b8; font-size: 0.85rem; } } .btn-remove-file { width: 32px; height: 32px; border-radius: 8px; border: none; background: #fee2e2; color: #ef4444; cursor: pointer; transition: all 0.3s; &:hover { background: #ef4444; color: white; } } } }
    
    .modal-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; .btn-secondary { background: #f1f5f9; color: #64748b; border: none; padding: 0.9rem 1.8rem; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s; &:hover { background: #e2e8f0; } } .btn-primary { background: #0055a4; color: white; border: none; padding: 0.9rem 1.8rem; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.8rem; transition: all 0.3s; &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0, 85, 164, 0.2); } &:disabled { opacity: 0.6; cursor: not-allowed; } } }
    
    @media (max-width: 1024px) { .content-row { grid-template-columns: 1fr; } }
  `]
})
export class StaffMaterialsComponent implements OnInit {
  modules: any[] = [];
  selectedModule: any = null;
  allFiles: any[] = [];
  filteredFiles: any[] = []

  loadingModules = false;
  loadingFiles = false;

  showUploadModal = false;
  uploading = false;
  uploadMode: 'file' | 'url' = 'file';
  selectedFile: File | null = null;

  uploadForm = {
    moduleId: null as string | null,
    name: '',
    description: '',
    fileType: 'pdf',
    fileUrl: '',
    size: ''
  };

  constructor(private staffService: StaffService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.loadingModules = true;
    this.staffService.getModules().subscribe({
      next: (data) => {
        this.modules = data;
        if (this.modules.length > 0) {
          this.selectModule(this.modules[0]);
        }
        this.loadingModules = false;
      },
      error: (err) => {
        console.error('Error modules', err);
        this.loadingModules = false;
      }
    });

    this.staffService.getMaterials().subscribe({
      next: (data) => {
        this.allFiles = data;
        this.updateFilteredFiles();
      },
      error: (err) => console.error('Error materials', err)
    });
  }

  selectModule(mod: any) {
    this.selectedModule = mod;
    this.updateFilteredFiles();
  }

  updateFilteredFiles() {
    if (!this.selectedModule) {
      this.filteredFiles = [];
      return;
    }
    this.filteredFiles = this.allFiles.filter(f => f.module === this.selectedModule._id || (f.module && f.module._id === this.selectedModule._id));
  }

  getFileCount(modId: string) {
    return this.allFiles.filter(f => f.module === modId || (f.module && f.module._id === modId)).length;
  }

  getFileType(type: string) {
    if (!type) return 'other';
    const lower = type.toLowerCase();
    if (lower.includes('pdf')) return 'pdf';
    if (lower.includes('powerpoint') || lower.includes('ppt') || lower.includes('pptx')) return 'ppt';
    if (lower.includes('zip') || lower.includes('rar') || lower.includes('archive')) return 'zip';
    return 'other';
  }

  triggerUpload() {
    this.showUploadModal = true;
    this.uploadMode = 'file';
    if (this.selectedModule) {
      this.uploadForm.moduleId = this.selectedModule._id;
    }
  }

  closeUploadModal() {
    this.showUploadModal = false;
    this.resetUploadForm();
  }

  resetUploadForm() {
    this.uploadForm = {
      moduleId: this.selectedModule?._id || null,
      name: '',
      description: '',
      fileType: 'pdf',
      fileUrl: '',
      size: ''
    };
    this.selectedFile = null;
    this.uploadMode = 'file';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Check file size (50 MB max)
      if (file.size > 50 * 1024 * 1024) {
        alert('Le fichier est trop volumineux (max 50 MB)');
        return;
      }
      this.selectedFile = file;
      this.uploadForm.size = this.formatFileSize(file.size);
      if (!this.uploadForm.name) {
        this.uploadForm.name = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      }
    }
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.uploadForm.size = '';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  submitUpload() {
    // Validation based on mode
    if (!this.uploadForm.moduleId || !this.uploadForm.name) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.uploadMode === 'file' && !this.selectedFile) {
      alert('Veuillez sélectionner un fichier');
      return;
    }

    if (this.uploadMode === 'url' && !this.uploadForm.fileUrl) {
      alert('Veuillez saisir une URL');
      return;
    }

    this.uploading = true;
    const currentUser = this.authService.getCurrentUser();


    if (this.uploadMode === 'file' && this.selectedFile) {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('module', this.uploadForm.moduleId!);
      formData.append('name', this.uploadForm.name);
      formData.append('description', this.uploadForm.description);
      formData.append('fileType', this.uploadForm.fileType);
      formData.append('uploadedBy', currentUser?.id?.toString() || '');

      this.staffService.uploadMaterialWithFile(formData).subscribe({
        next: (response) => {
          console.log('Material uploaded:', response);
          this.allFiles.push(response);
          this.updateFilteredFiles();
          this.uploading = false;
          this.closeUploadModal();
          alert('Support ajouté avec succès !');
        },
        error: (err) => {
          console.error('Upload error:', err);
          this.uploading = false;
          alert('Erreur lors de l\'ajout du support');
        }
      });
    } else {
      // URL mode
      const materialData = {
        module: this.uploadForm.moduleId,
        name: this.uploadForm.name,
        description: this.uploadForm.description,
        fileType: this.uploadForm.fileType,
        fileUrl: this.uploadForm.fileUrl,
        size: this.uploadForm.size || 'N/A',
        uploadedBy: currentUser?.id
      };

      this.staffService.uploadMaterial(materialData).subscribe({
        next: (response) => {
          console.log('Material uploaded:', response);
          this.allFiles.push(response);
          this.updateFilteredFiles();
          this.uploading = false;
          this.closeUploadModal();
          alert('Support ajouté avec succès !');
        },
        error: (err) => {
          console.error('Upload error:', err);
          this.uploading = false;
          alert('Erreur lors de l\'ajout du support');
        }
      });
    }
  }
}
