import {createSlice} from '@reduxjs/toolkit';

const BlogReducer = createSlice({
    name: 'blog',
    initialState: {
        blogs: [],
    },
    reducers: {
        getBlogsSuccess(state, {payload}) {
            state.blogs = payload;
        },
    },
});
// Extract the action creators object and the reducer
const {actions, reducer} = BlogReducer;
// Extract and export each action creator by name
export const {getBlogsSuccess} = actions;
// Export the reducer, either as a default or named export
export default reducer;
