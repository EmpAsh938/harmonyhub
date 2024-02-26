import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { createServer, deleteServer, getDiscover, getMembers, getSearchServers, getServers, joinServer, removeUser, updateServer } from "./serverService";
import { ServerBulkInterface, ServerInterface, ServerManageInterface, ServerSliceInterface, ServerUpdateInterface, ServerUserInterface } from "@/types/interfaces/server";
import { UserInterface } from "@/types/interfaces/user";

interface ServerSliceState {
    servers: ServerInterface[];
    loading: boolean;
    isError: boolean;
    message: string | null;
    discoverServers: ServerInterface[];
    members: UserInterface[];
}

const initialState: ServerSliceState = {
    servers: [],
    loading: false,
    isError: false,
    message: null,
    discoverServers: [],
    members: [],
}


export const getAllServers = createAsyncThunk(
    'server/getAllServers',
    async (token: string, thunkAPI) => {
        try {
            return await getServers(token);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const getAllMembers = createAsyncThunk(
    'server/getAllMembers',
    async (serverData: ServerManageInterface, thunkAPI) => {
        try {
            return await getMembers(serverData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const getDiscoverServers = createAsyncThunk(
    'server/getDiscoverServers',
    async (token: string, thunkAPI) => {
        try {
            return await getDiscover(token);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const getSearch = createAsyncThunk(
    'server/getSearch',
    async (query: string, thunkAPI) => {
        try {
            return await getSearchServers(query);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const createServerForUser = createAsyncThunk(
    'server/createServer',
    async (serverData: ServerSliceInterface, thunkAPI) => {
        try {
            return await createServer(serverData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const updateServerForUser = createAsyncThunk(
    'server/updateServer',
    async (serverData: ServerUpdateInterface, thunkAPI) => {
        try {
            return await updateServer(serverData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const deleteServerForUser = createAsyncThunk(
    'server/deleteServer',
    async (serverData: ServerManageInterface, thunkAPI) => {
        try {
            return await deleteServer(serverData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const joinToServer = createAsyncThunk(
    'server/joinServer',
    async (serverData: ServerBulkInterface, thunkAPI) => {
        try {
            return await joinServer(serverData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const removeFromServer = createAsyncThunk(
    'server/removeUser',
    async (serverData: ServerUserInterface, thunkAPI) => {
        try {
            return await removeUser(serverData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const serverSlice = createSlice({
    name: 'server',
    initialState,
    reducers: {
        manageServerMessage: (state, action) => {
            const { isError, message } = action.payload;
            state.isError = isError;
            state.message = message;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getAllServers.pending, (state) => {
                state.loading = true;
                state.message = null;
            })
            .addCase(getAllServers.fulfilled, (state, action) => {
                state.loading = false;
                state.servers = action.payload.result;
            })
            .addCase(getAllServers.rejected, (state, action) => {
                state.loading = false;
                // state.isError = true;
                // state.message = action.payload as string;
            })
            .addCase(getAllMembers.pending, (state) => {
                // state.loading = true;
                state.message = null;
            })
            .addCase(getAllMembers.fulfilled, (state, action) => {
                // state.loading = false;
                state.members = action.payload.result;
            })
            .addCase(getAllMembers.rejected, (state, action) => {
                // state.loading = false;
                // state.isError = true;
                // state.message = action.payload as string;
            })
            .addCase(getDiscoverServers.pending, (state) => {
                state.loading = true;
                state.message = null;
            })
            .addCase(getDiscoverServers.fulfilled, (state, action) => {
                state.loading = false;
                state.discoverServers = action.payload.result;
            })
            .addCase(getDiscoverServers.rejected, (state, action) => {
                state.loading = false;
                // state.message = action.payload as string;
            })
            .addCase(getSearch.pending, (state) => {
                state.loading = true;
                state.message = null;
            })
            .addCase(getSearch.fulfilled, (state, action) => {
                state.loading = false;
                state.discoverServers = action.payload.result;
            })
            .addCase(getSearch.rejected, (state, action) => {
                state.loading = false;
                // state.message = action.payload as string;
            })
            .addCase(createServerForUser.pending, (state) => {
                state.loading = true;
                state.message = null;
            })
            .addCase(createServerForUser.fulfilled, (state, action) => {
                state.loading = false;
                state.servers = [...state.servers, action.payload.result];
            })
            .addCase(createServerForUser.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload as string;
            })
            .addCase(updateServerForUser.pending, (state) => {
                // state.loading = true;
                state.message = null;
            })
            .addCase(updateServerForUser.fulfilled, (state, action) => {
                state.loading = false;
                state.servers = state.servers.map(server => {
                    if (server._id == action.payload.result._id) {
                        server = action.payload.result;
                    }
                    return server;
                });
            })
            .addCase(updateServerForUser.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;

                state.message = action.payload as string;
            })
            .addCase(deleteServerForUser.pending, (state) => {
                state.loading = true;
                state.message = null;
            })
            .addCase(deleteServerForUser.fulfilled, (state, action) => {
                state.loading = false;
                state.servers = state.servers.filter(server => server._id != action.payload.result._id);
            })
            .addCase(deleteServerForUser.rejected, (state, action) => {
                state.loading = false;
                state.isError = true;

                state.message = action.payload as string;
            })
            .addCase(joinToServer.pending, (state) => {
                // state.loading = true;
                state.message = null;
            })
            .addCase(joinToServer.fulfilled, (state, action) => {
                const updatedServer = action.payload.result;
                const previousServerIndex = state.servers.findIndex(server => server._id === updatedServer._id);
                if (previousServerIndex !== -1) {
                    // If server exists, update it in servers array
                    state.servers[previousServerIndex] = updatedServer;
                } else {
                    // If server is new, add it to servers array
                    state.servers.push(updatedServer);
                    // Update discoverServers array as well if needed
                    state.discoverServers = state.discoverServers.map(server => {
                        if (server._id === updatedServer._id) {
                            return updatedServer;
                        }
                        return server;
                    });
                }

            })
            .addCase(joinToServer.rejected, (state, action) => {
                // state.loading = false;
                state.isError = true;

                state.message = action.payload as string;
            })
            .addCase(removeFromServer.pending, (state) => {
                state.message = null;
            })
            .addCase(removeFromServer.fulfilled, (state, action) => {
                state.servers = state.servers.filter(server => server._id !== action.payload.result._id);
                if (state.discoverServers.length > 0) {
                    state.discoverServers = state.discoverServers.map(server => {
                        if (server._id === action.payload.result._id) {
                            return action.payload.result;
                        }
                        return server;
                    })
                }

            })
            .addCase(removeFromServer.rejected, (state, action) => {
                state.message = action.payload as string;
                state.isError = true;

            })

    },
});

export const { manageServerMessage } = serverSlice.actions;
export default serverSlice.reducer;