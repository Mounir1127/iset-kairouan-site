import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-admin-news',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.scss']
})
export class AdminNewsComponent implements OnInit {
  announcements: any[] = [];
  filteredAnnouncements: any[] = [];
  currentFilter: string = 'all';
  showModal = false;
  isEditing = false;
  currentItemId: string | null = null;
  announcementForm: FormGroup;
  stats = { total: 0, events: 0, tenders: 0, news: 0 };

  selectedType: 'event' | 'tender' | 'news' = 'news';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private dataService: DataService
  ) {
    this.announcementForm = this.initForm();
  }

  initForm() {
    return this.fb.group({
      type: ['news', Validators.required],
      title: ['', Validators.required],
      status: ['published', Validators.required],
      publishDate: [new Date().toISOString().split('T')[0], Validators.required],
      image: [''],

      // Manifestations
      description: [''],
      eventType: [''],
      startDate: [''],
      endDate: [''],
      time: [''],
      location: [''],
      targetAudience: [''],
      organizer: [''],

      // Tenders
      reference: [''],
      issuer: [''],
      deadline: [''],
      conditions: [''],
      contact: [''],

      // News
      summary: [''],
      content: [''],
      author: [''],
      category: ['']
    });
  }

  ngOnInit(): void {
    this.loadAnnouncements();

    // Watch for type changes
    this.announcementForm.get('type')?.valueChanges.subscribe(value => {
      this.selectedType = value;
    });
  }

  loadAnnouncements() {
    console.log('🔄 Chargement des annonces...');
    this.adminService.getAnnouncements().subscribe({
      next: (data) => {
        console.log('✅ Annonces reçues:', data);
        this.announcements = data;
        this.updateStats();
        this.applyFilter();
        console.log('📊 Annonces filtrées affichées:', this.filteredAnnouncements.length);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des annonces:', err);
        // Afficher quand même le tableau vide au lieu de ne rien afficher
        this.announcements = [];
        this.updateStats();
        this.applyFilter();
      }
    });
  }

  updateStats() {
    this.stats = {
      total: this.announcements.length,
      events: this.announcements.filter(a => a.type === 'event').length,
      tenders: this.announcements.filter(a => a.type === 'tender').length,
      news: this.announcements.filter(a => a.type === 'news').length
    };
  }

  applyFilter() {
    if (this.currentFilter === 'all') {
      this.filteredAnnouncements = this.announcements;
    } else {
      this.filteredAnnouncements = this.announcements.filter(a => a.type === this.currentFilter);
    }
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
    this.applyFilter();
  }

  openAddModal() {
    this.isEditing = false;
    this.currentItemId = null;
    this.announcementForm.reset({
      type: 'news',
      status: 'published',
      publishDate: new Date().toISOString().split('T')[0]
    });
    this.selectedType = 'news';
    this.showModal = true;
  }

  openEditModal(item: any) {
    this.isEditing = true;
    this.currentItemId = item._id;
    this.selectedType = item.type;

    this.announcementForm.patchValue({
      ...item,
      publishDate: item.publishDate ? new Date(item.publishDate).toISOString().split('T')[0] : '',
      startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '',
      endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '',
      deadline: item.deadline ? new Date(item.deadline).toISOString().split('T')[0] : ''
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.announcementForm.invalid) return;

    const data = this.announcementForm.value;
    this.closeModal(); // Close immediately

    if (this.isEditing && this.currentItemId) {
      this.adminService.updateAnnouncement(this.currentItemId, data).subscribe(() => {
        this.loadAnnouncements();
        this.dataService.notifyAnnouncementsChanged();
      });
    } else {
      this.adminService.createAnnouncement(data).subscribe(() => {
        this.loadAnnouncements();
        this.dataService.notifyAnnouncementsChanged();
      });
    }
  }

  deleteItem(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cet élément ?')) {
      this.adminService.deleteAnnouncement(id).subscribe(() => {
        this.loadAnnouncements();
        this.dataService.notifyAnnouncementsChanged(); // Notify changes
      });
    }
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      draft: 'Brouillon',
      published: 'Publié',
      archived: 'Archivé',
      cancelled: 'Annulé'
    };
    return labels[status] || status;
  }
}
