import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';

interface DepartmentData {
    id: string;
    name: string;
    icon: string;
    heroImage: string;
    description: string;
    stats: { label: string; value: string }[];
    headOfDepartment: {
        name: string;
        role: string;
        image: string;
        message: string;
    };
    specialties: {
        name: string;
        description: string;
        icon: string;
    }[];
    labs: string[];
}

@Component({
    selector: 'app-department-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './department-detail.component.html',
    styleUrls: ['./department-detail.component.scss']
})
export class DepartmentDetailComponent implements OnInit {
    departmentId: string | null = null;
    department: DepartmentData | undefined;

    // Mock data for departments
    departmentsData: { [key: string]: DepartmentData } = {
        'informatique': {
            id: 'informatique',
            name: 'Département Informatique',
            icon: 'fa-laptop-code',
            heroImage: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=1920&q=80',
            description: 'Le département Informatique forme des experts en technologies numériques, capables de concevoir, développer et sécuriser des systèmes d\'information complexes. Nos programmes couvrent le développement logiciel, les systèmes embarqués, et l\'administration des systèmes.',
            stats: [
                { label: 'Étudiants', value: '450+' },
                { label: 'Enseignants', value: '35' },
                { label: 'Laboratoires', value: '8' },
                { label: 'Partenaires', value: '12' }
            ],
            headOfDepartment: {
                name: 'M. Ahmed Ben Ali',
                role: 'Chef de Département',
                image: 'assets/images/staff/generic-avatar.png', // Placeholder
                message: 'Notre mission est de doter nos étudiants des compétences techniques et humaines nécessaires pour exceller dans un secteur en perpétuelle évolution.'
            },
            specialties: [
                {
                    name: 'Développement des Systèmes d\'Information (DSI)',
                    description: 'Conception et développement d\'applications web, mobiles et desktop.',
                    icon: 'fa-code'
                },
                {
                    name: 'Administration des Réseaux et Services (ARS)',
                    description: 'Gestion des infrastructures réseaux et sécurité des systèmes.',
                    icon: 'fa-network-wired'
                },
                {
                    name: 'Systèmes Embarqués et Mobiles (SEM)',
                    description: 'Développement pour l\'IoT et les systèmes temps réel.',
                    icon: 'fa-microchip'
                }
            ],
            labs: ['Laboratoire IA & Big Data', 'Cisco Academy', 'Microsoft Club', 'Cyber Security Lab']
        },
        'genie-electrique': {
            id: 'genie-electrique',
            name: 'Génie Électrique',
            icon: 'fa-bolt',
            heroImage: 'assets/images/elec.jpg',
            description: 'Le département Génie Électrique est un pôle d\'excellence formant des techniciens supérieurs en électricité, électronique et automatisme. Nous préparons nos étudiants aux défis de l\'industrie 4.0.',
            stats: [
                { label: 'Étudiants', value: '380+' },
                { label: 'Enseignants', value: '30' },
                { label: 'Laboratoires', value: '10' },
                { label: 'Projets Ind.', value: '25+' }
            ],
            headOfDepartment: {
                name: 'Mme. Sarah Jlassi',
                role: 'Chef de Département',
                image: 'assets/images/staff/generic-avatar.png',
                message: 'L\'innovation et la pratique sont au cœur de notre pédagogie pour former les ingénieurs de demain.'
            },
            specialties: [
                {
                    name: 'Automatismes et Informatique Industrielle (AII)',
                    description: 'Pilotage des systèmes automatisés et robotique.',
                    icon: 'fa-robot'
                },
                {
                    name: 'Électricité Industrielle (EI)',
                    description: 'Installation et maintenance des équipements électriques.',
                    icon: 'fa-plug'
                }
            ],
            labs: ['Labo Automatisme', 'Labo Électronique de Puissance', 'Atelier Maintenance', 'Schneider Electric Lab']
        },
        'genie-mecanique': {
            id: 'genie-mecanique',
            name: 'Génie Mécanique',
            icon: 'fa-cogs',
            heroImage: 'assets/images/meca.jpg', // Industrial machine
            description: 'Le département Génie Mécanique offre une formation solide en conception, fabrication et maintenance des systèmes mécaniques. Nos étudiants maîtrisent la CAO/DAO et les procédés de fabrication modernes.',
            stats: [
                { label: 'Étudiants', value: '320+' },
                { label: 'Enseignants', value: '28' },
                { label: 'Ateliers', value: '6' },
                { label: 'Machines CNC', value: '15' }
            ],
            headOfDepartment: {
                name: 'M. Karim Oueslati',
                role: 'Chef de Département',
                image: 'assets/images/staff/generic-avatar.png',
                message: 'Nous formons des techniciens capables de transformer une idée en un produit tangible et fonctionnel.'
            },
            specialties: [
                {
                    name: 'Construction et Fabrication Mécanique (CFM)',
                    description: 'Conception assistée par ordinateur et usinage numérique.',
                    icon: 'fa-tools'
                },
                {
                    name: 'Maintenance Industrielle (MI)',
                    description: 'Gestion de la maintenance et fiabilité des équipements.',
                    icon: 'fa-wrench'
                }
            ],
            labs: ['Atelier Usinage', 'Labo Métrologie', 'Bureau d\'études CAO', 'Soudage & Chaudronnerie']
        },
        'sciences-economiques': {
            id: 'sciences-economiques',
            name: 'Sciences Économiques & Gestion',
            icon: 'fa-chart-line',
            heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80', // Financial/Office
            description: 'Ce département forme les futurs cadres gestionnaires. Nos programmes allient théorie économique et pratiques managériales pour une insertion rapide dans le monde des affaires.',
            stats: [
                { label: 'Étudiants', value: '500+' },
                { label: 'Enseignants', value: '40' },
                { label: 'Clubs', value: '5' },
                { label: 'Partenaires', value: '20' }
            ],
            headOfDepartment: {
                name: 'Mme. Leïla Triki',
                role: 'Chef de Département',
                image: 'assets/images/staff/generic-avatar.png',
                message: 'Comprendre l\'économie pour mieux gérer l\'entreprise de demain est notre devise.'
            },
            specialties: [
                {
                    name: 'Comptabilité et Finances',
                    description: 'Gestion financière, audit et contrôle de gestion.',
                    icon: 'fa-file-invoice-dollar'
                },
                {
                    name: 'Marketing et Commerce International',
                    description: 'Stratégies commerciales et échanges mondiaux.',
                    icon: 'fa-globe-africa'
                },
                {
                    name: 'Administration des Affaires',
                    description: 'Gestion des ressources humaines et management stratégique.',
                    icon: 'fa-user-tie'
                }
            ],
            labs: ['Club Entrepreneuriat', 'Salle des Marchés (Simulateur)', 'Incubateur Junior']
        },
        'gestion': {
            id: 'gestion',
            name: 'Sciences Économiques & Gestion',
            icon: 'fa-chart-line',
            heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80',
            description: 'Ce département forme les futurs cadres gestionnaires. Nos programmes allient théorie économique et pratiques managériales pour une insertion rapide dans le monde des affaires.',
            stats: [
                { label: 'Étudiants', value: '500+' },
                { label: 'Enseignants', value: '40' },
                { label: 'Clubs', value: '5' },
                { label: 'Partenaires', value: '20' }
            ],
            headOfDepartment: {
                name: 'Mme. Leïla Triki',
                role: 'Chef de Département',
                image: 'assets/images/staff/generic-avatar.png',
                message: 'Comprendre l\'économie pour mieux gérer l\'entreprise de demain est notre devise.'
            },
            specialties: [
                {
                    name: 'Comptabilité et Finances',
                    description: 'Gestion financière, audit et contrôle de gestion.',
                    icon: 'fa-file-invoice-dollar'
                },
                {
                    name: 'Marketing et Commerce International',
                    description: 'Stratégies commerciales et échanges mondiaux.',
                    icon: 'fa-globe-africa'
                },
                {
                    name: 'Administration des Affaires',
                    description: 'Gestion des ressources humaines et management stratégique.',
                    icon: 'fa-user-tie'
                }
            ],
            labs: ['Club Entrepreneuriat', 'Salle des Marchés (Simulateur)', 'Incubateur Junior']
        }
    };

