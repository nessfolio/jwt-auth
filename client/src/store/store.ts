import { create } from 'zustand';
import { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";
import axios from 'axios';
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";

// Define the interface for the store
interface AuthState {
    user: IUser;
    isAuth: boolean;
    isLoading: boolean;
    setAuth: (bool: boolean) => void;
    setUser: (user: IUser) => void;
    setLoading: (bool: boolean) => void;
    login: (email: string, password: string) => Promise<void>;
    registration: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

// Create the Zustand store
export const useStore = create<AuthState>((set) => ({
    // Initial state
    user: {} as IUser,
    isAuth: false,
    isLoading: false,

    // Synchronous actions
    setAuth: (bool: boolean) => set({ isAuth: bool }),
    setUser: (user: IUser) => set({ user }),
    setLoading: (bool: boolean) => set({ isLoading: bool }),

    // Asynchronous actions
    login: async (email, password) => {
        try {
            const response = await AuthService.login(email, password);
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            set({ isAuth: true, user: response.data.user });
        } catch (e: any) {
            console.log(e.response?.data?.message);
        }
    },

    registration: async (email, password) => {
        try {
            const response = await AuthService.registration(email, password);
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            set({ isAuth: true, user: response.data.user });
        } catch (e: any) {
            console.log(e.response?.data?.message);
        }
    },

    logout: async () => {
        try {
            await AuthService.logout();
            localStorage.removeItem('token');
            set({ isAuth: false, user: {} as IUser });
        } catch (e: any) {
            console.log(e.response?.data?.message);
        }
    },

    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            set({ isAuth: true, user: response.data.user });
        } catch (e: any) {
            console.log(e.response?.data?.message);
        } finally {
            set({ isLoading: false });
        }
    }
}));