import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { createChannel, deleteChannel, getChannels, getMembers, joinChannel, removeUser, updateChannel } from "./channelService";
import { ChannelBulkInterface, ChannelInterface, ChannelManageInterface, ChannelServerInterface, ChannelUserInterface, NewChannelInterface, UpdateChannelInterface } from "@/types/interfaces/channel";
import { UserInterface } from "@/types/interfaces/user";

interface ChannelSliceState {
    channels: ChannelInterface[];
    loading: boolean;
    error: string | null;
    activeChannel: ChannelInterface;
    members: UserInterface[];
}

const initialState: ChannelSliceState = {
    channels: [],
    loading: false,
    error: null,
    activeChannel: {} as ChannelInterface,
    members: [],
}


export const getAllChannels = createAsyncThunk(
    'channel/getAllChannels',
    async (channelData: ChannelServerInterface, thunkAPI) => {
        try {
            return await getChannels(channelData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const getAllMembers = createAsyncThunk(
    'channel/getAllMembers',
    async (channelData: ChannelManageInterface, thunkAPI) => {
        try {
            return await getMembers(channelData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const createNewChannel = createAsyncThunk(
    'channel/createNewChannel',
    async (channelData: NewChannelInterface, thunkAPI) => {
        try {
            return await createChannel(channelData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const updateUserChannel = createAsyncThunk(
    'channel/updateChannel',
    async (channelData: UpdateChannelInterface, thunkAPI) => {
        try {
            return await updateChannel(channelData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const deleteUserChannel = createAsyncThunk(
    'channel/deleteChannel',
    async (channelData: ChannelManageInterface, thunkAPI) => {
        try {
            return await deleteChannel(channelData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const joinToChannel = createAsyncThunk(
    'server/joinChannel',
    async (channelData: ChannelBulkInterface, thunkAPI) => {
        try {
            return await joinChannel(channelData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const removeFromChannel = createAsyncThunk(
    'server/removeUser',
    async (channelData: ChannelUserInterface, thunkAPI) => {
        try {
            return await removeUser(channelData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const channelSlice = createSlice({
    name: 'channel',
    initialState,
    reducers: {
        manageActiveChannel: (state, action) => {
            state.activeChannel = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getAllChannels.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllChannels.fulfilled, (state, action) => {
                state.loading = false;
                state.channels = action.payload.result;
            })
            .addCase(getAllChannels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getAllMembers.pending, (state, action) => {
                // state.loading = true;
                state.error = null;
            })
            .addCase(getAllMembers.fulfilled, (state, action) => {
                // state.loading = false;
                state.members = action.payload.result;
            })
            .addCase(getAllMembers.rejected, (state, action) => {
                // state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createNewChannel.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewChannel.fulfilled, (state, action) => {
                state.loading = false;
                state.channels = [...state.channels, action.payload.result];
            })
            .addCase(createNewChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateUserChannel.pending, (state, action) => {
                // state.loading = true;
                state.error = null;
            })
            .addCase(updateUserChannel.fulfilled, (state, action) => {
                state.loading = false;
                state.channels = state.channels.map(channel => {
                    if (channel._id == action.payload.result._id) {
                        channel = action.payload.result;
                    }
                    return channel;
                });
            })
            .addCase(updateUserChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteUserChannel.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUserChannel.fulfilled, (state, action) => {
                state.loading = false;
                state.channels = state.channels.filter(channel => channel._id != action.payload.result._id);
            })
            .addCase(deleteUserChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(joinToChannel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(joinToChannel.fulfilled, (state, action) => {
                state.loading = false;
                const previousChannel = state.channels.filter(channel => channel._id == action.payload.result._id);
                if (previousChannel) {
                    state.channels = state.channels.map(channel => {
                        if (channel._id == action.payload.result._id) {
                            return action.payload.result;
                        }
                        return channel;
                    })
                } else {
                    state.channels = [...state.channels, action.payload.result];
                }
            })
            .addCase(joinToChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(removeFromChannel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromChannel.fulfilled, (state, action) => {
                state.loading = false;
                state.channels = state.channels.map(channel => {
                    if (channel._id == action.payload.result._id) {
                        return action.payload.result;
                    }
                    return channel;
                })
            })
            .addCase(removeFromChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


    },
});

export const { manageActiveChannel } = channelSlice.actions;
export default channelSlice.reducer;