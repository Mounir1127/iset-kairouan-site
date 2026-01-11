import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    canActivate(): boolean {
        let user = this.authService.getCurrentUser();

        // Si le sujet n'est pas encore peuplé (ex: refresh), on vérifie le storage directement
        if (!user && isPlatformBrowser(this.platformId)) {
            const userStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
            if (userStr) {
                try {
                    user = JSON.parse(userStr);
                } catch (e) {
                    console.error('Error parsing user in AdminGuard');
                }
            }
        }

        if (user && user.role === 'admin') {
            return true;
        }

        // Sur le serveur (SSR), on laisse passer car localStorage n'est pas accessible
        // La redirection finale se fera sur le navigateur si nécessaire.
        if (!isPlatformBrowser(this.platformId)) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}
