import {createSlice} from '@reduxjs/toolkit';

const NewsReducer = createSlice({
    name: 'news',
    initialState: {
        news: [],
    },
    reducers: {
        getNewsSuccess(state, {payload}) {
            state.news = payload;
        },
    },
});
// Extract the action creators object and the reducer
const {actions, reducer} = NewsReducer;
// Extract and export each action creator by name
export const {getNewsSuccess} = actions;
// Export the reducer, either as a default or named export
export default reducer;
