import { createSlice } from "@reduxjs/toolkit";

type SidebarState = {
    isSidebarOpen: boolean;
}

const initialState: SidebarState = {
    isSidebarOpen: false,
}

export const sidebarSlice = createSlice({
    name: 'Sidebar',
    initialState,
    reducers: {
        handleSidebar: (state, action) => {
            state.isSidebarOpen = action.payload.status;
        }
    }
});

export const { handleSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;