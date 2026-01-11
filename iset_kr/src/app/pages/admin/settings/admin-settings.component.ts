import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-admin-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    template: `
    <div class="settings-container animate-on-scroll slide-up">
      <div class="mb-5">
        <h1 class="display-5 fw-black text-navy mb-2">Paramètres du <span class="text-gold">Compte</span></h1>
        <p class="text-secondary">Gérez vos informations personnelles et la sécurité de votre accès.</p>
      </div>

      <div class="row g-4">
        <!-- Configuration Profil -->
        <div class="col-md-6">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-header bg-white border-0 p-4 pb-0">
              <h4 class="fw-bold text-navy mb-0">Informations Personnelles</h4>
            </div>
            <div class="card-body p-4">
              <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()">
                <div class="mb-3">
                  <label class="form-label fw-bold text-navy small">Nom Complet</label>
                  <div class="input-group-pro">
                    <i class="fas fa-user"></i>
                    <input type="text" formControlName="name" class="form-control-pro" placeholder="Votre nom">
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold text-navy small">Email Académique</label>
                  <div class="input-group-pro">
                    <i class="fas fa-envelope"></i>
                    <input type="email" formControlName="email" class="form-control-pro" placeholder="exemple@isetk.rnu.tn">
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-bold text-navy small">Matricule</label>
                  <div class="input-group-pro">
                    <i class="fas fa-id-card"></i>
                    <input type="text" formControlName="matricule" class="form-control-pro" placeholder="Votre matricule">
                  </div>
                </div>

                <button type="submit" [disabled]="profileForm.invalid || isProfileLoading" class="btn-premium w-100">
                  <span *ngIf="!isProfileLoading">Enregistrer les modifications</span>
                  <span *ngIf="isProfileLoading"><i class="fas fa-spinner fa-spin me-2"></i> Mise à jour...</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- Changement Mot de Passe -->
        <div class="col-md-6">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-header bg-white border-0 p-4 pb-0">
              <h4 class="fw-bold text-navy mb-0">Sécurité & Mot de passe</h4>
            </div>
            <div class="card-body p-4">
              <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()">
                <div class="mb-3">
                  <label class="form-label fw-bold text-navy small">Ancien Mot de Passe</label>
                  <div class="input-group-pro">
                    <i class="fas fa-lock"></i>
                    <input type="password" formControlName="currentPassword" class="form-control-pro" placeholder="••••••••">
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold text-navy small">Nouveau Mot de Passe</label>
                  <div class="input-group-pro">
                    <i class="fas fa-key"></i>
                    <input type="password" formControlName="newPassword" class="form-control-pro" placeholder="Minimum 6 caractères">
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-bold text-navy small">Confirmer le Nouveau</label>
                  <div class="input-group-pro">
                    <i class="fas fa-check-double"></i>
                    <input type="password" formControlName="confirmPassword" class="form-control-pro" placeholder="Répétez le mot de passe">
                  </div>
                </div>

                <button type="submit" [disabled]="passwordForm.invalid || isPasswordLoading" class="btn-premium-alt w-100">
                  <span *ngIf="!isPasswordLoading">Modifier le mot de passe</span>
                  <span *ngIf="isPasswordLoading"><i class="fas fa-spinner fa-spin me-2"></i> Modification...</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Alerte de succès/erreur -->
      <div *ngIf="message" class="mt-4 p-3 rounded-3 text-center animate-on-scroll" 
           [ngClass]="messageType === 'success' ? 'bg-success-subtle text-success border border-success' : 'bg-danger-subtle text-danger border border-danger'">
        <i class="fas" [ngClass]="messageType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'"></i>
        {{ message }}
      </div>
    </div>
  `,
    styles: [`
    .settings-container {
      padding: 1rem;
    }

    .input-group-pro {
      position: relative;
      display: flex;
      align-items: center;

      i {
        position: absolute;
        left: 1rem;
        color: #94a3b8;
        font-size: 0.9rem;
      }

      .form-control-pro {
        width: 100%;
        padding: 0.8rem 1rem 0.8rem 2.8rem;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        font-size: 0.95rem;
        color: #1e293b;
        transition: all 0.2s;

        &:focus {
          outline: none;
          background: white;
          border-color: #0055a4;
          box-shadow: 0 0 0 4px rgba(0, 85, 164, 0.05);
        }
      }
    }

    .btn-premium {
      background: #0055a4;
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 12px;
      font-weight: 700;
      transition: all 0.2s;
      
      &:hover:not(:disabled) {
        background: #003d7a;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 85, 164, 0.2);
      }

      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }

    .btn-premium-alt {
      background: #c5a021;
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 12px;
      font-weight: 700;
      transition: all 0.2s;
      
      &:hover:not(:disabled) {
        background: #a3841a;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(197, 160, 33, 0.2);
      }

      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }

    .bg-success-subtle { background: #ecfdf5; }
    .bg-danger-subtle { background: #fef2f2; }
  `]
})
export class AdminSettingsComponent implements OnInit {
    profileForm: FormGroup;
    passwordForm: FormGroup;
    currentUser: any;

    isProfileLoading = false;
    isPasswordLoading = false;
    message = '';
    messageType: 'success' | 'error' = 'success';

    constructor(private fb: FormBuilder, private authService: AuthService) {
        this.profileForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            matricule: ['', Validators.required]
        });

        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit(): void {
        this.authService.currentUser.subscribe(user => {
            if (user) {
                this.currentUser = user;
                this.profileForm.patchValue({
                    name: user.name,
                    email: user.email,
                    matricule: user.matricule
                });
            }
        });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('newPassword')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    onUpdateProfile() {
        if (this.profileForm.invalid) return;
        this.isProfileLoading = true;
        this.message = '';

        this.authService.updateProfile(this.currentUser.id, this.profileForm.value).subscribe({
            next: (res) => {
                this.isProfileLoading = false;
                this.message = 'Profil mis à jour avec succès !';
                this.messageType = 'success';
                setTimeout(() => this.message = '', 3000);
            },
            error: (err) => {
                this.isProfileLoading = false;
                this.message = 'Erreur lors de la mise à jour : ' + (err.error?.message || 'Serveur indisponible');
                this.messageType = 'error';
            }
        });
    }

    onChangePassword() {
        if (this.passwordForm.invalid) return;
        this.isPasswordLoading = true;
        this.message = '';

        this.authService.changePassword(this.currentUser.id, this.passwordForm.value).subscribe({
            next: (res) => {
                this.isPasswordLoading = false;
                this.message = 'Mot de passe modifié avec succès !';
                this.messageType = 'success';
                this.passwordForm.reset();
                setTimeout(() => this.message = '', 3000);
            },
            error: (err) => {
                this.isPasswordLoading = false;
                this.message = 'Erreur : ' + (err.error?.message || 'Mot de passe actuel incorrect');
                this.messageType = 'error';
            }
        });
    }
}
