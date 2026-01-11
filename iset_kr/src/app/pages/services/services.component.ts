import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Service, ServiceCardComponent } from '../../components/service-card/service-card.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ServiceCardComponent],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  // All services
  allServices: Service[] = [
    {
      id: 1,
      icon: 'fa-user-check',
      title: 'Inscription en Ligne',
      description: 'Procédure complète d\'inscription et de réinscription en ligne pour tous les étudiants.',
      action: 'openStudentSpace'
    },
    {
      id: 2,
      icon: 'fa-download',
      title: 'Espace Téléchargement',
      description: 'Accès aux documents administratifs, formulaires et ressources pédagogiques.',
      action: 'openStudentSpace'
    },
    {
      id: 3,
      icon: 'fa-book',
      title: 'Bibliothèque Numérique',
      description: 'Catalogue en ligne des ouvrages, revues scientifiques et ressources documentaires.',
      action: 'openStudentSpace'
    },
    {
      id: 4,
      icon: 'fa-newspaper',
      title: 'Plaquettes Pédagogiques',
      description: 'Téléchargement des programmes pédagogiques et guides des formations.',
      action: 'openStudentSpace'
    },
    {
      id: 5,
      icon: 'fa-calendar-alt',
      title: 'Emploi du Temps',
      description: 'Consultation et gestion des emplois du temps pour toutes les filières.',
      action: 'openStudentSpace'
    },
    {
      id: 6,
      icon: 'fa-chart-line',
      title: 'Résultats & Notes',
      description: 'Consultation des notes et résultats d\'examens en temps réel.',
      action: 'openStudentSpace'
    },
    {
      id: 7,
      icon: 'fa-file-contract',
      title: 'Demandes Administratives',
      description: 'Formulaires en ligne pour les attestations, relevés de notes et autres documents.',
      action: 'openStudentSpace'
    },
    {
      id: 8,
      icon: 'fa-comments',
      title: 'Messagerie Académique',
      description: 'Communication sécurisée entre étudiants, enseignants et administration.',
      action: 'openStudentSpace'
    },
    {
      id: 9,
      icon: 'fa-briefcase',
      title: 'Stages & Emplois',
      description: 'Plateforme de stages, offres d\'emploi et opportunités professionnelles.',
      action: 'openStudentSpace'
    },
    {
      id: 10,
      icon: 'fa-graduation-cap',
      title: 'Inscription aux Examens',
      description: 'Inscription en ligne aux examens et concours.',
      action: 'openStudentSpace'
    },
    {
      id: 11,
      icon: 'fa-money-check-alt',
      title: 'Paiement en Ligne',
      description: 'Système sécurisé de paiement des frais académiques en ligne.',
      action: 'openStudentSpace'
    },
    {
      id: 12,
      icon: 'fa-headset',
      title: 'Support Technique',
      description: 'Assistance technique et aide en ligne pour les problèmes d\'accès.',
      action: 'openStudentSpace'
    }
  ];

  // Categories
  categories = [
    { id: 'all', name: 'Tous les services', count: 12 },
    { id: 'academic', name: 'Services Académiques', count: 6 },
    { id: 'administrative', name: 'Services Administratifs', count: 4 },
    { id: 'financial', name: 'Services Financiers', count: 1 },
    { id: 'support', name: 'Support & Assistance', count: 1 }
  ];

  // Filtered services
  filteredServices: Service[] = [];

  // Selected category
  selectedCategory = 'all';

  // Search term
  searchTerm = '';

  // Page info
  pageInfo = {
    title: 'Services aux Étudiants',
    subtitle: 'Accédez à tous les services numériques de l\'ISET Kairouan',
    description: 'Notre plateforme numérique met à votre disposition un ensemble complet de services pour faciliter votre parcours académique et administratif.',
    image: 'assets/images/campus/services-bg.jpg'
  };

  constructor() { }

  ngOnInit(): void {
    this.filteredServices = [...this.allServices];
  }

  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allServices];

    // Filter by category
    if (this.selectedCategory !== 'all') {
      // Logic to filter by category
      filtered = filtered.filter(service => {
        // This is a simplified example - you would need to add category property to Service interface
        return true; // Replace with actual category filtering
      });
    }

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(this.searchTerm) ||
        service.description.toLowerCase().includes(this.searchTerm)
      );
    }

    this.filteredServices = filtered;
  }

  openStudentSpace(): void {
    window.open('https://isetkairouan.edx.tn/login.faces', '_blank', 'noopener,noreferrer');
  }

  getCategoryCount(categoryId: string): number {
    if (categoryId === 'all') return this.allServices.length;
    // Implement actual counting logic
    return 0;
  }

  trackByService(index: number, service: Service): number {
    return service.id;
  }

  trackByCategory(index: number, category: any): string {
    return category.id;
  }
}
