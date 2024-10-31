import { createSlice } from "@reduxjs/toolkit";

const BalanceReducer = createSlice({
  name: "balance",
  initialState: {
    currentBalance: 0,
    lastestBalanceUpdated: 0,
    updatedAt: Date.now(),
    lastestUpdated: Date.now(),
    profit: "Gain: 0$",
    percentIncreases: 0,
  },
  reducers: {
    getBalanceInformations(state, { payload }) {
      state.currentBalance = payload.activeWallet.totalBalance;
      state.updatedAt = Date.now();
      const isDifferentDay = lastestUpdated.getDate() !== updatedAt.getDate();
      if (isDifferentDay) {
        state.lastestUpdated = state.updatedAt;
        state.lastestBalanceUpdated = state.currentBalance;
      }

      if (state.currentBalance - state.lastestBalanceUpdated >= 0) {
        state.profit = `Gain: ${
          state.currentBalance - state.lastestBalanceUpdated
        }$`;
      } else {
        state.profit = `Loss: ${
          state.lastestBalanceUpdated - state.currentBalance
        }$`;
      }
      if (state.lastestBalanceUpdated != 0) {
        const currentBalance = state.currentBalance;
        const lastestBalanceUpdated = state.lastestBalanceUpdated;
        const percentageChange =
          ((currentBalance - lastestBalanceUpdated) / lastestBalanceUpdated) *
          100;
        const roundedPercentageChange =
          Math.round(percentageChange * 100) / 100;
        state.percentIncreases = roundedPercentageChange;
      } else {
        state.percentIncreases = 0;
      }
    },
  },
});
const { actions, reducer } = BalanceReducer;

export const { getBalanceInformations } = actions;

export default reducer;
