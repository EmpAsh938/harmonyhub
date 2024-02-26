import { ManageFriendInterface, SearchFriendsInterface, UpdateUserInterface } from '@/types/interfaces/user';
import axios from 'axios';

// Login user
export const getMe = async (token: string) => {
    const response = await axios.get(`${process.env.API_ENDPOINT}/api/users/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    // localStorage.setItem('user_db',JSON.stringify(response.data.result));
    return response.data;
}
// Update user
export const updateMe = async (userData: UpdateUserInterface) => {
    const response = await axios.put(`${process.env.API_ENDPOINT}/api/users/`, {
        username: userData.username,
        bio: userData.bio,
    }, {
        headers: {
            Authorization: `Bearer ${userData.token}`
        }
    });
    // localStorage.setItem('user_db',JSON.stringify(response.data.result));
    return response.data;
}
// Get Friends
export const getFriends = async (token: string) => {
    const response = await axios.get(`${process.env.API_ENDPOINT}/api/users/friends`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    // localStorage.setItem('user_db',JSON.stringify(response.data.result));
    return response.data;
}
// Manage Friends
export const manageFriends = async (userData: ManageFriendInterface) => {
    const response = await axios.post(`${process.env.API_ENDPOINT}/api/users/friends`, {
        friendId: userData.userId
    }, {
        headers: {
            Authorization: `Bearer ${userData.token}`
        }
    });
    // localStorage.setItem('user_db',JSON.stringify(response.data.result));
    return response.data;
}
// Search Friends
export const getSearch = async (searchParam: SearchFriendsInterface) => {
    const response = await axios.get(`${process.env.API_ENDPOINT}/api/users/friends/search?q=${searchParam.query}`, {
        headers: {
            Authorization: `Bearer ${searchParam.token}`
        }
    });
    // localStorage.setItem('user_db',JSON.stringify(response.data.result));
    return response.data;
}