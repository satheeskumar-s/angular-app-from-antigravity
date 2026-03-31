export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  firstName: string;
  lastName: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}
