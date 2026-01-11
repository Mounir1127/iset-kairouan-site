import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable, of, tap } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UserRolePipe } from '../../../shared/pipes/user-role.pipe';
import { UserStatusPipe } from '../../../shared/pipes/user-status.pipe';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UserRolePipe, UserStatusPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="user-management-pro">
      <!-- HEADER ULTRA PRO -->
      <div class="welcome-header-modern">
        <div class="header-text-group">
          <div class="title-with-icon">
            <i class="fas fa-users-gear icon-gradient"></i>
            <h3>Annuaire des Utilisateurs</h3>
          </div>
          <p>Supervision et gestion centralisée des accès de la plateforme académique.</p>
        </div>
        
          <div class="header-actions-modern">
            <div class="search-box-ultra">
              <i class="fas fa-search"></i>
              <input type="text" [ngModel]="searchTerm$ | async" (ngModelChange)="onSearch($event)" 
                     placeholder="Rechercher par nom, email ou matricule...">
            </div>
            <button class="btn btn-premium-navy" (click)="addUser()" title="Ajouter un utilisateur">
              <i class="fas fa-user-plus"></i>
              <span>NOUVEAU</span>
            </button>
            <button class="btn btn-premium-gold" (click)="loadUsers()" title="Rafraîchir la liste" [disabled]="isLoading$ | async">
              <i class="fas fa-sync-alt" [class.refreshing]="isLoading$ | async"></i> 
              <span>{{ (isLoading$ | async) ? 'CHARGEMENT...' : 'RAFRAÎCHIR' }}</span>
            </button>
          </div>
      </div>

      <!-- TABLEAU PREMIUM -->
      <div class="main-card-glass shadow-premium">
        <div class="table-scroll-container">
          <table class="iset-modern-table">
            <thead>
              <tr>
                <th><i class="fas fa-user-circle"></i> Membre</th>
                <th><i class="fas fa-id-card"></i> Matricule</th>
                <th><i class="fas fa-shield-halved"></i> Accès</th>
                <th><i class="fas fa-signal"></i> État</th>
                <th><i class="fas fa-calendar-day"></i> Arrivée</th>
                <th class="text-right">Opérations</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of filteredUsers$ | async; let i = index; trackBy: trackByUserId" [style.animation-delay]="i * 0.05 + 's'" class="animate-row">
                <td>
                  <div class="user-profile-cell">
                    <div class="avatar-circle" [ngClass]="user.role">
                       {{ user.name?.charAt(0) || 'U' }}
                    </div>
                    <div class="user-meta">
                      <span class="full-name">{{ user.name }}</span>
                      <span class="user-email-text">{{ user.email }}</span>
                    </div>
                  </div>
                </td>
                <td><span class="matricule-tag">{{ user.matricule }}</span></td>
                <td>
                  <span class="role-badge-modern" [ngClass]="user.role">
                    {{ (user.role | userRole) | uppercase }}
                  </span>
                </td>
                <td>
                  <div class="status-chip-pro" [ngClass]="user.status">
                    <span class="dot-indicator"></span>
                    <span class="status-label">{{ user.status | userStatus }}</span>
                  </div>
                </td>
                <td class="date-pro-cell">
                  <span class="date-main">{{ user.createdAt | date:'dd MMM yyyy' }}</span>
                </td>
                <td class="text-right">
                  <div class="action-buttons-group">
                    <button class="action-btn-mini edit" title="Modifier l'utilisateur" (click)="editUser(user)">
                      <i class="fas fa-pen-to-square"></i>
                    </button>
                    <button class="action-btn-mini status" (click)="toggleStatus(user)" 
                            [title]="user.status === 'active' ? 'Désactiver' : 'Activer'" [disabled]="isActionInProgress(user._id)">
                      <i class="fas" [class]="user.status === 'active' ? 'fa-user-lock' : 'fa-user-shield'"></i>
                    </button>
                    <button class="action-btn-mini delete" (click)="deleteUser(user._id)" title="Supprimer définitivement" [disabled]="isActionInProgress(user._id)">
                      <i class="fas fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- EMPTY STATE UPGRADED -->
          <div class="empty-state-pro" *ngIf="!(isLoading$ | async) && (filteredUsers$ | async)?.length === 0">
            <div class="illustration-wrap">
              <i class="fas fa-users-slash"></i>
            </div>
            <h4>Aucun utilisateur trouvé</h4>
            <p>{{ (searchTerm$|async) ? 'Nous n\\'avons trouvé aucun résultat correspondant à "' + (searchTerm$|async) + '".' : 'Aucun utilisateur disponible pour le moment.' }}</p>
            <button *ngIf="searchTerm$|async" class="btn btn-outline-navy" (click)="onSearch('')">
              <i class="fas fa-rotate-left"></i> RÉINITIALISER
            </button>
            <button class="btn btn-premium-gold" (click)="loadUsers()" style="margin-left: 1rem;" [disabled]="isLoading$ | async">
              <i class="fas fa-sync-alt" [class.refreshing]="isLoading$ | async"></i> 
              {{ (isLoading$|async) ? 'CHARGEMENT...' : 'RAFRAÎCHIR' }}
            </button>
          </div>

          <!-- LOADING STATE -->
          <div class="loading-state-pro" *ngIf="(isLoading$ | async) && (filteredUsers$ | async)?.length === 0">
            <div class="spinner-container">
              <div class="spinner-premium"></div>
            </div>
            <h4>Chargement des utilisateurs...</h4>
            <p>Veuillez patienter pendant le chargement des données.</p>
          </div>
        </div>
      </div>

      <div class="modal-overlay" *ngIf="displayEditModal">
        <div class="modal-content glass-card">
          <div class="modal-header">
            <h3>{{ isEditMode ? 'Modifier' : 'Ajouter' }} un utilisateur</h3>
            <button class="close-btn" (click)="closeModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body custom-scrollbar">
            <div class="form-group" *ngIf="!isEditMode">
              <label>Mot de passe initial</label>
              <input type="password" [(ngModel)]="currentUser.password" placeholder="Min. 6 caractères">
            </div>
            <div class="form-group">
              <label>Nom complet</label>
              <input type="text" [(ngModel)]="currentUser.name">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="currentUser.email">
            </div>
            <div class="form-group">
              <label>Matricule</label>
              <input type="text" [(ngModel)]="currentUser.matricule">
            </div>
            <div class="form-row">
               <div class="form-group half">
                 <label>Rôle</label>
                 <select [(ngModel)]="currentUser.role">
                   <option value="student">Étudiant</option>
                   <option value="staff">Personnel</option>
                   <option value="admin">Admin</option>
                 </select>
               </div>
               <div class="form-group half">
                 <label>Statut</label>
                 <select [(ngModel)]="currentUser.status">
                   <option value="active">Actif</option>
                   <option value="inactive">Inactif</option>
                   <option value="pending">En attente</option>
                 </select>
               </div>
            </div>

            <!-- Role Specific Fields -->
            <div class="role-specific">
               <div class="form-row">
                  <div class="form-group half">
                    <label>CIN</label>
                    <input type="text" [(ngModel)]="currentUser.cin" placeholder="Numéro CIN">
                  </div>
                  <div class="form-group half">
                    <label>Téléphone</label>
                    <input type="text" [(ngModel)]="currentUser.phone" placeholder="Numéro de mobile">
                  </div>
               </div>

               <div class="form-row">
                  <div class="form-group half">
                    <label>Genre</label>
                    <select [(ngModel)]="currentUser.gender">
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                    </select>
                  </div>
                  <div class="form-group half">
                    <label>Date de naissance</label>
                    <input type="date" [(ngModel)]="currentUser.birthDate">
                  </div>
               </div>

               <div class="form-group" *ngIf="currentUser.role !== 'admin'">
                  <label>Département</label>
                  <select [(ngModel)]="currentUser.department">
                     <option value="" disabled>Sélectionnez un département</option>
                     <option *ngFor="let d of departments" [value]="d._id">{{ d.name }}</option>
                  </select>
               </div>

               <!-- Student Specific -->
               <div class="form-group" *ngIf="currentUser.role === 'student'">
                  <label>Classe</label>
                  <select [(ngModel)]="currentUser.classGroup">
                     <option value="" disabled>Sélectionnez une classe</option>
                     <option *ngFor="let c of classes" [value]="c._id">{{ c.name }}</option>
                  </select>
               </div>

               <!-- Staff Specific -->
               <div class="form-row" *ngIf="currentUser.role === 'staff' || currentUser.role === 'chef'">
                  <div class="form-group half">
                    <label>Grade</label>
                    <input type="text" [(ngModel)]="currentUser.grade" placeholder="ex: Maître Assistant">
                  </div>
                  <div class="form-group half">
                    <label>Spécialité</label>
                    <input type="text" [(ngModel)]="currentUser.speciality" placeholder="ex: Informatique">
                  </div>
               </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-navy" (click)="closeModal()">Annuler</button>
            <button class="btn btn-premium-gold" (click)="saveUser()">Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

    .user-management-pro {
      font-family: 'Outfit', sans-serif;
      animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn { 
      from { 
        opacity: 0; 
        transform: translateY(20px); 
      } 
      to { 
        opacity: 1; 
        transform: translateY(0); 
      } 
    }

    /* HEADER STYLES */
    .welcome-header-modern {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
      flex-wrap: wrap;
      gap: 2rem;
    }

    .title-with-icon {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .title-with-icon .icon-gradient {
      font-size: 2.5rem;
      background: linear-gradient(135deg, #0f172a, #0055a4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .title-with-icon h3 {
      font-size: 2.2rem;
      font-weight: 900;
      color: #0f172a;
      margin: 0;
      letter-spacing: -1px;
    }

    .header-text-group p {
      color: #64748b;
      font-size: 1.1rem;
      font-weight: 500;
      margin: 0;
    }

    .header-actions-modern {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .search-box-ultra {
      position: relative;
    }

    .search-box-ultra i {
      position: absolute;
      left: 1.2rem;
      top: 50%;
      transform: translateY(-50%);
      color: #0055a4;
      font-size: 1.1rem;
    }

    .search-box-ultra input {
      padding: 1rem 1.5rem 1rem 3.5rem;
      width: 400px;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      background: #ffffff;
      font-size: 0.95rem;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .search-box-ultra input::placeholder {
      color: #94a3b8;
      font-weight: 400;
    }

    .search-box-ultra input:focus {
      border-color: #0055a4;
      box-shadow: 0 0 0 6px rgba(0, 85, 164, 0.1);
      outline: none;
      width: 450px;
    }

    /* BUTTONS ULTRA PRO */
    .btn {
      padding: 1rem 2rem;
      border-radius: 16px;
      font-weight: 800;
      font-size: 0.9rem;
      letter-spacing: 1px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
      border: none;
      text-transform: uppercase;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }

    .btn i {
      font-size: 1.25rem;
    }

    .btn.btn-premium-gold {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
    }

    .btn.btn-premium-gold:hover:not(:disabled) {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 15px 35px rgba(245, 158, 11, 0.4);
      filter: brightness(1.1);
    }

    .btn.btn-premium-navy {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      box-shadow: 0 10px 25px rgba(15, 23, 42, 0.3);
    }

    .btn.btn-premium-navy:hover:not(:disabled) {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 15px 35px rgba(15, 23, 42, 0.4);
      filter: brightness(1.2);
    }

    .btn.btn-outline-navy {
      background: #ffffff;
      color: #0f172a;
      border: 2px solid #0f172a;
    }

    .btn.btn-outline-navy:hover:not(:disabled) {
      background: #0f172a;
      color: #ffffff;
    }

    .fa-sync-alt.refreshing {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* TABLE CARD GLASS */
    .main-card-glass {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.5);
      overflow: hidden;
      padding: 1rem;
    }

    .table-scroll-container {
      border-radius: 20px;
      overflow: hidden;
    }

    .iset-modern-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    .iset-modern-table thead th {
      padding: 1.8rem 2rem;
      background: #f8fafc;
      text-align: left;
      font-size: 0.8rem;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      border-bottom: 2px solid #f1f5f9;
    }

    .iset-modern-table thead th i {
      margin-right: 0.8rem;
      color: #0055a4;
      opacity: 0.7;
    }

    .iset-modern-table tbody td {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }

    .iset-modern-table .animate-row {
      animation: rowSlideIn 0.5s ease-out both;
    }

    .iset-modern-table .animate-row:hover td {
      background: rgba(0, 85, 164, 0.02);
    }

    @keyframes rowSlideIn {
      from {
        opacity: 0;
        transform: translateX(-15px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* USER CELL UPGRADE */
    .user-profile-cell {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .user-profile-cell .avatar-circle {
      width: 50px;
      height: 50px;
      border-radius: 14px;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 1.25rem;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .user-profile-cell .avatar-circle.admin {
      background: linear-gradient(135deg, #0f172a, #1e293b);
    }

    .user-profile-cell .avatar-circle.staff {
      background: linear-gradient(135deg, #0055a4, #0077c8);
    }

    .user-profile-cell .avatar-circle.student {
      background: linear-gradient(135deg, #475569, #94a3b8);
    }

    .user-profile-cell .user-meta .full-name {
      display: block;
      font-weight: 800;
      color: #0f172a;
      font-size: 1.05rem;
      margin-bottom: 0.1rem;
    }

    .user-profile-cell .user-meta .user-email-text {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 500;
    }

    .matricule-tag {
      background: #f1f5f9;
      padding: 0.5rem 1rem;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 900;
      color: #334155;
      font-family: 'Space Mono', monospace;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    /* BADGES PRO */
    .role-badge-modern {
      padding: 0.5rem 1.2rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 900;
      letter-spacing: 1px;
      display: inline-block;
    }

    .role-badge-modern.admin {
      background: #0f172a;
      color: #ffffff;
      box-shadow: 0 5px 15px rgba(15, 23, 42, 0.2);
    }

    .role-badge-modern.staff {
      background: rgba(0, 85, 164, 0.08);
      color: #0055a4;
    }

    .role-badge-modern.student {
      background: #f8fafc;
      color: #64748b;
      border: 1px solid #e2e8f0;
    }

    /* STATUS CHIP */
    .status-chip-pro {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1.2rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 800;
      transition: all 0.3s ease;
    }

    .status-chip-pro .dot-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .status-chip-pro.active {
      background: #ecfdf5;
      color: #065f46;
    }

    .status-chip-pro.active .dot-indicator {
      background: #10b981;
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
      animation: pulseGreen 2s infinite;
    }

    .status-chip-pro.inactive {
      background: #fff1f2;
      color: #9f1239;
    }

    .status-chip-pro.inactive .dot-indicator {
      background: #e11d48;
    }

    .status-chip-pro.pending {
      background: #fff7ed;
      color: #9a3412;
    }

    .status-chip-pro.pending .dot-indicator {
      background: #f97316;
    }

    @keyframes pulseGreen {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
      }
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
      }
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
      }
    }

    /* ACTIONS UPGRADE */
    .action-buttons-group {
      display: flex;
      gap: 0.8rem;
      justify-content: flex-end;
    }

    .action-buttons-group .action-btn-mini {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      background: #ffffff;
      color: #64748b;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }

    .action-buttons-group .action-btn-mini:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }

    .action-buttons-group .action-btn-mini:hover:not(:disabled) {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    }

    .action-buttons-group .action-btn-mini.edit:hover:not(:disabled) {
      background: #f0f7ff;
      color: #0055a4;
      border-color: #0055a4;
    }

    .action-buttons-group .action-btn-mini.status:hover:not(:disabled) {
      background: #fffdf0;
      color: #f59e0b;
      border-color: #f59e0b;
    }

    .action-buttons-group .action-btn-mini.delete:hover:not(:disabled) {
      background: #fff1f2;
      color: #e11d48;
      border-color: #e11d48;
    }

    /* EMPTY STATE PRO */
    .empty-state-pro {
      padding: 10rem 2rem;
      text-align: center;
    }

    .empty-state-pro .illustration-wrap {
      font-size: 6rem;
      color: #f1f5f9;
      margin-bottom: 2rem;
      background: radial-gradient(circle, #f8fafc 0%, transparent 70%);
      display: inline-block;
      padding: 2rem;
    }

    .empty-state-pro h4 {
      font-size: 1.8rem;
      font-weight: 900;
      color: #0f172a;
      margin: 0;
    }

    .empty-state-pro p {
      color: #64748b;
      font-size: 1.1rem;
      margin: 1rem 0 3rem;
    }

    /* LOADING STATE */
    .loading-state-pro {
      padding: 10rem 2rem;
      text-align: center;
    }

    .loading-state-pro .spinner-container {
      margin-bottom: 2rem;
    }

    .spinner-premium {
      width: 60px;
      height: 60px;
      border: 4px solid #f1f5f9;
      border-top: 4px solid #0055a4;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    .loading-state-pro h4 {
      font-size: 1.8rem;
      font-weight: 900;
      color: #0f172a;
      margin: 0 0 1rem 0;
    }

    .loading-state-pro p {
      color: #64748b;
      font-size: 1.1rem;
      margin: 0;
    }

    .text-right {
      text-align: right;
    }

    .date-pro-cell {
      font-weight: 600;
      color: #334155;
    }

    /* ANIMATION FOR STATUS CHANGE */
    @keyframes statusChange {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }

    .status-changing {
      animation: statusChange 0.5s ease;
    }

    /* MODAL STYLES */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    }

    .modal-content {
      width: 90%;
      max-width: 600px;
      background: white;
      border-radius: 24px;
      padding: 2rem;
      box-shadow: 0 25px 50px rgba(0,0,0,0.25);
      animation: slideUpModal 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    @keyframes slideUpModal {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      h3 { margin: 0; font-size: 1.5rem; color: #0f172a; font-weight: 800; }
      .close-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #64748b; }
    }

    .modal-body {
      overflow-y: auto;
      padding-right: 0.5rem;
      margin-bottom: 2rem;
    }

    .form-group { margin-bottom: 1.2rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 700; color: #334155; font-size: 0.9rem; }
    .form-group input, .form-group select {
       width: 100%;
       padding: 0.8rem 1rem;
       border-radius: 12px;
       border: 2px solid #e2e8f0;
       font-family: inherit;
       font-weight: 600;
       color: #0f172a;
       transition: all 0.2s;
       &:focus { border-color: #0055a4; outline: none; }
    }

    .form-row { display: flex; gap: 1rem; }
    .form-group.half { flex: 1; }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  private usersSubject = new BehaviorSubject<any[]>([]);
  private searchTermSubject = new BehaviorSubject<string>('');
  private isLoadingSubject = new BehaviorSubject<boolean>(true);

  users$ = this.usersSubject.asObservable();
  searchTerm$ = this.searchTermSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();

  filteredUsers$: Observable<any[]> = combineLatest([
    this.users$,
    this.searchTerm$
  ]).pipe(
    map(([users, term]) => {
      const lowerTerm = term.toLowerCase();
      return users.filter(u =>
        (u.name || '').toLowerCase().includes(lowerTerm) ||
        (u.email || '').toLowerCase().includes(lowerTerm) ||
        (u.matricule || '').toLowerCase().includes(lowerTerm)
      );
    })
  );

  actionInProgress: Set<string> = new Set();

  // Modal State
  displayEditModal = false;
  isEditMode = false;
  currentUser: any = {};
  departments: any[] = [];
  classes: any[] = [];

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadMetadata();
  }

  loadMetadata() {
    this.adminService.getDepartments().subscribe(d => this.departments = d);
    this.adminService.getClasses().subscribe(c => this.classes = c);
  }

  loadUsers() {
    this.isLoadingSubject.next(true);
    this.adminService.getUsers().pipe(
      finalize(() => {
        this.isLoadingSubject.next(false);
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (data) => {
        this.usersSubject.next(data || []);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        // En cas d'erreur, on laisse la liste vide pour ne pas tromper l'utilisateur
        this.usersSubject.next([]);
      }
    });
  }

  onSearch(term: string) {
    this.searchTermSubject.next(term);
  }

  isActionInProgress(userId: string): boolean {
    return this.actionInProgress.has(userId);
  }

  addUser() {
    this.isEditMode = false;
    this.currentUser = {
      role: 'student',
      status: 'active'
    };
    this.displayEditModal = true;
  }

  editUser(user: any) {
    this.isEditMode = true;
    this.currentUser = JSON.parse(JSON.stringify(user)); // Deep copy

    // Format date for HTML input type="date"
    if (this.currentUser.birthDate) {
      this.currentUser.birthDate = new Date(this.currentUser.birthDate).toISOString().split('T')[0];
    }

    this.displayEditModal = true;
  }

  closeModal() {
    this.displayEditModal = false;
    this.isEditMode = false;
    this.currentUser = {};
  }

  saveUser() {
    if (this.isEditMode && !this.currentUser._id) return;
    if (!this.isEditMode && (!this.currentUser.email || !this.currentUser.password)) {
      alert('Veuillez remplir les champs obligatoires (Email, Mot de passe)');
      return;
    }

    this.isLoadingSubject.next(true);

    const request = this.isEditMode
      ? this.adminService.updateUser(this.currentUser._id, this.currentUser)
      : this.adminService.createUser(this.currentUser);

    request.pipe(
      finalize(() => {
        this.isLoadingSubject.next(false);
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (user) => {
        const users = this.usersSubject.value;
        if (this.isEditMode) {
          const index = users.findIndex(u => u._id === user._id);
          if (index !== -1) {
            users[index] = user;
            this.usersSubject.next([...users]);
          }
        } else {
          this.usersSubject.next([user, ...users]);
        }
        this.closeModal();
      },
      error: (err) => {
        console.error('Error saving user', err);
        alert(err.error?.message || "Erreur lors de l'enregistrement");
      }
    });
  }

  toggleStatus(user: any) {
    if (this.isActionInProgress(user._id)) return;

    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const action = user.status === 'active' ? 'désactivation' : 'activation';

    if (confirm(`Êtes-vous sûr de vouloir ${action} l'utilisateur ${user.name} ?`)) {
      this.actionInProgress.add(user._id);

      // Mise à jour sur le serveur
      this.adminService.updateUser(user._id, { status: newStatus }).pipe(
        finalize(() => {
          this.actionInProgress.delete(user._id);
          this.cdr.markForCheck();
        })
      ).subscribe({
        next: (updatedUser) => {
          const users = this.usersSubject.value;
          const index = users.findIndex(u => u._id === user._id);
          if (index !== -1 && updatedUser) {
            users[index] = { ...users[index], ...updatedUser };
            this.usersSubject.next([...users]);
          }
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du statut:', error);
        }
      });
    }
  }

  deleteUser(userId: string) {
    if (this.isActionInProgress(userId)) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      this.actionInProgress.add(userId);

      // Suppression sur le serveur
      this.adminService.deleteUser(userId).pipe(
        finalize(() => {
          this.actionInProgress.delete(userId);
          this.cdr.markForCheck();
        })
      ).subscribe({
        next: () => {
          const users = this.usersSubject.value.filter(u => u._id !== userId);
          this.usersSubject.next(users);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  animateStatusChange(userId: string) {
    // Animation visuelle du changement de statut
    const statusElement = document.querySelector(`[data-user-id="${userId}"] .status-chip-pro`);
    if (statusElement) {
      statusElement.classList.add('status-changing');
      setTimeout(() => {
        statusElement.classList.remove('status-changing');
      }, 500);
    }
  }

  trackByUserId(index: number, user: any): string {
    return user._id || index;
  }
}
