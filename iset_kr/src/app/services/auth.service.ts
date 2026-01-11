import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  matricule: string;
  role: string;
  department?: any;
  classGroup?: any;
  level?: string;
  group?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterData {
  fullName: string;
  matricule: string;
  email: string;
  phone: string;
  cin?: string;
  birthDate?: string;
  gender?: 'Homme' | 'Femme';
  password: string;
  role: 'student' | 'admin' | 'staff';
  department?: string;
  classGroup?: string;
  level?: string;
  group?: 'A' | 'B';
  grade?: string;
  speciality?: string;
  office?: string;
  assignedClasses?: string[];
  subjects?: string[];
  confirmPassword: string;
  acceptTerms: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  private apiUrl = 'api/auth'; // À remplacer par votre API réelle

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const userData = localStorage.getItem('currentUser');
        const sessionData = sessionStorage.getItem('currentUser');
        const userStr = userData || sessionData;

        if (userStr && userStr !== 'undefined' && userStr !== 'null') {
          const user = JSON.parse(userStr);
          // Validation de base : il faut au moins un nom et un rôle
          if (user && (user.role || user.name)) {
            this.currentUserSubject.next(user);
            console.log('Session restored for:', user.name, 'Role:', user.role);
          }
        }
      } catch (e) {
        console.error('Auth persistence error:', e);
        // Clear invalid data but DO NOT redirect to login to avoid loops on public pages
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      }
    }
  }

  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post<any>('/api/login', credentials).pipe(
      tap(response => {
        const user = response.user;
        if (isPlatformBrowser(this.platformId)) {
          if (credentials.rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          sessionStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
      })
    );
  }

  register(userData: RegisterData): Observable<any> {
    return this.http.post<any>('/api/register', userData).pipe(
      tap(response => {
        const user = response.user;
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          sessionStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    // On ne redirige que si on est dans le navigateur pour éviter des problèmes au build
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(['/login']);
    }
  }

  getCurrentUser(): User | null {
    let user = this.currentUserSubject.value;

    // Si l'état interne est vide, on tente un dernier check direct du storage (protection Refresh)
    if (!user && isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
      if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        try {
          user = JSON.parse(userStr);
          if (user) this.currentUserSubject.next(user);
        } catch (e) { return null; }
      }
    }
    return user;
  }

  updateProfile(id: string, data: any): Observable<any> {
    return this.http.put<any>(`/api/user/profile/${id}`, data).pipe(
      tap(response => {
        const updatedUser = response.user;
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  changePassword(id: string, data: any): Observable<any> {
    return this.http.put<any>(`/api/user/password/${id}`, data);
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  // Metadata for registration
  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>('/api/public/departments');
  }

  getClasses(): Observable<any[]> {
    return this.http.get<any[]>('/api/public/classes');
  }

  getModules(): Observable<any[]> {
    return this.http.get<any[]>('/api/public/modules');
  }

  // Pour le SSO
  socialLogin(provider: 'google' | 'microsoft'): Observable<User> {
    // Implémentation SSO
    return of({
      id: '3',
      name: 'Utilisateur SSO',
      email: `sso@${provider}.com`,
      matricule: 'SSO001',
      role: 'student'
    }).pipe(
      tap(user => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
      })
    );
  }
}
