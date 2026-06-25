import { jwtDecode } from "jwt-decode";
import api from "./api";

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: UserDto;
}

export interface UserDto {
    id: number;
    name: string;
    email: string;
    role: string;
    messId: number;
}

class AuthService {
    async login(email: string, password: string):Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', { email, password });
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    }

    async register(name: string, email: string, password: string, messName: string) {
        const response = await api.post('/auth/register', { name, email, password, messName });
        return response.data;
    }

    async logout() {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    }

    async forgotPassword(email: string) {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    }

    async resetPassword(email: string, token: string, newPassword: string) {
        const response = await api.post('/auth/reset-password', { email, token, newPassword });
        return response.data;
    }

    async refreshToken(): Promise<{ data: { accessToken: string, refreshToken: string } }> {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error("No refresh token");
        }
        
        // Use raw axios or avoid interceptors to prevent infinite loop
        const response = await api.post<{ accessToken: string, refreshToken: string, user: UserDto }>('/auth/refresh', {
            refreshToken
        }, {
            _retry: true // Custom flag to prevent interceptor loop, or just handle in interceptor
        } as any);

        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
    }

    getCurrentUser(): UserDto | null {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    }

    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    isAuthenticated(): boolean {
        const token = this.getAccessToken();
        if (!token) return false;
        
        try {
            const decoded: any = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    }
}

export default new AuthService();
