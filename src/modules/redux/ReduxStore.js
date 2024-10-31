import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import ThemeReducer from "@persistence/theme/ThemeReducer";
import UserReducer from "@persistence/user/UserReducer";
import CurrencyReducer from "@persistence/currency/CurrencyReducer";
import TokenReducer from "@persistence/token/TokenReducer";
import AppLockReducer from "@persistence/applock/AppLockReducer";
import WalletReducer from "@persistence/wallet/WalletReducer";
import MarketReducer from "@persistence/market/MarketReducer";
import WalletConnectReducer from "@persistence/walletconnect/WalletConnectReducer";
import FeeReducer from "@persistence/fee/FeeReducer";
import PriceReducer from "@persistence/price/PriceReducer";
import PriceAlertReducer from "@persistence/pricealert/PriceAlertReducer";
import NewsReducer from "@persistence/news/NewsReducer";
import BlogReducer from "@persistence/blog/BlogReducer";
import CardReducer from "@persistence/card/CardReducer";
import BalanceReducer from "@persistence/wallet/BalanceReducer";

const ReduxStore = configureStore({
  reducer: {
    ThemeReducer,
    UserReducer,
    CurrencyReducer,
    TokenReducer,
    AppLockReducer,
    WalletReducer,
    MarketReducer,
    WalletConnectReducer,
    FeeReducer,
    PriceReducer,
    PriceAlertReducer,
    NewsReducer,
    BlogReducer,
    CardReducer,
    BalanceReducer,
  },
  middleware: getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  }),
});
export default ReduxStore;
