import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AdminService } from '../../../services/admin.service';
import { Department } from '../../../models/department.model';
import { Class } from '../../../models/class.model';

@Component({
  selector: 'app-admin-structure',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="structure-management animate-on-scroll">
      <div class="welcome-header-modern mb-5">
        <div class="header-text-group">
          <div class="title-with-icon">
            <i class="fas fa-sitemap icon-gradient"></i>
            <h3>Architecture de l'ISET</h3>
          </div>
          <p>Supervision et organisation des entités académiques, classes et ressources pédagogiques.</p>
        </div>
        <div class="header-stats-badges">
          <div class="stat-badge-mini shadow-sm">
            <span class="label">Départements</span>
            <span class="value">{{ departments.length }}</span>
          </div>
          <div class="stat-badge-mini shadow-sm">
            <span class="label">Classes</span>
            <span class="value">{{ classes.length }}</span>
          </div>
        </div>
      </div>

      <div class="structure-grid-pro">
        <!-- Départements Card -->
        <div class="smart-card-premium">
          <div class="card-header-pro">
            <div class="icon-circle navy"><i class="fas fa-university"></i></div>
            <div class="header-content">
              <h4>DÉPARTEMENTS</h4>
              <p>Unités structurelles</p>
            </div>
          </div>
          <div class="card-body-pro">
            <div class="list-container-pro custom-scrollbar" [class.loading]="loading.departments">
              <div *ngIf="loading.departments" class="loading-state-mini">
                <div class="spinner-mini"></div>
              </div>
              
              <div *ngIf="!loading.departments && departments.length === 0" class="empty-state-mini">
                <i class="fas fa-folder-open"></i>
                <span>Aucun département</span>
              </div>
              
              <div class="list-item-pro" *ngFor="let d of departments; index as i; trackBy: trackById" [style.animation-delay]="i * 0.05 + 's'">
                <div class="item-name-group">
                  <span class="dept-code">{{ d.code || 'DEPT' }}</span>
                  <div class="d-flex flex-column">
                    <span class="name">{{ d.name }}</span>
                    <span class="small text-muted" *ngIf="d.headOfDepartment">
                      <i class="fas fa-user-tie me-1"></i> 
                      {{ d.headOfDepartment?.name || 'Chef assigné' }}
                    </span>
                  </div>
                </div>
                <div class="actions-group" *ngIf="editingDeptId !== d._id">
                   <button class="btn-edit-pro" (click)="startEdit(d)" title="Modifier">
                     <i class="fas fa-edit"></i>
                   </button>
                   <button class="btn-delete-pro" (click)="deleteDepartment(d._id)" [disabled]="loading.delete" title="Supprimer">
                     <i class="fas fa-trash-alt"></i>
                   </button>
                </div>
                
                <!-- Edit Mode -->
                <div class="edit-mode-group" *ngIf="editingDeptId === d._id">
                   <input type="text" [(ngModel)]="editDeptName" class="form-control-sm mb-2" placeholder="Nom">
                   <select [(ngModel)]="editDeptHead" class="form-select-sm mb-2">
                      <option [ngValue]="null">-- Sélectionner Chef --</option>
                      <option *ngFor="let u of potentialHeads" [ngValue]="u._id">{{ u.name }}</option>
                   </select>
                   <div class="d-flex gap-2">
                      <button class="btn-save-sm" (click)="saveDept(d._id)">OK</button>
                      <button class="btn-cancel-sm" (click)="cancelEdit()">X</button>
                   </div>
                </div>
              </div>
            </div>
            <div class="add-section-pro">
              <div class="input-wrapper">
                <i class="fas fa-plus"></i>
                <input type="text" placeholder="Ajouter un département..." [(ngModel)]="newDeptName" (keyup.enter)="addDepartment()">
              </div>
              <button class="btn-submit-pro" (click)="addDepartment()" [disabled]="!newDeptName.trim() || loading.addDept">
                <span *ngIf="!loading.addDept">AJOUTER</span>
                <i *ngIf="loading.addDept" class="fas fa-circle-notch fa-spin"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Classes Card -->
        <div class="smart-card-premium">
          <div class="card-header-pro">
            <div class="icon-circle blue"><i class="fas fa-users-class"></i></div>
            <div class="header-content">
              <h4>CLASSES & GROUPES</h4>
              <p>Flux & Inscriptions</p>
            </div>
          </div>
          <div class="card-body-pro">
            <div class="list-container-pro custom-scrollbar" [class.loading]="loading.classes">
              <div *ngIf="loading.classes" class="loading-state-mini">
                <div class="spinner-mini"></div>
              </div>
              
              <div *ngIf="!loading.classes && classes.length === 0" class="empty-state-mini">
                <i class="fas fa-user-slash"></i>
                <span>Aucune classe</span>
              </div>
              
              <div class="list-item-pro" *ngFor="let c of classes; index as i; trackBy: trackById" [style.animation-delay]="i * 0.05 + 's'">
                <div class="item-name-group">
                  <span class="badge-dept">{{ (c.department?.name || 'GEN').substring(0,3) }}</span>
                  <span class="name">{{ c.name }}</span>
                </div>
                <button class="btn-delete-pro" (click)="deleteClass(c._id)" [disabled]="loading.delete" title="Supprimer">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
            <div class="add-section-pro vertical">
              <div class="input-wrapper">
                <i class="fas fa-users"></i>
                <input type="text" placeholder="Nom de la classe..." [(ngModel)]="newClassName" [disabled]="departments.length === 0">
              </div>
              <div class="input-wrapper">
                <i class="fas fa-building"></i>
                <select [(ngModel)]="newClassDept" [disabled]="departments.length === 0">
                  <option value="" disabled selected>Département...</option>
                  <option *ngFor="let d of departments" [value]="d._id">{{ d.name }}</option>
                </select>
              </div>
              <button class="btn-submit-pro" (click)="addClass()" [disabled]="!newClassName.trim() || !newClassDept || loading.addClass">
                <span *ngIf="!loading.addClass">CRÉER LA CLASSE</span>
                <i *ngIf="loading.addClass" class="fas fa-circle-notch fa-spin"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Subjects Card -->
        <div class="smart-card-premium">
          <div class="card-header-pro">
            <div class="icon-circle purple"><i class="fas fa-book"></i></div>
            <div class="header-content">
              <h4>MATIÈRES & MODULES</h4>
              <p>Catalogue de formation</p>
            </div>
          </div>
          <div class="card-body-pro">
            <div class="list-container-pro custom-scrollbar">
              <div *ngIf="subjects.length === 0" class="empty-state-mini">
                <i class="fas fa-book-open"></i>
                <span>Catalogue vide</span>
              </div>
              <div class="list-item-pro" *ngFor="let subject of subjects; index as i; trackBy: trackById" [style.animation-delay]="i * 0.05 + 's'">
                <div class="item-name-group">
                  <span class="badge-code">{{ subject.code || 'MOD' }}</span>
                  <span class="name text-truncate" style="max-width: 200px;">{{ subject.name }}</span>
                </div>
                <button class="btn-delete-pro" (click)="deleteSubject(subject._id)" title="Supprimer">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
            <div class="add-section-pro">
              <div class="input-wrapper">
                <i class="fas fa-plus"></i>
                <input type="text" placeholder="Nouvelle matière..." [(ngModel)]="newSubject.name" (keyup.enter)="addSubject()">
              </div>
              <button class="btn-submit-pro purple" (click)="addSubject()" [disabled]="!newSubject.name.trim()">
                <span>AJOUTER</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .structure-management {
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* HEADER STYLES */
    .welcome-header-modern {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 2rem;
    }

    .title-with-icon {
      display: flex;
      align-items: center;
      gap: 1.2rem;
      margin-bottom: 0.5rem;
    }

    .icon-gradient {
      font-size: 2.2rem;
      background: linear-gradient(135deg, #0055a4, #c5a021);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .title-with-icon h3 {
      font-size: 2rem;
      font-weight: 900;
      color: #0f172a;
      margin: 0;
      letter-spacing: -1px;
    }

    .header-text-group p {
      color: #64748b;
      font-size: 1.1rem;
      margin: 0;
      font-weight: 500;
    }

    .header-stats-badges {
      display: flex;
      gap: 1.5rem;
    }

    .stat-badge-mini {
      background: white;
      padding: 0.8rem 1.5rem;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 120px;
      border: 1px solid #f1f5f9;

      .label {
        font-size: 0.75rem;
        font-weight: 800;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .value {
        font-size: 1.4rem;
        font-weight: 900;
        color: #0055a4;
      }
    }

    /* GRID PRO */
    .structure-grid-pro {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 2.5rem;
    }

    /* PREMIUM CARD */
    .smart-card-premium {
      background: white;
      border-radius: 30px;
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.03);
      border: 1px solid #f1f5f9;
      display: flex;
      flex-direction: column;
      height: 580px; /* Fixed height to force scrollbars */
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 25px 50px rgba(0,0,0,0.08);
      }
    }

    .card-header-pro {
      display: flex;
      align-items: center;
      gap: 1.2rem;
      margin-bottom: 2rem;

      .icon-circle {
        width: 52px;
        height: 52px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
        color: white;
        box-shadow: 0 8px 15px rgba(0,0,0,0.1);

        &.navy { background: linear-gradient(135deg, #0f172a, #334155); }
        &.blue { background: linear-gradient(135deg, #0055a4, #3b82f6); }
        &.purple { background: linear-gradient(135deg, #7c3aed, #a855f7); }
      }

      .header-content h4 {
        font-size: 1.1rem;
        font-weight: 800;
        color: #0f172a;
        margin: 0;
        letter-spacing: 0.5px;
      }
      .header-content p {
        font-size: 0.85rem;
        color: #94a3b8;
        margin: 0;
        font-weight: 600;
      }
    }

    .card-body-pro {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0; /* Critical for inner scrolling */
    }

    /* LIST PRO */
    .list-container-pro {
      flex: 1;
      overflow-y: auto;
      margin-bottom: 1.5rem;
      padding-right: 0.8rem;

      .list-item-pro {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.2rem;
        background: #f8fafc;
        border-radius: 14px;
        margin-bottom: 0.8rem;
        border: 1px solid transparent;
        transition: all 0.3s;
        animation: fadeInRow 0.5s ease both;

        &:hover {
          background: white;
          border-color: #0055a4;
          transform: translateX(8px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.04);
        }

        .item-name-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          .name { font-weight: 700; color: #0f172a; }
        }

        .dept-code, .badge-dept, .badge-code {
          font-size: 0.65rem;
          font-weight: 900;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          text-transform: uppercase;
          background: rgba(0, 85, 164, 0.1);
          color: #0055a4;
        }

        .btn-delete-pro {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          &:hover { color: #ef4444; transform: scale(1.2); }
        }
      }
    }

    @keyframes fadeInRow {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }

    /* ADD SECTION PRO */
    .add-section-pro {
      display: flex;
      gap: 0.8rem;
      &.vertical { flex-direction: column; }

      .input-wrapper {
        position: relative;
        flex: 1;
        i { position: absolute; left: 1.2rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.9rem; }
        input, select {
          width: 100%;
          padding: 0.9rem 1rem 0.9rem 2.8rem;
          border: 2px solid #f1f5f9;
          border-radius: 14px;
          background: #f8fafc;
          font-weight: 600;
          color: #0f172a;
          transition: all 0.3s;
          appearance: none;
          &:focus { outline: none; border-color: #0055a4; background: white; box-shadow: 0 0 0 4px rgba(0, 85, 164, 0.05); }
        }
      }

      .btn-submit-pro {
        background: #0f172a;
        color: white;
        border: none;
        padding: 0.9rem 1.5rem;
        border-radius: 14px;
        font-weight: 800;
        font-size: 0.8rem;
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 4px 15px rgba(15, 23, 42, 0.1);

        &.purple { background: #7c3aed; &:hover { background: #6d28d9; } }
        &:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(15, 23, 42, 0.2); filter: brightness(1.1); }
        &:disabled { opacity: 0.5; cursor: not-allowed; }
      }
    }

    .loading-state-mini, .empty-state-mini {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      color: #94a3b8;
      gap: 1rem;
      i { font-size: 2.5rem; opacity: 0.5; }
    }

    .spinner-mini {
      width: 24px;
      height: 24px;
      border: 3px solid #f1f5f9;
      border-top-color: #0055a4;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { 
      background: #e2e8f0; 
      border-radius: 10px;
      transition: all 0.2s;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #cbd5e1;
    }
    .btn-edit-pro {
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 1rem;
      cursor: pointer;
      margin-right: 0.5rem;
      transition: all 0.2s;
      &:hover { color: #f59e0b; transform: scale(1.2); }
    }
    
    .edit-mode-group {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-left: 1rem;
      
      input, select {
         border: 1px solid #e2e8f0;
         border-radius: 6px;
         padding: 4px 8px;
         width: 100%;
      }
      
      .btn-save-sm { background: #10b981; color: white; border: none; border-radius: 4px; padding: 2px 8px; font-size: 0.7rem; cursor: pointer; }
      .btn-cancel-sm { background: #ef4444; color: white; border: none; border-radius: 4px; padding: 2px 8px; font-size: 0.7rem; cursor: pointer; }
    }
  `]
})
export class AdminStructureComponent implements OnInit, OnDestroy {
  departments: Department[] = [];
  classes: Class[] = [];
  potentialHeads: any[] = [];

  editingDeptId: string | null = null;
  editDeptName = '';
  editDeptHead: string | null = null;

  newDeptName = '';
  newClassName = '';
  newClassDept = '';

  subjects: any[] = [];
  newSubject = { name: '', code: '' };

  totalModules = 342;
  completionPercentage = 85;
  modulesByDept = {
    dep1: 150,
    dep2: 120
  };

  loading = {
    departments: false,
    classes: false,
    addDept: false,
    addClass: false,
    delete: false
  };

  private subscriptions: Subscription = new Subscription();

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadData() {
    this.loading.departments = true;
    this.loading.classes = true;
    this.cdr.markForCheck();

    const loadSub = forkJoin({
      departments: this.adminService.getDepartments(),
      classes: this.adminService.getClasses(),
      subjects: this.adminService.getSubjects(),
      users: this.adminService.getUsers()
    }).pipe(
      finalize(() => {
        this.loading.departments = false;
        this.loading.classes = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: ({ departments, classes, subjects, users }) => {
        this.departments = departments;
        this.classes = classes;
        this.subjects = subjects;
        // Filter users for potential heads (staff, admin, chef)
        this.potentialHeads = users.filter(u => ['staff', 'admin', 'chef'].includes(u.role));
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
      }
    });

    this.subscriptions.add(loadSub);
  }

  addDepartment() {
    if (!this.newDeptName.trim()) return;

    this.loading.addDept = true;

    const newDept = {
      name: this.newDeptName.trim(),
      code: this.generateDeptCode(this.newDeptName)
    };

    const addSub = this.adminService.createDepartment(newDept).pipe(
      finalize(() => {
        this.loading.addDept = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        this.newDeptName = '';
        this.loadData();
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du département:', error);
      }
    });

    this.subscriptions.add(addSub);
  }

  deleteDepartment(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) {
      return;
    }

    this.loading.delete = true;

    const deleteSub = this.adminService.deleteDepartment(id).pipe(
      finalize(() => {
        this.loading.delete = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        this.loadData();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
      }
    });

    this.subscriptions.add(deleteSub);
    this.subscriptions.add(deleteSub);
  }

  startEdit(dept: Department) {
    this.editingDeptId = dept._id!;
    this.editDeptName = dept.name;
    // Assuming headOfDepartment is populated object or ID. If populated, take _id.
    const head: any = dept.headOfDepartment;
    this.editDeptHead = head ? (head._id || head) : null;
  }

  cancelEdit() {
    this.editingDeptId = null;
    this.editDeptName = '';
    this.editDeptHead = null;
  }

  saveDept(id: string) {
    if (!this.editDeptName.trim()) return;

    this.adminService.updateDepartment(id, {
      name: this.editDeptName,
      headOfDepartment: this.editDeptHead
    }).subscribe({
      next: () => {
        this.loadData(); // Refresh to show updated info
        this.cancelEdit();
      },
      error: (err) => console.error('Error updating dept', err)
    });
  }

  addClass() {
    if (!this.newClassName.trim() || !this.newClassDept) return;

    this.loading.addClass = true;

    // Tentative d'extraction du niveau et de la section depuis le nom (ex: "DSI21" -> Section: DSI, Niveau: 2)
    const name = this.newClassName.trim().toUpperCase();
    let level = 1;
    let section = 'General';

    // Regex pour détecter un chiffre (ex: DSI2...)
    const levelMatch = name.match(/\d/);
    if (levelMatch) {
      level = parseInt(levelMatch[0], 10);
      const splitIndex = name.indexOf(levelMatch[0]);
      if (splitIndex > 0) {
        section = name.substring(0, splitIndex).replace(/[^A-Z]/g, ''); // Garde seulement les lettres
      }
    } else {
      // Pas de chiffre, extraction basique
      section = name.substring(0, 3);
    }

    // Si section est vide après extraction
    if (!section) section = 'GEN';

    const newClass = {
      name: this.newClassName.trim(),
      department: this.newClassDept,
      level: level,
      section: section
    };

    const addSub = this.adminService.createClass(newClass).pipe(
      finalize(() => {
        this.loading.addClass = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        this.newClassName = '';
        this.loadData();
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de la classe:', error);
        alert('Erreur: impossible d\'ajouter la classe. Vérifiez qu\'elle n\'existe pas déjà.');
      }
    });

    this.subscriptions.add(addSub);
  }

  deleteClass(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      return;
    }

    this.loading.delete = true;

    const deleteSub = this.adminService.deleteClass(id).pipe(
      finalize(() => {
        this.loading.delete = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        this.loadData();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
      }
    });

    this.subscriptions.add(deleteSub);
  }

  private generateDeptCode(name: string): string {
    // Génère un code de département à partir du nom
    const words = name.toUpperCase().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 4);
    }
    return words.map(w => w[0]).join('').substring(0, 4);
  }

  addSubject() {
    if (!this.newSubject.name.trim()) {
      alert('Veuillez entrer un nom de matière.');
      return;
    }

    this.newSubject.code = this.newSubject.name
      .split(' ')
      .map(word => word.substring(0, 3).toUpperCase())
      .join('_');

    this.adminService.createSubject(this.newSubject).subscribe({
      next: () => {
        this.loadData();
        this.newSubject = { name: '', code: '' };
      },
      error: (error) => {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'ajout.');
      }
    });
  }

  deleteSubject(id: string) {
    if (!confirm('Supprimer cette matière ?')) return;
    this.adminService.deleteSubject(id).subscribe(() => this.loadData());
  }

  trackById(index: number, item: any): string {
    return item._id || index;
  }
}
