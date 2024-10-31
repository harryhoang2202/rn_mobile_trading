import {createSlice} from '@reduxjs/toolkit';

const UserReducer = createSlice({
    name: 'user',
    initialState: {
        registered: false,
        loggedIn: false,
        data: {},
    },
    reducers: {
        getUserSuccess(state, {payload}) {
            state.data = payload.user;
            state.registered = payload.registered;
        },
        signInSuccess(state, {payload}) {
            state.loggedIn = true;
            state.data = payload;
            state.registered = true;
        },
        signOutSuccess(state, {payload}) {
            state.loggedIn = false;
        },
    },
});
// Extract the action creators object and the reducer
const {actions, reducer} = UserReducer;
// Extract and export each action creator by name
export const {getUserSuccess, signOutSuccess, signInSuccess} = actions;
// Export the reducer, either as a default or named export
export default reducer;
