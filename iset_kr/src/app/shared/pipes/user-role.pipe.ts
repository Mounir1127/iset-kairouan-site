import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userRole',
    standalone: true
})
export class UserRolePipe implements PipeTransform {
    transform(value: string | undefined): string {
        if (!value) return '';

        const roles: { [key: string]: string } = {
            'admin': 'Administrateur',
            'staff': 'Personnel',
            'student': 'Étudiant',
            'professor': 'Enseignant',
            'hod': 'Chef de Dept'
        };

        return roles[value.toLowerCase()] || value;
    }
}
