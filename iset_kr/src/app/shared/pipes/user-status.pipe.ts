import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userStatus',
    standalone: true
})
export class UserStatusPipe implements PipeTransform {
    transform(value: string | undefined): string {
        if (!value) return '';

        const statuses: { [key: string]: string } = {
            'active': 'Activé',
            'inactive': 'Désactivé',
            'pending': 'En attente'
        };

        return statuses[value.toLowerCase()] || value;
    }
}
