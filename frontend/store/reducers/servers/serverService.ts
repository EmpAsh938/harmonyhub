import { ServerBulkInterface, ServerManageInterface, ServerSliceInterface, ServerUpdateInterface, ServerUserInterface } from '@/types/interfaces/server';
import axios from 'axios';

// get all servers for user
export const getServers = async (token: string) => {
    const response = await axios.get(`${process.env.API_ENDPOINT}/api/servers/all`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}
// get all users for server
export const getMembers = async (serverData: ServerManageInterface) => {
    const response = await axios.get(`${process.env.API_ENDPOINT}/api/servers/${serverData.serverId}/members`, {
        headers: {
            Authorization: `Bearer ${serverData.token}`
        }
    });
    return response.data;
}
// get all servers for discovery
export const getDiscover = async (token: string) => {
    const response = await axios.get(`${process.env.API_ENDPOINT}/api/servers/discover`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}
// get all servers for discovery
export const getSearchServers = async (query: string) => {
    const response = await axios.get(`${process.env.API_ENDPOINT}/api/servers/discover/search?query=${query}`);
    return response.data;
}
// create new server for user
export const createServer = async (serverData: ServerSliceInterface) => {
    const response = await axios.post(`${process.env.API_ENDPOINT}/api/servers/`, {
        name: serverData.name,
        icon: serverData.icon,
        description: serverData.description,
    }, {
        headers: {
            Authorization: `Bearer ${serverData.token}`
        }
    });
    return response.data;
}
// Update server
export const updateServer = async (serverData: ServerUpdateInterface) => {
    const response = await axios.post(`${process.env.API_ENDPOINT}/api/servers/${serverData.serverId}`, {
        name: serverData.name,
        icon: serverData.icon,
        description: serverData.description,
    }, {
        headers: {
            Authorization: `Bearer ${serverData.token}`
        }
    });
    return response.data;
}
// Delete server
export const deleteServer = async (serverData: ServerManageInterface) => {
    const response = await axios.delete(`${process.env.API_ENDPOINT}/api/servers/${serverData.serverId}`, {
        headers: {
            Authorization: `Bearer ${serverData.token}`
        }
    });
    return response.data;
}
// Join server
export const joinServer = async (serverData: ServerBulkInterface) => {
    const response = await axios.post(`${process.env.API_ENDPOINT}/api/servers/${serverData.serverId}/join`, {
        serverId: serverData.serverId,
        users: serverData.users,
    }, {
        headers: {
            Authorization: `Bearer ${serverData.token}`
        }
    });
    return response.data;
}
// Remove user from server
export const removeUser = async (serverData: ServerUserInterface) => {
    const response = await axios.post(`${process.env.API_ENDPOINT}/api/servers/${serverData.serverId}/remove`, {
        serverId: serverData.serverId,
        userId: serverData.userId
    }, {
        headers: {
            Authorization: `Bearer ${serverData.token}`
        }
    });
    return response.data;
}