import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { FormationsComponent } from './pages/formations/formations.component';
import { ServicesComponent } from './pages/services/services.component';
import { CertificationsComponent } from './pages/certifications/certifications.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminLayoutComponent } from './pages/admin/layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './pages/admin/users/admin-users.component';
import { AdminAcademicComponent } from './pages/admin/academic/admin-academic.component';
import { AdminStructureComponent } from './pages/admin/structure/admin-structure.component';
import { AdminNewsComponent } from './pages/admin/news/admin-news.component';
import { AdminMessagesComponent } from './pages/admin/messages/admin-messages.component';
import { AdminSettingsComponent } from './pages/admin/settings/admin-settings.component';
import { StaffGuard } from './guards/staff.guard';
import { StaffLayoutComponent } from './pages/staff/layout/staff-layout.component';
import { NewsListingComponent } from './pages/news-listing/news-listing.component';

import { StudentGuard } from './guards/student.guard';
import { StudentLayoutComponent } from './pages/student/layout/student-layout.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'actualites', component: NewsListingComponent },
    {
        path: 'departement/:id',
        loadComponent: () => import('./pages/department-detail/department-detail.component').then(c => c.DepartmentDetailComponent)
    },

    {
        path: 'formations',
        component: FormationsComponent
    },
    {
        path: 'services',
        component: ServicesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'certifications',
        component: CertificationsComponent,
        canActivate: [AuthGuard]
    },

    { path: 'contact', component: ContactComponent },

    // Student Routes
    {
        path: 'student',
        component: StudentLayoutComponent,
        canActivate: [StudentGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/student/dashboard/student-dashboard.component').then(c => c.StudentDashboardComponent)
            },
            {
                path: 'schedule',
                loadComponent: () => import('./pages/student/schedule/student-schedule.component').then(c => c.StudentScheduleComponent)
            },
            {
                path: 'grades',
                loadComponent: () => import('./pages/student/grades/student-grades.component').then(c => c.StudentGradesComponent)
            },
            {
                path: 'materials',
                loadComponent: () => import('./pages/student/materials/student-materials.component').then(c => c.StudentMaterialsComponent)
            }
        ]
    },

    // Admin Routes
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [AdminGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'users', component: AdminUsersComponent },
            { path: 'academic', component: AdminAcademicComponent },
            { path: 'structure', component: AdminStructureComponent },
            { path: 'news', component: AdminNewsComponent },
            { path: 'messages', component: AdminMessagesComponent },
            { path: 'settings', component: AdminSettingsComponent }
        ]
    },

    // Staff Routes
    {
        path: 'staff',
        component: StaffLayoutComponent,
        canActivate: [StaffGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/staff/dashboard/staff-dashboard.component').then(c => c.StaffDashboardComponent)
            },
            {
                path: 'students',
                loadComponent: () => import('./pages/staff/students/staff-students.component').then(c => c.StaffStudentsComponent)
            },
            {
                path: 'schedule',
                loadComponent: () => import('./pages/staff/schedule/staff-schedule.component').then(c => c.StaffScheduleComponent)
            },
            {
                path: 'materials',
                loadComponent: () => import('./pages/staff/materials/staff-materials.component').then(c => c.StaffMaterialsComponent)
            },
            {
                path: 'notes',
                loadComponent: () => import('./pages/staff/notes/staff-notes.component').then(c => c.StaffNotesComponent)
            },
            {
                path: 'announcements',
                loadComponent: () => import('./pages/staff/announcements/staff-announcements.component').then(c => c.StaffAnnouncementsComponent)
            },
            {
                path: 'claims',
                loadComponent: () => import('./pages/staff/claims/staff-claims.component').then(c => c.StaffClaimsComponent)
            }
        ]
    },

    { path: '**', redirectTo: '' }
];