    constructor(private route: ActivatedRoute, private dataService: DataService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            window.scrollTo(0, 0);
            this.departmentId = params.get('id');
            if (this.departmentId && this.departmentsData[this.departmentId]) {
                this.department = this.departmentsData[this.departmentId];

                // Fetch real data to update Head of Department
                // Fetch real data to update Head of Department
                this.dataService.getDepartments().subscribe(realDepts => {
                    // Normalize helper
                    const clean = (str: string) => this.normalize(str).replace(/-/g, ' ');
                    const currentId = clean(this.departmentId || '');
                    const currentName = clean(this.department!.name);

                    const matchingRealDept = realDepts.find(d => {
                        const dbName = clean(d.name || '');
                        const dbCode = clean(d.code || '');

                        // Match by Name (contains), ID (slug), or Code
                        return dbName.includes(currentName) ||
                            currentName.includes(dbName) ||
                            dbName.includes(currentId) ||
                            (dbCode && currentName.includes(dbCode));
                    });

                    if (matchingRealDept && matchingRealDept.headOfDepartment) {
                        this.department = {
                            ...this.department!,
                            headOfDepartment: {
                                name: matchingRealDept.headOfDepartment.name,
                                role: matchingRealDept.headOfDepartment.grade || 'Chef de Département',
                                image: matchingRealDept.headOfDepartment.image || 'assets/images/staff/generic-avatar.png',
                                message: this.department!.headOfDepartment.message
                            }
                        };
                        this.cdr.markForCheck();
                    }
                }, err => console.error('Error fetching depts:', err));
            }
        });
    }

    private normalize(str: string): string {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
}
