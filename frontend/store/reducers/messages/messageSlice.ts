import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { createMessage, getMessages } from "./messageService";
import { MessageInterface, MessageSliceInterface } from "@/types/interfaces/message";

interface MessageSliceState {
    messages: MessageInterface[];
    loading: boolean;
    error: string | null;
    lastMessage: MessageInterface;
}

const initialState: MessageSliceState = {
    messages: [],
    loading: false,
    error: null,
    lastMessage: {} as MessageInterface,
}


export const getAllMessages = createAsyncThunk(
    'channel/getAllMessages',
    async (messageData: MessageSliceInterface, thunkAPI) => {
        try {
            return await getMessages(messageData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const createNewMessage = createAsyncThunk(
    'channel/createNewMessage',
    async (messageData: MessageSliceInterface, thunkAPI) => {
        try {
            return await createMessage(messageData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const channelSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        saveMessage: (state, action) => {
            state.messages = [...state.messages, action.payload];
        },
        clearLastMessage: (state) => {
            state.lastMessage = {} as MessageInterface;
        },
        clearMessages: (state) => {
            state.messages = [];
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getAllMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllMessages.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(action.payload.result)) {
                    state.messages = action.payload.result.reverse();
                }
            })
            .addCase(getAllMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createNewMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewMessage.fulfilled, (state, action) => {
                state.loading = false;
                // state.messages = [...state.messages, action.payload.result];
                state.lastMessage = action.payload.result;
            })
            .addCase(createNewMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

    },
});

export const { saveMessage, clearLastMessage, clearMessages } = channelSlice.actions;
export default channelSlice.reducer;