import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    private app: FirebaseApp;
    public auth: Auth;
    public db: Firestore;
    public storage: FirebaseStorage;
    public analytics: Analytics | null = null;

    constructor() {
        // Initialize Firebase
        this.app = initializeApp(environment.firebase);

        // Initialize services
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);
        this.storage = getStorage(this.app);

        // Initialize Analytics (only in browser)
        if (typeof window !== 'undefined') {
            try {
                this.analytics = getAnalytics(this.app);
            } catch (error) {
                console.warn('Firebase Analytics not available:', error);
            }
        }
    }

    getApp(): FirebaseApp {
        return this.app;
    }
}
