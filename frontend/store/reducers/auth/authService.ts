import { LoginUserInterface, RegisterUserInterface } from '@/types/interfaces/user';
import axios from 'axios';

// Login user
export const login = async (user: LoginUserInterface) => {
    const response = await axios.post(`${process.env.API_ENDPOINT}/api/auth/login`, user);
    return response.data;
}

// Register user
export const register = async (user: RegisterUserInterface) => {
    const response = await axios.post(`${process.env.API_ENDPOINT}/api/auth/register`, user);
    return response.data;
}

// Logout user
export const logout = async (token: string) => {
    const response = await axios.post(`${process.env.API_ENDPOINT}/api/auth/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}