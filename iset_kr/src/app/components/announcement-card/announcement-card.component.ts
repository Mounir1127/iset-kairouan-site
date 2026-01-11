import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Announcement {
  id: number;
  number: string;
  title: string;
  arabicText: string;
  content: string;
  date?: Date;
  publishDate?: Date;
  type?: string;
  image?: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  attachments?: Array<{ name: string; url: string }>;
  targetAudience?: string[];
}

@Component({
  selector: 'app-announcement-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './announcement-card.component.html',
  styleUrls: ['./announcement-card.component.scss']
})
export class AnnouncementCardComponent implements OnInit {
  @Input() announcement!: Announcement;
  @Input() showNumber = true;
  @Input() showArabic = true;
  @Input() showDetails = false;
  @Input() compact = false;

  isExpanded = false;
  showAttachments = false;

  constructor() { }

  ngOnInit(): void {
    if (!this.announcement) {
      throw new Error('Announcement input is required');
    }

    // Polyfill date if missing but publishDate exists (fixes schema mismatch for seeded data)
    if (!this.announcement.date && this.announcement.publishDate) {
      this.announcement.date = this.announcement.publishDate;
    }
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  toggleAttachments(): void {
    this.showAttachments = !this.showAttachments;
  }

  openStudentSpace(): void {
    window.open('https://isetkairouan.edx.tn/login.faces', '_blank', 'noopener,noreferrer');
  }

  downloadAttachment(attachment: { name: string; url: string }): void {
    // Simulate download
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getPriorityColor(): string {
    const colors = {
      high: '#d32f2f',
      medium: '#f57c00',
      low: '#0055a4'
    };
    return colors[this.announcement.priority || 'low'];
  }

  getPriorityIcon(): string {
    const icons = {
      high: 'fa-exclamation-circle',
      medium: 'fa-exclamation-triangle',
      low: 'fa-info-circle'
    };
    return icons[this.announcement.priority || 'low'];
  }

  getDay(): string {
    if (!this.announcement.date) return '';
    const date = new Date(this.announcement.date);
    return date.getDate().toString().padStart(2, '0');
  }

  getMonth(): string {
    if (!this.announcement.date) return '';
    const date = new Date(this.announcement.date);
    const months = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin',
      'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
    return months[date.getMonth()];
  }

  getFormattedDate(): string {
    if (!this.announcement.date) return '';
    return new Date(this.announcement.date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  hasAttachments(): boolean {
    return !!this.announcement.attachments && this.announcement.attachments.length > 0;
  }

  getAttachmentCount(): number {
    return this.announcement.attachments?.length || 0;
  }
}
