import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private baseUrl = '/api/admin';

    constructor(private http: HttpClient) { }

    // Users
    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/users`);
    }

    updateUser(id: string, data: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/users/${id}`, data);
    }

    createUser(data: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/users`, data);
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/users/${id}`);
    }

    // Structure
    getDepartments(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/departments`);
    }

    createDepartment(data: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/departments`, data);
    }

    deleteDepartment(id: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/departments/${id}`);
    }

    updateDepartment(id: string, data: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/departments/${id}`, data);
    }

    getClasses(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/classes`);
    }

    createClass(data: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/classes`, data);
    }

    deleteClass(id: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/classes/${id}`);
    }

    // Modules & Grades
    getModules(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/modules`);
    }

    getGrades(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/grades`);
    }

    // Announcements (Events, Tenders, News)
    getAnnouncements(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/announcements`);
    }

    createAnnouncement(data: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/announcements`, data);
    }

    updateAnnouncement(id: string, data: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/announcements/${id}`, data);
    }

    deleteAnnouncement(id: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/announcements/${id}`);
    }

    // Dashboard
    getStats(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/stats`);
    }

    // Schedules
    getSchedules(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/schedules`);
    }

    createSchedule(data: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/schedules`, data);
    }

    deleteSchedule(id: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/schedules/${id}`);
    }

    // Subjects
    getSubjects(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/subjects`);
    }

    createSubject(data: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/subjects`, data);
    }

    deleteSubject(id: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/subjects/${id}`);
    }
}
