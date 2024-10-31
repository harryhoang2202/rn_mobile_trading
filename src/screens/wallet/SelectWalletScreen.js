import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import CommonText from "@components/commons/CommonText";
import FastImage from "react-native-fast-image";
import CommonImage from "@components/commons/CommonImage";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CommonFlatList from "@components/commons/CommonFlatList";
import CommonBackButton from "@components/commons/CommonBackButton";
import _ from "lodash";

import { WalletAction } from "@persistence/wallet/WalletAction";
import Balance from "@components/Balance";
import { Icons } from "@components/icons/Icons";
import LinearGradient from "react-native-linear-gradient";
import CommonTouchableHighlight from "@components/commons/CommonTouchableHightlight";
import CommonAppBar from "@components/commons/CommonAppBar";

export default function SelectWalletScreen({ navigation, route }) {
  const { action } = route.params;
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { activeWallet } = useSelector((state) => state.WalletReducer);
  const [data, setData] = useState([
    ...activeWallet.coins,
    ...activeWallet.tokens,
  ]);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      if (action === "SWAP") {
        const newData = [...activeWallet.coins, ...activeWallet.tokens];
        _.remove(newData, { symbol: "BTC" });
        _.remove(newData, { symbol: "TRX" });
        setData(newData);
      }
    })();
  }, [activeWallet.coins.length, activeWallet.tokens.length]);
  const renderItem = ({ item }) => {
    let img = {
      uri: item.logoURI,
      priority: FastImage.priority.normal,
      cache: FastImage.cacheControl.immutable,
    };
    if (item.thumb === "" || item.thumb === null) {
      img = require("@assets/images/token/no-photo.png");
    }
    return (
      <View style={[styles.itemContainer]}>
        <CommonTouchableHighlight
          onPress={() => {
            dispatch(WalletAction.setActiveAsset(item)).then(() => {
              if (action === "BUY") {
                navigation.navigate("WalletBuyScreen", {
                  coin: item,
                });
                return;
              }
              if (action === "SWAP") {
                navigation.navigate("SwapScreen", {
                  coin: item,
                });
                return;
              }
              if (action === "SEND") {
                if (item.chain === "BTC") {
                  navigation.navigate("BtcWalletSendScreen");
                } else if (item.chain === "TRON") {
                  navigation.navigate("TronWalletSendScreen");
                } else {
                  navigation.navigate("WalletSendScreen");
                }
                return;
              }
              if (action === "SEND_BULK") {
                if (item.chain === "BTC") {
                  navigation.navigate("BtcWalletBatchSendScreen");
                } else if (item.chain === "TRON") {
                  navigation.navigate("TronWalletBatchSendScreen");
                } else {
                  navigation.navigate("WalletBatchSendScreen");
                }
                return;
              }

              if (action === "RECEIVE") {
                navigation.navigate("WalletReceiveScreen", {
                  coin: item,
                });
              }
            });
          }}
        >
          <View style={styles.item}>
            <CommonImage style={styles.img} source={img} />
            <View style={styles.itemContent}>
              <View>
                <CommonText
                  style={[
                    styles.itemNetwork,
                    { color: theme.text, fontWeight: "500", fontSize: 18 },
                  ]}
                  numberOfLines={1}
                >
                  {item.chain} Network
                </CommonText>
                <CommonText
                  style={[
                    styles.itemName,
                    { color: theme.subText, fontSize: 14, fontWeight: "500" },
                  ]}
                  numberOfLines={1}
                >
                  {item.symbol}
                </CommonText>
              </View>
            </View>
            <View>
              <Balance
                style={[
                  styles.itemNetwork,
                  { color: theme.text, fontWeight: "500" },
                ]}
                symbol={item.symbol}
              >
                {item.balance}
              </Balance>
              <CommonText
                style={[styles.itemName, { color: theme.subText }]}
                numberOfLines={1}
              ></CommonText>
            </View>
          </View>
        </CommonTouchableHighlight>
      </View>
    );
  };
  const searchCoin = (text) => {
    let coinsList = data;
    if (text.length === 0) {
      setData([...activeWallet.coins, ...activeWallet.tokens]);
      return;
    }
    if (text.length < searchText.length) {
      coinsList = [...activeWallet.coins, ...activeWallet.tokens];
    }
    setSearchText(text);
    const newData = coinsList.filter((item) => {
      const itemData = `${item.name.toUpperCase()}
      ${item.symbol.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    setData(newData);
  };
  return (
    <LinearGradient
      colors={theme.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <CommonAppBar title="Wallet" />
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: theme.container3 },
          ]}
        >
          <TextInput
            style={[
              styles.search,
              {
                color: theme.text,
                fontWeight: "500",
                fontSize: 12,
              },
            ]}
            autoCorrect={false}
            placeholderTextColor={theme.subText2}
            onChangeText={(text) => searchCoin(text)}
            placeholder={t("search.search_tokens")}
          />
        </View>
        <View height={10} />
        <View style={{ flex: 1 }}>
          <CommonFlatList
            data={data}
            renderItem={renderItem}
            itemHeight={80}
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  footer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  customBtn: {
    //backgroundColor: Colors.darker,
    borderWidth: 0,
  },
  itemContainer: {
    marginBottom: 10,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  item: {
    height: 70,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  img: {
    width: 42,
    height: 42,
    marginRight: 0,
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 100,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    marginLeft: 10,
    fontSize: 14,
  },
  itemSymbol: {
    flex: 1,
    //color: Colors.lighter,
    marginLeft: 10,
    fontSize: 13,
    textAlign: "right",
  },
  searchContainer: {
    flexDirection: "row",

    paddingHorizontal: 15,
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  search: {
    paddingHorizontal: 10,
    height: 36,
    borderRadius: 5,
    width: "100%",
  },
  close: {
    flex: 1.2,
    height: 43,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
    borderTopEndRadius: 5,
    borderBottomEndRadius: 5,
  },
  choose_network: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 15,
    marginBottom: 25,
  },
  chooseItem: {
    height: 40,
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 5,
    justifyContent: "center",
    borderBottomWidth: 0.5,
  },
  chooseItemText: {
    fontWeight: "bold",
  },
  portfolioHeader: {
    height: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  rightHeader: {
    width: 30,
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  screenTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  itemNetwork: {
    marginLeft: 10,
    fontSize: 18,
  },
  switcher: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  itemDesc: {
    marginLeft: 10,
    justifyContent: "flex-start",
  },
  itemPrice: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
});
