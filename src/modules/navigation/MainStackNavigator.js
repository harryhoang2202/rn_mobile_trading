import React, { useEffect } from "react";
import TokenScreen from "@screens/token/TokenScreen";
import SelectWalletScreen from "@screens/wallet/SelectWalletScreen";
import WalletReceiveScreen from "@screens/wallet/WalletReceiveScreen";
import WalletSendScreen from "@screens/wallet/WalletSendScreen";
import BtcWalletSendScreen from "@screens/wallet/BtcWalletSendScreen";
import SwapScreen from "@screens/swap/SwapScreen";
import SelectTokenScreen from "@screens/swap/SelectTokenScreen";
import BottomTabBarNavigator from "@modules/navigation/BottomTabBarNavigator";
import AccountScreen from "@screens/account/AccountScreen";
import AddAccountStep1Screen from "@screens/account/AddAccountStep1Screen";
import AddAccountStep2Screen from "@screens/account/AddAccountStep2Screen";
import AddAccountStep4Screen from "@screens/account/AddAccountStep4Screen";
import AddAccountStep3Screen from "@screens/account/AddAccountStep3Screen";
import AddAccountStep5Screen from "@screens/account/AddAccountStep5Screen";
import AccountDetailScreen from "@screens/account/AccountDetailScreen";
import ReEnterPinCodeScreen from "@screens/pincode/ReEnterPinCodeScreen";
import WalletDetailScreen from "@screens/wallet/WalletDetailScreen";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import MarketDetailScreen from "@screens/market/MarketDetailScreen";
import SecurityScreen from "@screens/setting/SecurityScreen";
import PreferencesScreen from "@screens/setting/PreferencesScreen";
import LanguageScreen from "@screens/setting/LanguageScreen";
import CurrencyScreen from "@screens/setting/CurrencyScreen";
import WalletBuyScreen from "@screens/wallet/WalletBuyScreen";
import TronWalletSendScreen from "@screens/wallet/TronWalletSendScreen";
import AddTokenScreen from "@screens/token/AddTokenScreen";
import SelectNetworkScreen from "@screens/token/SelectNetworkScreen";
import DAppsDetailScreen from "@screens/dapps/DAppsDetailScreen";
import WalletBatchSendScreen from "@screens/wallet/WalletBatchSendScreen";
import TronWalletBatchSendScreen from "@screens/wallet/TronWalletBatchSendScreen";
import PriceAlertScreen from "@screens/pricealert/PriceAlertScreen";
import AddPriceAlertScreen from "@screens/pricealert/AddPriceAlertScreen";
import SelectPriceAlertScreen from "@screens/pricealert/SelectPriceAlertScreen";
import { TokenAction } from "@persistence/token/TokenAction";
import { FeeAction } from "@persistence/fee/FeeAction";
import { useDispatch } from "react-redux";
import WalletConnectScreen from "@screens/walletconnect/WalletConnectScreen";
import WalletConnectAddScreen from "@screens/walletconnect/WalletConnectAddScreen";
import NewsDetailScreen from "@screens/home/NewsDetailScreen";
import BlogDetailScreen from "@screens/blog/BlogDetailScreen";
import PriceAlertDetailScreen from "@screens/pricealert/PriceAlertDetailScreen";
import CardKycScreen from "@screens/card/CardKycScreen";
import CardDetailScreen from "@screens/card/CardDetailScreen";
import BuyCardScreen from "@screens/card/BuyCardScreen";
import MyCardDetailScreen from "@screens/card/MyCardDetailScreen";
import TopUpCardScreen from "@screens/card/TopUpCardScreen";

const Stack = createStackNavigator();

function MainStackNavigator() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(TokenAction.getAllTokens());
    dispatch(FeeAction.getFee());
  }, []);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="BottomTabBarNavigator"
        component={BottomTabBarNavigator}
      />
      <Stack.Screen name="TokenScreen" component={TokenScreen} />
      <Stack.Screen name="SelectWalletScreen" component={SelectWalletScreen} />
      <Stack.Screen
        name="WalletReceiveScreen"
        component={WalletReceiveScreen}
      />
      <Stack.Screen name="WalletSendScreen" component={WalletSendScreen} />
      <Stack.Screen
        name="BtcWalletSendScreen"
        component={BtcWalletSendScreen}
      />
      <Stack.Screen name="SwapScreen" component={SwapScreen} />
      <Stack.Screen name="SelectTokenScreen" component={SelectTokenScreen} />
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen
        name="AccountDetailScreen"
        component={AccountDetailScreen}
      />
      <Stack.Screen
        name="AddAccountStep1Screen"
        component={AddAccountStep1Screen}
      />
      <Stack.Screen
        name="AddAccountStep2Screen"
        component={AddAccountStep2Screen}
      />
      <Stack.Screen
        name="AddAccountStep3Screen"
        component={AddAccountStep3Screen}
      />
      <Stack.Screen
        name="AddAccountStep4Screen"
        component={AddAccountStep4Screen}
      />
      <Stack.Screen
        name="AddAccountStep5Screen"
        component={AddAccountStep5Screen}
      />
      <Stack.Screen
        name="ReEnterPinCodeScreen"
        component={ReEnterPinCodeScreen}
      />
      <Stack.Screen name="WalletDetailScreen" component={WalletDetailScreen} />
      <Stack.Screen name="MarketDetailScreen" component={MarketDetailScreen} />
      <Stack.Screen name="SecurityScreen" component={SecurityScreen} />
      <Stack.Screen name="PreferencesScreen" component={PreferencesScreen} />
      <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
      <Stack.Screen name="CurrencyScreen" component={CurrencyScreen} />
      <Stack.Screen name="WalletBuyScreen" component={WalletBuyScreen} />
      <Stack.Screen
        name="TronWalletSendScreen"
        component={TronWalletSendScreen}
      />
      <Stack.Screen name="AddTokenScreen" component={AddTokenScreen} />
      <Stack.Screen
        name="SelectNetworkScreen"
        component={SelectNetworkScreen}
      />
      <Stack.Screen name="DAppsDetailScreen" component={DAppsDetailScreen} />

      <Stack.Screen
        name="WalletBatchSendScreen"
        component={WalletBatchSendScreen}
      />
      <Stack.Screen
        name="TronWalletBatchSendScreen"
        component={TronWalletBatchSendScreen}
      />
      <Stack.Screen name="PriceAlertScreen" component={PriceAlertScreen} />
      <Stack.Screen
        name="SelectPriceAlertScreen"
        component={SelectPriceAlertScreen}
      />

      <Stack.Screen
        name="AddPriceAlertScreen"
        component={AddPriceAlertScreen}
      />
      <Stack.Screen
        name="WalletConnectScreen"
        component={WalletConnectScreen}
      />
      <Stack.Screen
        name="WalletConnectAddScreen"
        component={WalletConnectAddScreen}
      />
      <Stack.Screen name="NewsDetailScreen" component={NewsDetailScreen} />
      <Stack.Screen name="BlogDetailScreen" component={BlogDetailScreen} />
      <Stack.Screen
        name="PriceAlertDetailScreen"
        component={PriceAlertDetailScreen}
      />
      <Stack.Screen name="CardKycScreen" component={CardKycScreen} />
      <Stack.Screen name="CardDetailScreen" component={CardDetailScreen} />
      <Stack.Screen name="BuyCardScreen" component={BuyCardScreen} />
      <Stack.Screen name="MyCardDetailScreen" component={MyCardDetailScreen} />
      <Stack.Screen name="TopUpCardScreen" component={TopUpCardScreen} />
    </Stack.Navigator>
  );
}

export default MainStackNavigator;
