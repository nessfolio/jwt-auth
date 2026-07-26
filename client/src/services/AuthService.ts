import API from "@/src/http";
import {AxiosResponse} from "axios";
import {AuthResponse} from "@/src/models/response/AuthResponse";

export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return API.post<AuthResponse>('/login', {email, password})
    }

    static async registration(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return API.post<AuthResponse>('/registration', {email, password})
    }

    static async logout(): Promise<void> {
        return API.post('/logout')
    }
}