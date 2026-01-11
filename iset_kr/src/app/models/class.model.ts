import { Department } from './department.model';

export interface Class {
    _id: string;
    name: string;
    department?: any;
    level?: number;
    section?: string;
}
