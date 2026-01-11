import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

export interface StatItem {
  value: number | string;
  label: string;
  icon: string;
  suffix?: string;
  prefix?: string;
  color?: string;
  description?: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss'],
  animations: [
    trigger('countUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('pulse', [
      transition(':increment', [
        animate('0.3s ease-out', style({ transform: 'scale(1.1)' })),
        animate('0.3s ease-in', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class StatsCardComponent implements OnInit {
  @Input() stat!: StatItem;
  @Input() layout: 'horizontal' | 'vertical' = 'vertical';
  @Input() animated = true;
  @Input() showChange = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  displayValue: string = '';
  currentValue: number = 0;
  isCounting = false;

  constructor() { }

  ngOnInit(): void {
    if (!this.stat) {
      throw new Error('Stat input is required');
    }
    this.formatValue();

    if (this.animated && typeof this.stat.value === 'number') {
      this.animateCount();
    } else {
      this.displayValue = this.getFormattedValue();
    }
  }

  formatValue(): void {
    const value = this.stat.value;

    if (typeof value === 'number') {
      if (value >= 1000000) {
        this.displayValue = (value / 1000000).toFixed(1) + 'M';
      } else if (value >= 1000) {
        this.displayValue = (value / 1000).toFixed(1) + 'K';
      } else {
        this.displayValue = value.toString();
      }
    } else {
      this.displayValue = value;
    }
  }

  animateCount(): void {
    this.isCounting = true;
    const targetValue = this.stat.value as number;
    const duration = 1500;
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      this.currentValue = Math.min(Math.floor(current), targetValue);

      if (current >= targetValue) {
        this.currentValue = targetValue;
        clearInterval(timer);
        this.isCounting = false;
      }
    }, duration / steps);
  }

  getFormattedValue(): string {
    const prefix = this.stat.prefix || '';
    const suffix = this.stat.suffix || '';
    const value = this.isCounting ? this.currentValue : this.stat.value;

    if (typeof value === 'number') {
      return `${prefix}${value.toLocaleString('fr-FR')}${suffix}`;
    }
    return `${prefix}${value}${suffix}`;
  }

  getIconClass(): string {
    if (this.stat.icon.startsWith('fa-')) {
      return `fas ${this.stat.icon}`;
    }
    return this.stat.icon;
  }

  getColor(): string {
    return this.stat.color || '#0055a4';
  }

  getChangeIcon(): string {
    if (!this.stat.change) return '';
    return this.stat.change.isPositive ? 'fa-arrow-up' : 'fa-arrow-down';
  }

  getChangeColor(): string {
    if (!this.stat.change) return '';
    return this.stat.change.isPositive ? '#2e7d32' : '#d32f2f';
  }

  getChangeText(): string {
    if (!this.stat.change) return '';
    const prefix = this.stat.change.isPositive ? '+' : '';
    return `${prefix}${this.stat.change.value}%`;
  }

  getSizeClass(): string {
    return `size-${this.size}`;
  }

  getLayoutClass(): string {
    return `layout-${this.layout}`;
  }
}
