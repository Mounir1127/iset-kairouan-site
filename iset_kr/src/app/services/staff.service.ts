import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StaffService {
    private baseUrl = '/api/staff';

    constructor(private http: HttpClient) { }

    // Modules
    getModules(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/modules`);
    }

    // Students
    getStudents(classGroupId?: string): Observable<any[]> {
        let params: any = {};
        if (classGroupId) params.classGroupId = classGroupId;
        return this.http.get<any[]>(`${this.baseUrl}/students`, { params });
    }

    // Grades
    getGrades(moduleId: string, classGroupId?: string): Observable<any[]> {
        const params: any = { moduleId };
        if (classGroupId) params.classGroupId = classGroupId;
        return this.http.get<any[]>(`${this.baseUrl}/grades`, { params });
    }

    updateGradesBulk(grades: any[]): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/grades/bulk`, { grades });
    }

    // Materials
    getMaterials(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/materials`);
    }


    uploadMaterial(data: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/materials`, data);
    }

    uploadMaterialWithFile(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/materials/upload`, formData);
    }

    // Claims
    getClaims(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/claims`);
    }

    updateClaim(id: string, data: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/claims/${id}`, data);
    }

    // Schedule
    getSchedule(staffId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/schedule`, { params: { staffId } });
    }

    // Stats
    getStats(staffId: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/stats`, { params: { staffId } });
    }
}
