import { ChannelBulkInterface, ChannelManageInterface, ChannelServerInterface, ChannelUserInterface, NewChannelInterface, UpdateChannelInterface } from '@/types/interfaces/channel';
import axios from 'axios';

// get all channels for user
export const getChannels = async (channelData: ChannelServerInterface) => {
    const response = await axios.get(`${process.env.API_ENDPOINT}/api/channels/${channelData.serverId}`, {
        headers: {
            Authorization: `Bearer ${channelData.token}`
        }
    });
    return response.data;
}
// get all users
export const getMembers = async (channelData: ChannelManageInterface) => {
    const response = await axios.get(`${process.env.API_ENDPOINT}/api/channels/${channelData.channelId}/members`, {
        headers: {
            Authorization: `Bearer ${channelData.token}`
        }
    });
    return response.data;
}
// create channel
export const createChannel = async (channelData: NewChannelInterface) => {
    const response = await axios.post(`${process.env.API_ENDPOINT}/api/channels/`, {
        name: channelData.name,
        serverId: channelData.serverId,
        type: channelData.type,
        isPrivate: channelData.isPrivate,
    }, {
        headers: {
            Authorization: `Bearer ${channelData.token}`
        }
    });
    return response.data;
}
// update channel
export const updateChannel = async (channelData: UpdateChannelInterface) => {
    const response = await axios.put(`${process.env.API_ENDPOINT}/api/channels/${channelData.channelId}`, {
        name: channelData.name,
        type: channelData.type,
        isPrivate: channelData.isPrivate,
    }, {
        headers: {
            Authorization: `Bearer ${channelData.token}`
        }
    });
    return response.data;
}
// delete channel
export const deleteChannel = async (channelData: ChannelManageInterface) => {
    const response = await axios.delete(`${process.env.API_ENDPOINT}/api/channels/${channelData.channelId}`, {
        headers: {
            Authorization: `Bearer ${channelData.token}`
        }
    });
    return response.data;
}

// Join Channel
export const joinChannel = async (channelData: ChannelBulkInterface) => {
    const response = await axios.post(`${process.env.API_ENDPOINT}/api/channels/${channelData.channelId}/join`, {
        channelId: channelData.channelId,
        users: channelData.users,
    }, {
        headers: {
            Authorization: `Bearer ${channelData.token}`
        }
    });
    return response.data;
}
// Remove user from channel
export const removeUser = async (channelData: ChannelUserInterface) => {
    const response = await axios.post(`${process.env.API_ENDPOINT}/api/channels/${channelData.channelId}/remove`, {
        channelId: channelData.channelId,
        userId: channelData.userId
    }, {
        headers: {
            Authorization: `Bearer ${channelData.token}`
        }
    });
    return response.data;
}