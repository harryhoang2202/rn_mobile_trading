import {createSlice} from '@reduxjs/toolkit';

const TokenReducer = createSlice({
    name: 'token',
    initialState: {
        ALL: [],
        ETH: [],
        BSC: [],
        POLYGON: [],
        ARB: [],
    },
    reducers: {
        getAllTokensSuccess(state, {payload}) {
            const {ALL, ETH, BSC, POLYGON, ARB} = payload;
            state.ALL = ALL;
            state.ETH = ETH;
            state.BSC = BSC;
            state.POLYGON = POLYGON;
            state.ARB = ARB;
        },
    },
});
// Extract the action creators object and the reducer
const {actions, reducer} = TokenReducer;
// Extract and export each action creator by name
export const {getAllTokensSuccess} = actions;
// Export the reducer, either as a default or named export
export default reducer;
