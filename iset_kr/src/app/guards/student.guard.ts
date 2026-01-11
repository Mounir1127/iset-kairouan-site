import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class StudentGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    canActivate(): boolean {
        let user = this.authService.getCurrentUser();

        if (!user && isPlatformBrowser(this.platformId)) {
            const userStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
            if (userStr) {
                try {
                    user = JSON.parse(userStr);
                } catch (e) {
                    console.error('Error parsing user in StudentGuard');
                }
            }
        }

        if (user && (user.role === 'student' || user.role === 'admin')) {
            return true;
        }

        // SSR Safe
        if (!isPlatformBrowser(this.platformId)) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}
