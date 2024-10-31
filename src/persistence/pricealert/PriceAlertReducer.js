import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';

const PriceAlertReducer = createSlice({
    name: 'priceAlert',
    initialState: {
        alerts: [],
        coins: [],
    },
    reducers: {
        getCoinListSuccess(state, {payload}) {
            state.coins = payload;
        },
        getPriceAlertListSuccess(state, {payload}) {
            state.alerts = payload;
        },
        addPriceAlertSuccess(state, {payload}) {
            state.alerts = [...state.alerts, payload];
        },
        removePriceAlertSuccess(state, {payload}) {
            state.alerts = _.filter([...state.alerts], function (alert) {
                return alert.id !== payload;
            });
        },
    },
});
// Extract the action creators object and the reducer
const {actions, reducer} = PriceAlertReducer;
// Extract and export each action creator by name
export const {
    getPriceAlertListSuccess,
    addPriceAlertSuccess,
    removePriceAlertSuccess,
    getCoinListSuccess,
} = actions;
// Export the reducer, either as a default or named export
export default reducer;
