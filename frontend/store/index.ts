import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/reducers/auth/authSlice";
import userReducer from "@/store/reducers/user/userSlice";
import serverReducer from "@/store/reducers/servers/serverSlice";
import channelReducer from "@/store/reducers/channels/channelSlice";
import messageReducer from "@/store/reducers/messages/messageSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        server: serverReducer,
        channel: channelReducer,
        message: messageReducer,
    },
});


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

