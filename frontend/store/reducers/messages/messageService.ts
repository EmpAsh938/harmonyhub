import { MessageSliceInterface } from '@/types/interfaces/message';
import axios from 'axios';

// get all channels for user
export const getMessages = async (messageData: MessageSliceInterface) => {
    const response = await axios.get(`${process.env.API_ENDPOINT}/api/messages/${messageData.channelId}`, {
        headers: {
            Authorization: `Bearer ${messageData.token}`
        }
    });
    return response.data;
}
// create channel
export const createMessage = async (messageData: MessageSliceInterface) => {
    const response = await axios.post(`${process.env.API_ENDPOINT}/api/messages/`, {
        channelId: messageData.channelId,
        content: messageData.content,
        media: messageData.media,
    }, {
        headers: {
            Authorization: `Bearer ${messageData.token}`
        }
    });
    return response.data;
}