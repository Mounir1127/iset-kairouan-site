import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  action?: string;
  link?: string;
}

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent implements OnInit {
  @Input() service!: Service;
  @Input() animated = true;
  @Input() variant: 'default' | 'compact' = 'default';
  @Input() showAction = false;

  isHovered = false;

  constructor() { }

  ngOnInit(): void {
    if (!this.service) {
      throw new Error('Service input is required');
    }
  }

  onCardClick(): void {
    if (this.service.action === 'openStudentSpace') {
      window.open('https://isetkairouan.edx.tn/login.faces', '_blank', 'noopener,noreferrer');
    } else if (this.service.link) {
      // Handle router link logic in template usually, but here for click
    }
  }

  getIconClass(): string {
    if (this.service.icon.startsWith('fa-')) {
      return `fas ${this.service.icon}`;
    }
    return this.service.icon;
  }

  getActionIcon(): string {
    if (this.service.action === 'openStudentSpace') {
      return 'fas fa-external-link-alt';
    }
    return 'fas fa-arrow-right';
  }

  getActionText(): string {
    if (this.service.action === 'openStudentSpace') {
      return 'Accéder';
    }
    return 'En savoir plus';
  }
}
