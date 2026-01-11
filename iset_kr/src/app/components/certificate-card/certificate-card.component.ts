import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Certificate {
  id: number;
  title: string;
  standard: string;
  description: string;
  issuedDate: string;
  validUntil?: string;
  badge: string;
  verificationUrl?: string;
  issuer?: string;
  category?: string;
}

@Component({
  selector: 'app-certificate-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificate-card.component.html',
  styleUrls: ['./certificate-card.component.scss']
})
export class CertificateCardComponent implements OnInit {
  @Input() certificate!: Certificate;
  @Input() variant: 'default' | 'detailed' = 'default';
  @Input() showVerification = true;
  @Input() animated = true;

  isHovered = false;
  showDetails = false;

  constructor() { }

  ngOnInit(): void {
    if (!this.certificate) {
      throw new Error('Certificate input is required');
    }
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  verifyCertificate(): void {
    if (this.certificate.verificationUrl) {
      window.open(this.certificate.verificationUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Default verification action
      alert(`Certificat ${this.certificate.standard} - Émis le ${this.certificate.issuedDate}`);
    }
  }

  getStandardColor(): string {
    const standards: { [key: string]: string } = {
      'ISO 9001:2015': '#0055a4',
      'ISO 21001:2018': '#0077c8',
      'ISO 14001': '#2e7d32',
      'ISO 45001': '#f57c00'
    };
    return standards[this.certificate.standard] || '#0055a4';
  }

  isExpired(): boolean {
    if (!this.certificate.validUntil) return false;
    const validUntil = new Date(this.certificate.validUntil);
    const today = new Date();
    return validUntil < today;
  }

  getDaysRemaining(): number {
    if (!this.certificate.validUntil) return 0;
    const validUntil = new Date(this.certificate.validUntil);
    const today = new Date();
    const diffTime = validUntil.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getStatusText(): string {
    if (this.isExpired()) {
      return 'Expiré';
    }
    if (this.certificate.validUntil) {
      const days = this.getDaysRemaining();
      if (days < 30) {
        return `Expire dans ${days} jour${days > 1 ? 's' : ''}`;
      }
      return 'Valide';
    }
    return 'Permanent';
  }

  getStatusClass(): string {
    if (this.isExpired()) {
      return 'expired';
    }
    if (this.certificate.validUntil) {
      const days = this.getDaysRemaining();
      if (days < 30) {
        return 'expiring';
      }
    }
    return 'valid';
  }
}
