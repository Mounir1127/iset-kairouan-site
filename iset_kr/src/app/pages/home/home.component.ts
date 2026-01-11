import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Service } from '../../components/service-card/service-card.component';
import { Certificate } from '../../components/certificate-card/certificate-card.component';
import { Announcement, AnnouncementCardComponent } from '../../components/announcement-card/announcement-card.component';
import { StatItem } from '../../components/stats-card/stats-card.component';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, AnnouncementCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Services
  services: Service[] = [];

  // Certificates
  certificates: Certificate[] = [];

  // Announcements
  announcements: Announcement[] = [];

  // Stats
  stats: StatItem[] = [];

  // Loading states
  isLoading = {
    services: true,
    certificates: true,
    announcements: true,
    stats: true
  };

  // Hero section
  hero = {
    title: 'Excellence Académique & Innovation Technologique',
    subtitle: 'L\'ISET Kairouan forme les techniciens supérieurs et ingénieurs de demain dans les domaines de l\'informatique, des télécommunications et du génie électrique.',
    backgroundImage: 'assets/images/campus/hero-bg.jpg',
    ctaButtons: [
      { text: 'DÉCOUVRIR NOS FORMATIONS', link: '/formations', variant: 'primary' },
      { text: 'ESPACE ÉTUDIANT', action: 'openStudentSpace', variant: 'secondary' }
    ]
  };

  // Practical services
  practicalServices = {
    title: 'Services Pratiques Aux Étudiants',
    subtitle: 'Accédez à tous les services en ligne essentiels pour votre parcours académique',
    servicesList: [
      { icon: 'fa-user-check', text: 'INSCRIPTION EN LIGNE' },
      { icon: 'fa-download', text: 'ESPACE TÉLÉCHARGEMENT' },
      { icon: 'fa-book', text: 'BIBLIOTHÈQUE EN LIGNE' },
      { icon: 'fa-newspaper', text: 'PLAQUETTES PÉDAGOGIQUES' },
      { icon: 'fa-calendar-alt', text: 'EMPLOI DU TEMPS' },
      { icon: 'fa-chart-line', text: 'RÉSULTATS & NOTES', action: 'openStudentSpace' }
    ]
  };

  // Categorized Announcements
  manifestations: any[] = [];
  appelsOffre: any[] = [];
  nouveautes: any[] = [];
  activeTab: string = 'all'; // Default to 'all' to show everything initially

  // Dynamic features
  currentHeroSlide = 0;
  heroSlides = [
    {
      title: 'EXCELLENCE<br><span class="highlight">ACADÉMIQUE</span> &<br>INNOVATION',
      subtitle: 'L\'ISET Kairouan forme les techniciens supérieurs et ingénieurs de demain',
      image: 'assets/images/images_iset/Image8.jpg'
    },
    {
      title: 'FORMATIONS<br><span class="highlight">TECHNOLOGIQUES</span><br>D\'EXCELLENCE',
      subtitle: 'Des parcours adaptés aux besoins de l\'industrie moderne',
      image: 'assets/images/images_iset/Image9.jpg'
    },
    {
      title: 'INNOVATION<br>& <span class="highlight">RECHERCHE</span><br>APPLIQUÉE',
      subtitle: 'Un environnement propice à la créativité et à l\'innovation',
      image: 'assets/images/images_iset/Image10.jpg'
    },
    {
      title: 'VIE<br><span class="highlight">UNIVERSITAIRE</span><br>DYNAMIQUE',
      subtitle: 'Plus qu\'une formation, une expérience humaine et associative unique',
      image: 'assets/images/images_iset/493688342_1038981721665537_4271788476003824290_n.jpg'
    },
    {
      title: 'PARTENARIATS<br><span class="highlight">STRATÉGIQUES</span><br>SOLIDES',
      subtitle: 'Une ouverture constante sur le monde professionnel et international',
      image: 'assets/images/images_iset/600299781_122153593976891020_5618636641594002043_n.jpg'
    },
    {
      title: 'ATELIERS<br>& <span class="highlight">PRATIQUE</span><br>INTENSIVE',
      subtitle: 'Le savoir-faire au coeur de notre pédagogie active',
      image: 'assets/images/images_iset/atelie2.jpg'
    },
    {
      title: 'DÉPARTEMENT<br><span class="highlight">GÉNIE MÉCANIQUE</span>',
      subtitle: '17 Enseignants experts à votre service',
      image: 'assets/images/images_iset/image17.jpg'
    },
    {
      title: 'DÉPARTEMENT<br><span class="highlight">GÉNIE ÉLECTRIQUE</span>',
      subtitle: '14 Enseignants spécialisés',
      image: 'assets/images/images_iset/imge14.jpg'
    },
    {
      title: 'DÉPARTEMENT<br><span class="highlight">TECHNOLOGIES INFO.</span>',
      subtitle: '11 Enseignants à la pointe du numérique',
      image: 'assets/images/images_iset/image11.jpg'
    },
    {
      title: 'SECTION<br><span class="highlight">ADMIN. AFFAIRES</span>',
      subtitle: '8 Consultants et enseignants dédiés',
      image: 'assets/images/images_iset/image12.jpg'
    },
    {
      title: 'DÉVELOPPEMENT<br><span class="highlight">MOBILE & WEB</span>',
      subtitle: 'Formation pratique sur les dernières technologies',
      image: 'assets/images/images_iset/image13.jpg'
    },
    {
      title: 'LABORATOIRES<br><span class="highlight">DE POINTE</span>',
      subtitle: 'Équipements modernes pour vos travaux pratiques',
      image: 'assets/images/images_iset/image15.jpg'
    },
    {
      title: 'ÉNERGIES<br><span class="highlight">RENOUVELABLES</span>',
      subtitle: 'Préparer la transition énergétique',
      image: 'assets/images/images_iset/image18.jpg'
    },
    {
      title: 'ESPRIT<br><span class="highlight">D\'INNOVATION</span>',
      subtitle: 'Encourager la créativité de nos étudiants',
      image: 'assets/images/images_iset/image19.jpg'
    }
  ];

  campusImages: string[] = [
    'assets/images/images_iset/image11.jpg',
    'assets/images/images_iset/image12.jpg',
    'assets/images/images_iset/image13.jpg',
    'assets/images/images_iset/imge14.jpg',
    'assets/images/images_iset/image15.jpg',
    'assets/images/images_iset/image16.jpg',
    'assets/images/images_iset/image17.jpg',
    'assets/images/images_iset/image18.jpg',
    'assets/images/images_iset/image19.jpg',
    'assets/images/images_iset/Image8.jpg',
    'assets/images/images_iset/Image9.jpg',
    'assets/images/images_iset/Image10.jpg',
    'assets/images/images_iset/atelie2.jpg'
  ];

  // Map Configuration
  mapUrl: SafeResourceUrl;
  weatherData = {
    temp: 24,
    condition: 'Ensoleillé',
    location: 'Kairouan, TN',
    icon: 'fas fa-sun'
  };

  clubs = [
    { name: 'Scouts ISET KR', link: 'https://www.facebook.com/profile.php?id=61572859037569', icon: 'fas fa-campground', description: 'Toujours prêts pour servir et guider.' },
    { name: 'IEEE Student Branch', link: 'https://www.facebook.com/IEEE.iset.Kairouan.sb', icon: 'fas fa-microchip', description: 'Technologie et innovation pour l\'humanité.' },
    { name: 'Club AI', link: 'https://www.facebook.com/profile.php?id=61559044582386', icon: 'fas fa-brain', description: 'Exploration de l\'intelligence artificielle.' },
    { name: 'Club Edujoy', link: 'https://www.facebook.com/profile.php?id=61550578007610', icon: 'fas fa-gamepad', description: 'Apprendre en s\'amusant et innovant.' },
    { name: 'Club CGM', link: 'https://www.facebook.com/profile.php?id=61570112363480', icon: 'fas fa-cogs', description: 'Conception et génie mécanique créatif.' },
    { name: 'Club IT', link: 'https://www.facebook.com/itisetkr', icon: 'fas fa-laptop-code', description: 'Développement, réseaux et technologies IT.' },
    { name: 'Club Robotique', link: 'https://www.facebook.com/profile.php?id=61574105670014', icon: 'fas fa-robot', description: 'Construction et programmation de robots.' },
    { name: 'Club Sport', link: 'https://www.facebook.com/profile.php?id=61576730609220', icon: 'fas fa-futbol', description: 'Esprit d\'équipe et activité physique.' },
    { name: 'Club Santé et Env.', link: 'https://www.facebook.com/profile.php?id=61583378950279', icon: 'fas fa-leaf', description: 'Sensibilisation à la santé et l\'écologie.' }
  ];

  // Image Preview Logic
  selectedImage: string | null = null;

  @ViewChild('clubsScrollContainer') clubsScrollContainer!: ElementRef;
  @ViewChild('galleryScrollContainer') galleryScrollContainer!: ElementRef;
  @ViewChild('academicScrollContainer') academicScrollContainer!: ElementRef;
  @ViewChild('industrialScrollContainer') industrialScrollContainer!: ElementRef;
  @ViewChild('internationalScrollContainer') internationalScrollContainer!: ElementRef;

  scrollClubs(direction: 'left' | 'right'): void {
    const container = this.clubsScrollContainer.nativeElement;
    const scrollAmount = 400; // Adjust scroll distance as needed
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  scrollPartners(type: 'academic' | 'industrial' | 'international', direction: 'left' | 'right'): void {
    let container;
    if (type === 'academic') container = this.academicScrollContainer.nativeElement;
    else if (type === 'industrial') container = this.industrialScrollContainer.nativeElement;
    else container = this.internationalScrollContainer.nativeElement;
    const scrollAmount = 300;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  scrollGallery(direction: 'left' | 'right'): void {
    const container = this.galleryScrollContainer.nativeElement;
    const scrollAmount = 500;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  internationalPartners: { name: string, logo: string }[] = [
    { name: 'AUF', logo: 'assets/images/nos_parteners/AUF.png' },
    { name: 'KOICA', logo: 'assets/images/nos_parteners/KOICA.png' },
    { name: 'PNUD', logo: 'assets/images/nos_parteners/UNDP.png' },
    { name: 'AFD', logo: 'assets/images/nos_parteners/AFD.jpg' }
  ];

  academicPartners: { name: string, logo: string, link?: string }[] = [
    { name: 'Université de Kairouan', logo: 'assets/images/nos_parteners/Université%20de%20Kairouan.png' },
    { name: 'Canada', logo: 'assets/images/nos_parteners/canada.png' },
    { name: 'CNFCPP', logo: 'assets/images/nos_parteners/CNFCPP.png' },
    { name: 'CNFCCP', logo: 'assets/images/nos_parteners/CNFCCP.jpg' },
    { name: 'ESPITA', logo: 'assets/images/nos_parteners/ESPITA.jpg' },
    { name: 'IHE Sousse', logo: 'assets/images/nos_parteners/ihesousse_logo.jpg' },
    { name: 'ASH', logo: 'assets/images/nos_parteners/ASH.jpg' },
    { name: 'Jannet', logo: 'assets/images/nos_parteners/Jannet.jpg' },
    { name: 'MTK', logo: 'assets/images/nos_parteners/MTK.jpg' }
  ];

  industrialPartners = [
    { name: 'Orange Digital Center', logo: 'assets/images/nos_parteners/orange.png', link: 'https://engageforchange.orange.com' },
    { name: '4C ISET Kairouan', logo: 'assets/images/nos_parteners/4C.png' },
    { name: 'GoMyCode', logo: 'assets/images/nos_parteners/GomyCode.png' },
    { name: 'JCI Kairouan', logo: 'assets/images/nos_parteners/jci_kr.jpg' },
    { name: 'ANME', logo: 'assets/images/nos_parteners/ANME.jpg' },
    { name: 'APII', logo: 'assets/images/nos_parteners/APII.png' },
    { name: 'UTICA', logo: 'assets/images/nos_parteners/Logo_UTICA.gif' },
    { name: 'Landor', logo: 'assets/images/nos_parteners/LANDOR.jpg' },
    { name: 'Sabrine', logo: 'assets/images/nos_parteners/Sabrine.jpg' },
    { name: 'Vizmerald', logo: 'assets/images/nos_parteners/vizmerald.png' }
  ];

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3234.331393661148!2d10.06060751510976!3d35.59818278021374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fdd0beb969169d%3A0x1410192ef187ce3a!2sInstitut%20Sup%C3%A9rieur%20des%20%C3%89tudes%20Technologiques%20de%20Kairouan!5e0!3m2!1sfr!2stn!4v1709999999999!5m2!1sfr!2stn');
  }

  ngOnInit(): void {
    // Redirection automatique pour les rôles admin et staff
    const user = this.authService.getCurrentUser();
    // Redirection automatique retirée à la demande de l'utilisateur

    this.loadAllData();
    this.startHeroCarousel();
    this.initScrollAnimations();

    // Auto-refresh when notified
    this.dataService.refreshAnnouncementsRequested$.subscribe(() => {
      this.loadAnnouncements();
      this.loadStats(); // Stats might change too
    });
  }

  startHeroCarousel(): void {
    setInterval(() => {
      this.currentHeroSlide = (this.currentHeroSlide + 1) % this.heroSlides.length;
    }, 5000); // Change slide every 5 seconds
  }

  nextSlide(): void {
    this.currentHeroSlide = (this.currentHeroSlide + 1) % this.heroSlides.length;
  }

  prevSlide(): void {
    this.currentHeroSlide = (this.currentHeroSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  goToSlide(index: number): void {
    this.currentHeroSlide = index;
  }

  initScrollAnimations(): void {
    if (typeof window !== 'undefined') {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, observerOptions);

      // Observe elements after a short delay to ensure DOM is ready
      setTimeout(() => {
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
          observer.observe(el);
        });
      }, 100);
    }
  }

  loadAllData(): void {
    this.loadServices();
    this.loadCertificates();
    this.loadAnnouncements();
    this.loadStats();
  }

  loadServices(): void {
    this.isLoading.services = true;
    this.dataService.getServices().subscribe({
      next: (services) => {
        this.services = services;
        this.isLoading.services = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.isLoading.services = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadCertificates(): void {
    this.isLoading.certificates = true;
    this.dataService.getCertificates().subscribe({
      next: (certificates) => {
        this.certificates = certificates;
        this.isLoading.certificates = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading certificates:', error);
        this.isLoading.certificates = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadAnnouncements(): void {
    this.isLoading.announcements = true;

    this.dataService.getAnnouncements()
      .pipe(finalize(() => {
        this.isLoading.announcements = false;
        this.cdr.detectChanges(); // FORCE UI UPDATE
      }))
      .subscribe({
        next: (announcements) => {
          if (!announcements) {
            console.warn('[Home] No announcements payload received');
            this.announcements = [];
            return;
          }
          // Normalize types to lowercase just in case
          // Map and normalize database announcements
          this.announcements = announcements.map(a => {
            let type = a.type?.toLowerCase() || 'news';
            // Unified mapping based on database content seen in Admin
            if (type === 'academic') type = 'news';
            if (type === 'administrative') type = 'tender';
            return { ...a, type };
          });

          // Sort by date (newest first)
          this.announcements.sort((a, b) => {
            const dateA = new Date(a.date || a.publishDate || 0).getTime();
            const dateB = new Date(b.date || b.publishDate || 0).getTime();
            return dateB - dateA;
          });

          this.manifestations = this.announcements.filter(a => a.type === 'event');
          this.appelsOffre = this.announcements.filter(a => a.type === 'tender');
          this.nouveautes = this.announcements.filter(a => a.type === 'news');

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('[Home] Erreur chargement annonces:', error);
          this.announcements = [];
          this.manifestations = [];
          this.appelsOffre = [];
          this.nouveautes = [];
          this.cdr.detectChanges();
        }
      });
  }


  setActiveTab(tab: string): void {
    this.activeTab = tab;
    // Reinforce scroll animations for newly shown items
    setTimeout(() => this.initScrollAnimations(), 200);
  }

  get filteredItems(): any[] {
    switch (this.activeTab) {
      case 'all': return this.announcements; // New case for 'all'
      case 'news': return this.nouveautes;
      case 'event': return this.manifestations;
      case 'tender': return this.appelsOffre;
      default: return this.announcements;
    }
  }

  loadStats(): void {
    this.isLoading.stats = true;
    this.dataService.getStats().subscribe({
      next: (statsData) => {
        this.stats = [
          { value: 1122, label: 'ÉTUDIANTS', icon: 'fas fa-user-graduate', color: '#0055a4' },
          { value: 99, label: 'ENSEIGNANTS', icon: 'fas fa-chalkboard-teacher', color: '#0077c8' },
          { value: 10, label: 'PROF. ENS. SUP.', icon: 'fas fa-user-tie', color: '#d32f2f' },
          { value: 39, label: 'VACATAIRES', icon: 'fas fa-clock', color: '#fbc02d' }
        ];

        this.isLoading.stats = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.stats = [
          { value: 1122, label: 'ÉTUDIANTS', icon: 'fas fa-user-graduate', color: '#0055a4' },
          { value: 99, label: 'ENSEIGNANTS', icon: 'fas fa-chalkboard-teacher', color: '#0077c8' },
          { value: 10, label: 'PROF. ENS. SUP.', icon: 'fas fa-user-tie', color: '#d32f2f' },
          { value: 39, label: 'VACATAIRES', icon: 'fas fa-clock', color: '#fbc02d' }
        ];
        this.isLoading.stats = false;
        this.cdr.detectChanges();
      }
    });
  }

  openStudentSpace(): void {
    window.open('https://isetkairouan.edx.tn/login.faces', '_blank', 'noopener,noreferrer');
  }

  trackByService(index: number, service: Service): number {
    return service.id;
  }

  trackByCertificate(index: number, certificate: Certificate): number {
    return certificate.id;
  }

  trackByAnnouncement(index: number, announcement: Announcement): number {
    return announcement.id;
  }

  trackByStat(index: number, stat: StatItem): string {
    return stat.label;
  }

  get isLoadingAll(): boolean {
    return Object.values(this.isLoading).some(loading => loading);
  }

  // Preview Methods
  openImagePreview(imageUrl: string): void {
    this.selectedImage = imageUrl;
    // Prevent scrolling when modal is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeImagePreview(): void {
    this.selectedImage = null;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  }
}
