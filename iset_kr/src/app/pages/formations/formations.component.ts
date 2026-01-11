import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Formation {
  id: number;
  title: string;
  department: string;
  level: 'Licence' | 'Master' | 'Ingénieur';
  duration: string;
  description: string;
  courses: string[];
  career: string[];
  requirements: string[];
  icon: string;
  color: string;
}

@Component({
  selector: 'app-formations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.scss']
})
export class FormationsComponent implements OnInit {
  formations: Formation[] = [
    {
      id: 1,
      title: 'Génie Informatique',
      department: 'Informatique',
      level: 'Ingénieur',
      duration: '3 ans',
      description: 'Formation d\'ingénieurs en informatique spécialisés dans le développement logiciel, les bases de données et les systèmes d\'information.',
      courses: ['Algorithmique', 'Base de données', 'Réseaux', 'Développement Web', 'Intelligence Artificielle'],
      career: ['Développeur Full-Stack', 'Administrateur Base de données', 'Chef de projet IT', 'Architecte logiciel'],
      requirements: ['Baccalauréat Scientifique', 'Concours national d\'entrée'],
      icon: 'fa-laptop-code',
      color: '#0055a4'
    },
    {
      id: 2,
      title: 'Réseaux & Télécoms',
      department: 'Télécommunications',
      level: 'Ingénieur',
      duration: '3 ans',
      description: 'Formation d\'ingénieurs en réseaux et télécommunications avec expertise en sécurité réseau et communications mobiles.',
      courses: ['Réseaux locaux', 'Télécommunications', 'Sécurité réseau', '5G & IoT', 'Administration systèmes'],
      career: ['Ingénieur réseaux', 'Administrateur sécurité', 'Consultant télécoms', 'Ingénieur systèmes'],
      requirements: ['Baccalauréat Scientifique', 'Concours national d\'entrée'],
      icon: 'fa-satellite-dish',
      color: '#0077c8'
    },
    {
      id: 3,
      title: 'Génie Électrique',
      department: 'Électrique',
      level: 'Ingénieur',
      duration: '3 ans',
      description: 'Formation d\'ingénieurs en génie électrique spécialisés en automatisme, énergies renouvelables et électrotechnique.',
      courses: ['Automatisme industriel', 'Énergies renouvelables', 'Électrotechnique', 'Électronique de puissance', 'Contrôle-commande'],
      career: ['Ingénieur automatisme', 'Chef projet énergies renouvelables', 'Ingénieur maintenance', 'Consultant électrique'],
      requirements: ['Baccalauréat Scientifique', 'Concours national d\'entrée'],
      icon: 'fa-bolt',
      color: '#f57c00'
    },
    {
      id: 4,
      title: 'Licence en Informatique',
      department: 'Informatique',
      level: 'Licence',
      duration: '3 ans',
      description: 'Formation fondamentale en informatique préparant aux métiers du développement et de l\'administration des systèmes.',
      courses: ['Programmation', 'Systèmes d\'exploitation', 'Bases de données', 'Réseaux informatiques', 'Génie logiciel'],
      career: ['Développeur', 'Technicien réseaux', 'Administrateur systèmes', 'Webmaster'],
      requirements: ['Baccalauréat', 'Sélection sur dossier'],
      icon: 'fa-code',
      color: '#2e7d32'
    },
    {
      id: 5,
      title: 'Master en Cybersécurité',
      department: 'Informatique',
      level: 'Master',
      duration: '2 ans',
      description: 'Formation spécialisée en sécurité des systèmes d\'information et protection des données.',
      courses: ['Cryptographie', 'Sécurité réseau', 'Forensique numérique', 'Droit du numérique', 'Audit sécurité'],
      career: ['Analyste sécurité', 'Consultant cybersécurité', 'Auditeur sécurité', 'Responsable SSI'],
      requirements: ['Licence en informatique', 'Entretien de sélection'],
      icon: 'fa-shield-alt',
      color: '#d32f2f'
    },
    {
      id: 6,
      title: 'Technicien Supérieur',
      department: 'Maintenance industrielle',
      level: 'Licence',
      duration: '2 ans',
      description: 'Formation de techniciens supérieurs spécialisés en maintenance industrielle et gestion de production.',
      courses: ['Maintenance préventive', 'Gestion de production', 'Automatisme', 'Mécanique', 'Qualité'],
      career: ['Technicien maintenance', 'Responsable atelier', 'Technicien méthodes', 'Agent de maîtrise'],
      requirements: ['Baccalauréat technique', 'Sélection sur dossier'],
      icon: 'fa-tools',
      color: '#9c27b0'
    }
  ];

  departments = [
    { id: 'all', name: 'Toutes les formations', count: 6 },
    { id: 'informatique', name: 'Informatique', count: 3 },
    { id: 'telecom', name: 'Télécommunications', count: 1 },
    { id: 'electrique', name: 'Génie Électrique', count: 1 },
    { id: 'maintenance', name: 'Maintenance', count: 1 }
  ];

  levels = [
    { id: 'all', name: 'Tous les niveaux' },
    { id: 'licence', name: 'Licence' },
    { id: 'master', name: 'Master' },
    { id: 'ingenieur', name: 'Ingénieur' }
  ];

  filteredFormations: Formation[] = [];
  selectedDepartment = 'all';
  selectedLevel = 'all';
  searchTerm = '';

  pageInfo = {
    title: 'Nos Formations',
    subtitle: 'Découvrez notre offre de formations d\'excellence',
    description: 'L\'ISET Kairouan propose des formations diplômantes dans les domaines technologiques, alliant théorie et pratique pour préparer les étudiants aux défis du marché du travail.',
    image: 'assets/images/campus/formations-bg.jpg'
  };

  constructor() { }

  ngOnInit(): void {
    this.filteredFormations = [...this.formations];
  }

  filterByDepartment(departmentId: string): void {
    this.selectedDepartment = departmentId;
    this.applyFilters();
  }

  filterByLevel(levelId: string): void {
    this.selectedLevel = levelId;
    this.applyFilters();
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.formations];

    // Filter by department
    if (this.selectedDepartment !== 'all') {
      filtered = filtered.filter(formation =>
        formation.department.toLowerCase() === this.selectedDepartment
      );
    }

    // Filter by level
    if (this.selectedLevel !== 'all') {
      filtered = filtered.filter(formation =>
        formation.level.toLowerCase() === this.selectedLevel
      );
    }

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(formation =>
        formation.title.toLowerCase().includes(this.searchTerm) ||
        formation.description.toLowerCase().includes(this.searchTerm) ||
        formation.department.toLowerCase().includes(this.searchTerm)
      );
    }

    this.filteredFormations = filtered;
  }

  getLevelClass(level: string): string {
    const classes: { [key: string]: string } = {
      'Licence': 'level-licence',
      'Master': 'level-master',
      'Ingénieur': 'level-ingenieur'
    };
    return classes[level] || '';
  }

  getDepartmentColor(department: string): string {
    const colors: { [key: string]: string } = {
      'Informatique': '#0055a4',
      'Télécommunications': '#0077c8',
      'Électrique': '#f57c00',
      'Maintenance industrielle': '#9c27b0'
    };
    return colors[department] || '#666';
  }

  trackByFormation(index: number, formation: Formation): number {
    return formation.id;
  }

  trackByDepartment(index: number, department: any): string {
    return department.id;
  }

  trackByLevel(index: number, level: any): string {
    return level.id;
  }
}
