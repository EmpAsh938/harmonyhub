import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { ManageFriendInterface, SearchFriendsInterface, UpdateUserInterface, UserInterface } from "@/types/interfaces/user";
import { getMe, getFriends, getSearch, manageFriends, updateMe } from "./userService";


type UserState = {
    user: UserInterface;
    message: string;
}

const initialState: UserState = {
    user: {} as UserInterface,
    message: "",
}


export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (_, thunkAPI) => {
        try {
            // return await login();
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getUser = createAsyncThunk(
    'user/getUser',
    async (token: string, thunkAPI) => {
        try {
            return await getMe(token);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const updateUser = createAsyncThunk(
    'user/updateUser',
    async (userData: UpdateUserInterface, thunkAPI) => {
        try {
            return await updateMe(userData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const getFriendsList = createAsyncThunk(
    'user/getFriendsList',
    async (token: string, thunkAPI) => {
        try {
            return await getFriends(token);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const manageFriendsList = createAsyncThunk(
    'user/manageFriendsList',
    async (userData: ManageFriendInterface, thunkAPI) => {
        try {
            return await manageFriends(userData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const getSearchFriendList = createAsyncThunk(
    'user/getSearchFriendsList',
    async (searchParam: SearchFriendsInterface, thunkAPI) => {
        try {
            return await getSearch(searchParam);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers(builder) {
        builder
            .addCase(getUser.pending, (state, action) => {
                // console.log(action.payload);
            }).addCase(getUser.fulfilled, (state, action) => {
                state.user = action.payload.result;

            }).addCase(getUser.rejected, (state, action) => {
                // console.log(action.payload);

            })
            .addCase(updateUser.pending, (state, action) => {
                // console.log(action.payload);
            }).addCase(updateUser.fulfilled, (state, action) => {
                state.user = action.payload.result;

            }).addCase(updateUser.rejected, (state, action) => {
                // console.log(action.payload);

            })
            .addCase(getFriendsList.pending, (state, action) => {
                // console.log(action.payload);
            })
            .addCase(getFriendsList.fulfilled, (state, action) => {
                state.user.friends = action.payload.result;

            })
            .addCase(getFriendsList.rejected, (state, action) => {
                // console.log(action.payload);

            })
            .addCase(manageFriendsList.pending, (state, action) => {
                // console.log(action.payload);
            })
            .addCase(manageFriendsList.fulfilled, (state, action) => {
                state.user.friends = action.payload.result.friends;

            })
            .addCase(manageFriendsList.rejected, (state, action) => {
                // console.log(action.payload);

            })
            .addCase(getSearchFriendList.pending, (state, action) => {
                // console.log(action.payload);
            })
            .addCase(getSearchFriendList.fulfilled, (state, action) => {
                state.user.friends = action.payload.result;

            })
            .addCase(getSearchFriendList.rejected, (state, action) => {
                // console.log(action.payload);

            })

    },
});

export const { } = userSlice.actions;
export default userSlice.reducer;