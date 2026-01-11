import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { finalize, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  activeTab: 'login' | 'register' = 'login';
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  successMessage = '';
  loginSubmitted = false;
  registerSubmitted = false;

  // Metadata Observables
  departments$: Observable<any[]>;
  classes$: Observable<any[]>;
  modules$: Observable<any[]>;

  // Local filtered data (keeping for registration logic)
  allClasses: any[] = [];
  filteredClasses: any[] = [];
  levels = ['1ère année', '2ème année', '3ème année'];
  groups = ['A', 'B'];
  grades = [
    'Professeur technologue',
    'Maître de conférences technologue',
    'Maître assistant technologue',
    'Assistant technologue',
    'PES (Prof agrégé / certifié)'
  ];
  genders = ['Homme', 'Femme'];

  // Login features
  loginFeatures = [
    {
      icon: 'fa-graduation-cap',
      title: 'Formations Certifiées',
      description: 'Diplômes reconnus par l\'État'
    },
    {
      icon: 'fa-laptop-code',
      title: 'Plateforme Numérique',
      description: 'Accès 24/7 aux ressources pédagogiques'
    },
    {
      icon: 'fa-chart-line',
      title: 'Suivi Personnalisé',
      description: 'Accompagnement individualisé'
    }
  ];

  // Testimonials
  testimonials = [
    {
      text: 'La plateforme de l\'ISET Kairouan a révolutionné mon apprentissage. Interface intuitive et ressources complètes.',
      author: 'Ahmed Ben Salah',
      role: 'Étudiant en Génie Informatique'
    },
    {
      text: 'Excellent outil pour le suivi académique. Je recommande à tous les étudiants.',
      author: 'Sarra Ben Ali',
      role: 'Étudiante en Télécommunications'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Initialize Observables
    this.departments$ = this.authService.getDepartments().pipe(
      catchError(err => {
        console.error('Error fetching departments:', err);
        return of([]);
      })
    );
    this.classes$ = this.authService.getClasses().pipe(
      tap(data => this.allClasses = data),
      catchError(err => {
        console.error('Error fetching classes:', err);
        return of([]);
      })
    );
    this.modules$ = this.authService.getModules().pipe(
      catchError(err => {
        console.error('Error fetching modules:', err);
        return of([]);
      })
    );

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      matricule: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@.+\.rnu\.tn$/)]],
      phone: ['', [Validators.required]],
      role: ['student', [Validators.required]],
      // New fields
      cin: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      birthDate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      department: ['', [Validators.required]],
      classGroup: [''],
      level: [''],
      group: [''],
      grade: [''],
      speciality: [''],
      office: [''],
      assignedClasses: [[]],
      subjects: [[]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadMetadata();

    // Subscribe to password changes for custom match validation
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });

    // Subscribe to role changes for dynamic validation
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      this.updateValidators(role);
    });

    // Initialize validators for default role
    const initialRole = this.registerForm.get('role')?.value;
    if (initialRole) {
      this.updateValidators(initialRole);
    }
  }

  loadMetadata() {
    // Sync with form activity to clear messages when user types
    this.loginForm.valueChanges.subscribe(() => this.clearMessages());
    this.registerForm.valueChanges.subscribe(() => this.clearMessages());

    // Initialize filteredClasses when all classes are loaded
    this.classes$.subscribe(classes => {
      console.log('Classes loaded:', classes);
      this.allClasses = classes;
      this.filteredClasses = classes; // Show all classes initially
      this.cdr.detectChanges();
    });
  }

  clearMessages() {
    if (this.errorMessage || this.successMessage) {
      this.errorMessage = '';
      this.successMessage = '';
      this.cdr.detectChanges();
    }
  }

  onDepartmentChange() {
    const deptId = this.registerForm.get('department')?.value;
    console.log('Department changed to:', deptId);
    console.log('All classes:', this.allClasses);

    if (!deptId) {
      this.filteredClasses = this.allClasses;
    } else {
      this.filteredClasses = this.allClasses.filter(c => {
        const classDeptId = c.department?._id || c.department;
        return classDeptId === deptId;
      });
    }

    console.log('Filtered classes:', this.filteredClasses);
    this.cdr.detectChanges();
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  updateValidators(role: string) {
    const cinControl = this.registerForm.get('cin');
    const birthDateControl = this.registerForm.get('birthDate');
    const genderControl = this.registerForm.get('gender');
    const deptControl = this.registerForm.get('department');

    // Student specific controls
    const classControl = this.registerForm.get('classGroup');
    const levelControl = this.registerForm.get('level');
    const groupControl = this.registerForm.get('group');

    // Staff specific controls
    // const gradeControl = this.registerForm.get('grade');
    // const specialityControl = this.registerForm.get('speciality');

    // Reset validators first
    cinControl?.clearValidators();
    birthDateControl?.clearValidators();
    genderControl?.clearValidators();
    deptControl?.clearValidators();
    classControl?.clearValidators();
    levelControl?.clearValidators();
    groupControl?.clearValidators();

    if (role === 'student' || role === 'staff') {
      // Common required fields for Student & Staff
      cinControl?.setValidators([Validators.required, Validators.pattern(/^\d{8}$/)]);
      birthDateControl?.setValidators([Validators.required]);
      genderControl?.setValidators([Validators.required]);
      deptControl?.setValidators([Validators.required]);
    }

    if (role === 'student') {
      // Student specific required fields
      // classControl?.setValidators([Validators.required]); // Optional: make class required
      // levelControl?.setValidators([Validators.required]);
      // groupControl?.setValidators([Validators.required]);
    }

    if (role === 'admin') {
      // Admin might not need these specific fields
    }

    // Update validity
    cinControl?.updateValueAndValidity();
    birthDateControl?.updateValueAndValidity();
    genderControl?.updateValueAndValidity();
    deptControl?.updateValueAndValidity();
    classControl?.updateValueAndValidity();
    levelControl?.updateValueAndValidity();
    groupControl?.updateValueAndValidity();
  }

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
    this.loginSubmitted = false;
    this.registerSubmitted = false;
    this.cdr.detectChanges();
  }

  onLogin() {
    this.loginSubmitted = true;
    if (this.loginForm.invalid) {
      this.errorMessage = 'Identifiant ou mot de passe incorrect.';
      this.markFormGroupTouched(this.loginForm);
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges(); // Direct update
      }))
      .subscribe({
        next: (response) => {
          console.log('Login success:', response);
          this.successMessage = 'Connexion réussie ! Redirection en cours...';
          this.errorMessage = '';
          this.cdr.detectChanges();
          const user = response.user;
          setTimeout(() => {
            if (user && user.role === 'admin') {
              this.router.navigate(['/admin']);
            } else if (user && (user.role === 'staff' || user.role === 'chef')) {
              this.router.navigate(['/staff']);
            } else if (user && user.role === 'student') {
              this.router.navigate(['/student']);
            } else {
              this.router.navigate(['/']);
            }
          }, 1500);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.successMessage = '';
          this.errorMessage = error.error?.message || error.message || 'Identifiant ou mot de passe incorrect.';
          this.cdr.detectChanges(); // Important: Show the error immediately
        }
      });
  }

  onRegister() {
    this.registerSubmitted = true;
    console.log('Register form values:', this.registerForm.value);
    if (this.registerForm.invalid) {
      console.warn('Register form invalid:', this.registerForm.errors);
      this.errorMessage = 'Veuillez remplir correctement tous les champs requis.';
      this.markFormGroupTouched(this.registerForm);
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (user) => {
          console.log('Register success:', user);
          this.successMessage = 'Inscription réussie ! Redirection en cours...';
          this.errorMessage = '';
          this.cdr.detectChanges();
          setTimeout(() => {
            if (user && user.role === 'admin') {
              this.router.navigate(['/admin']);
            } else if (user && (user.role === 'staff' || user.role === 'chef')) {
              this.router.navigate(['/staff']);
            } else if (user && user.role === 'student') {
              this.router.navigate(['/student']);
            } else {
              this.router.navigate(['/']);
            }
          }, 2000);
        },
        error: (error) => {
          console.error('Register error:', error);
          this.errorMessage = error.error?.message || error.message || 'Erreur lors de l\'inscription. Veuillez réessayer.';
          this.cdr.detectChanges();
        }
      });
  }

  socialLogin(provider: 'google' | 'microsoft') {
    this.isLoading = true;
    this.authService.socialLogin(provider)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (user) => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = `Erreur de connexion avec ${provider}.`;
          this.cdr.detectChanges();
        }
      });
  }

  forgotPassword() {
    const email = prompt('Entrez votre email académique pour réinitialiser votre mot de passe:');
    if (email && email.includes('@isetk.rnu.tn')) {
      this.successMessage = 'Un lien de réinitialisation a été envoyé à votre email.';
    } else if (email) {
      this.errorMessage = 'Veuillez utiliser votre email académique @isetk.rnu.tn';
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  openOfficialPortal() {
    window.open('https://isetkairouan.edx.tn/login.faces', '_blank', 'noopener,noreferrer');
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get loginFormControls() {
    return this.loginForm.controls;
  }

  get registerFormControls() {
    return this.registerForm.controls;
  }
}
