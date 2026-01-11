export interface User {
  id: number;
  name: string;
  email: string;
  matricule: string;
  phone?: string;
  role: 'student' | 'teacher' | 'admin' | 'staff';
  department?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  fullName: string;
  matricule: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token?: string;
  message?: string;
}
