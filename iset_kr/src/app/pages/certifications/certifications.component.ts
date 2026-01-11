import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateCardComponent, Certificate } from '../../components/certificate-card/certificate-card.component';

@Component({
    selector: 'app-certifications',
    standalone: true,
    imports: [CommonModule, CertificateCardComponent],
    template: `
    <div class="container" style="padding: 2rem;">
      <h2>Nos Certifications</h2>
      <div class="certificates-grid" style="display: grid; gap: 2rem; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); margin-top: 2rem;">
        <app-certificate-card *ngFor="let cert of certificates" [certificate]="cert"></app-certificate-card>
      </div>
    </div>
  `
})
export class CertificationsComponent {
    certificates: Certificate[] = [
        {
            id: 1,
            title: 'Système de Management de la Qualité',
            standard: 'ISO 9001:2015',
            description: 'Certification garantissant la qualité de nos services.',
            issuedDate: '2023-01-01',
            badge: 'SMG'
        },
        {
            id: 2,
            title: 'Système de Management des Organisations Éducatives',
            standard: 'ISO 21001:2018',
            description: 'Certification spécifique aux établissements d\'enseignement.',
            issuedDate: '2024-01-01',
            badge: 'SMG'
        }
    ];
}
