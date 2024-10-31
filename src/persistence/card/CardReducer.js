import { createSlice } from "@reduxjs/toolkit";

const CardReducer = createSlice({
  name: "card",
  initialState: {
    cards: [],
    cardTypes: [],
  },
  reducers: {
    getCardsSuccess(state, { payload }) {
      state.cards = payload;
    },
    getCardTypesSuccess(state, { payload }) {
      state.cardTypes = payload;
    },
  },
});
// Extract the action creators object and the reducer
const { actions, reducer } = CardReducer;
// Extract and export each action creator by name
export const { getCardsSuccess, getCardTypesSuccess } = actions;
// Export the reducer, either as a default or named export
export default reducer;
