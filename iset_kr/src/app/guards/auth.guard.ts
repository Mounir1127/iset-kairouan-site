import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    canActivate(): boolean {
        if (this.authService.isAuthenticated()) {
            return true;
        }

        // SSR Safe: on laisse le serveur générer la page, le client fera la verif finale
        if (!isPlatformBrowser(this.platformId)) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}
