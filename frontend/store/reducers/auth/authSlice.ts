import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { login, logout, register } from "@/store/reducers/auth/authService";
import { LoginUserInterface, RegisterUserInterface, UserInterface } from "@/types/interfaces/user";

interface AuthState {
    token: string;
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
    user: UserInterface;
}

// Function to retrieve token from localStorage
const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token') || '';
    }
    return '';
};

const initialState: AuthState = {
    token: getAuthToken(),
    isLoading: false,
    isError: false,
    errorMessage: '',
    user: {} as UserInterface,
}


export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (user: LoginUserInterface, thunkAPI) => {
        try {
            return await login(user);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (user: RegisterUserInterface, thunkAPI) => {
        try {
            return await register(user);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (token: string, thunkAPI) => {
        try {
            return await logout(token);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        manageError: (state, action) => {
            const { status, message } = action.payload;
            state.isError = status;
            state.errorMessage = message;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            }).addCase(loginUser.fulfilled, (state, action) => {
                if (action.payload.success && action.payload.result) {
                    state.token = action.payload.result;
                    localStorage.setItem("token", state.token);
                }
                state.isLoading = false;
            }).addCase(loginUser.rejected, (state, action) => {
                if (typeof action.payload === 'string') {
                    state.errorMessage = action.payload;
                }
                state.isError = true;
                state.isLoading = false;
            })
            .addCase(registerUser.pending, (state,) => {
                state.isLoading = true;
            }).addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;

            }).addCase(registerUser.rejected, (state, action) => {
                if (typeof action.payload === 'string') {
                    state.errorMessage = action.payload;
                }
                state.isError = true;
                state.isLoading = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.token = "";
                state.user = {} as UserInterface;
                localStorage.clear();
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.token = "";
                // state.user = {} as UserInterface;
                // localStorage.clear();
                state.isError = true;
                if (typeof action.payload === 'string') {
                    state.errorMessage = action.payload;
                }

            })

    },
});

export const { manageError } = authSlice.actions;
export default authSlice.reducer;