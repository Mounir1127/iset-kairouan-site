import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="contact-page">
      <!-- Back Home Button -->
      <button routerLink="/" class="btn-back-home shadow-lg">
        <i class="fas fa-home"></i>
      </button>

      <div class="container py-8">
        <div class="contact-card shadow-2xl animate-on-scroll slide-up">
          <div class="contact-header text-center mb-5">
            <h1 class="display-4 fw-black text-navy">Contactez-nous</h1>
            <div class="divider-gold mx-auto"></div>
          </div>

          <form (ngSubmit)="onSubmit()" #contactForm="ngForm" class="contact-form">
            <div class="row g-4">
              <div class="col-12">
                <div class="form-group-pro">
                  <label for="name">Nom</label>
                  <input type="text" id="name" [(ngModel)]="contact.name" name="name" 
                         required placeholder="Votre nom complet" class="form-input-pro">
                </div>
              </div>
              
              <div class="col-12">
                <div class="form-group-pro">
                  <label for="email">Email</label>
                  <input type="email" id="email" [(ngModel)]="contact.email" name="email" 
                         required email placeholder="votrename@exemple.com" class="form-input-pro">
                </div>
              </div>

              <div class="col-12">
                <div class="form-group-pro">
                  <label for="message">Message</label>
                  <textarea id="message" [(ngModel)]="contact.message" name="message" 
                            required rows="6" placeholder="Comment pouvons-nous vous aider ?" 
                            class="form-input-pro"></textarea>
                </div>
              </div>

              <div class="col-12 text-center mt-5">
                <button type="submit" [disabled]="contactForm.invalid || isSubmitting" 
                        class="btn-send-pro">
                  <span *ngIf="!isSubmitting">ENVOYER</span>
                  <span *ngIf="isSubmitting"><i class="fas fa-spinner fa-spin"></i> ENVOI EN COURS...</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .contact-card {
      background: white;
      border-radius: 2rem;
      padding: 4rem;
      max-width: 700px;
      width: 100%;
      margin: 0 auto;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .form-group-pro {
      margin-bottom: 1.5rem;
      
      label {
        display: block;
        font-weight: 700;
        color: #001b44;
        margin-bottom: 0.8rem;
        font-size: 0.95rem;
        letter-spacing: 0.5px;
      }
    }

    .form-input-pro {
      width: 100%;
      padding: 1.2rem;
      border-radius: 1rem;
      border: 2px solid #f0f4f8;
      background: #f8fafc;
      font-size: 1rem;
      transition: all 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: #0055a4;
        background: white;
        box-shadow: 0 10px 20px rgba(0, 85, 164, 0.05);
      }
    }

    .btn-send-pro {
      background: #0055a4;
      color: white;
      border: none;
      padding: 1.2rem 4rem;
      border-radius: 1rem;
      font-weight: 900;
      font-size: 1rem;
      letter-spacing: 2px;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      width: 100%;
      
      &:hover:not(:disabled) {
        background: #003d7a;
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 85, 164, 0.3);
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  `]
})
export class ContactComponent {
  contact = {
    name: '',
    email: '',
    message: ''
  };
  isSubmitting = false;

  constructor(private dataService: DataService, private router: Router) { }

  onSubmit() {
    this.isSubmitting = true;
    this.dataService.sendContactMessage(this.contact).subscribe({
      next: () => {
        alert('Votre message a été envoyé avec succès à l\'administration de l\'ISET Kairouan.');
        this.contact = { name: '', email: '', message: '' };
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error sending message:', err);
        alert('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
        this.isSubmitting = false;
      }
    });
  }
}
