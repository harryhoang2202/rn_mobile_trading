import React, { useEffect, useState } from "react";
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import CommonText from "@components/commons/CommonText";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import FastImage from "react-native-fast-image";
import CommonImage from "@components/commons/CommonImage";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { sleep } from "@src/utils/ThreadUtil";
import _ from "lodash";
import CommonFlatList from "@components/commons/CommonFlatList";
import TokenSwitcher from "@components/TokenSwitcher";
import CommonBackButton from "@components/commons/CommonBackButton";
import { CHAIN_ID_TYPE_MAP } from "@modules/core/constant/constant";
import CommonLoading from "@components/commons/CommonLoading";
import { WalletAction } from "@persistence/wallet/WalletAction";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";

export default function TokenScreen({ navigation, route }) {
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { activeWallet } = useSelector((state) => state.WalletReducer);
  const { ALL } = useSelector((state) => state.TokenReducer);
  const [data, setData] = useState(ALL);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      setData(ALL);
    })();
  }, [ALL?.length]);
  useEffect(() => {
    (async () => {})();
  }, []);

  const addAsset = (item) => {
    CommonLoading.show();
    dispatch(WalletAction.addAsset(item)).then(() => {
      CommonLoading.hide();
    });
  };
  const removeWallet = (item) => {
    CommonLoading.show();
    dispatch(WalletAction.removeAsset(item)).then(() => {
      CommonLoading.hide();
    });
  };
  const renderItem = ({ item }) => {
    let img = {
      uri: item.logoURI,
      priority: FastImage.priority.normal,
      cache: FastImage.cacheControl.immutable,
    };
    if (item.thumb === "" || item.thumb === null) {
      img = require("@assets/images/token/no-photo.png");
    }
    const asset = _.find(activeWallet.tokens, function (o) {
      return o.contract === item.address;
    });
    const enable = !_.isNil(asset);
    return (
      <View
        style={[styles.itemContainer, { backgroundColor: theme.container7 }]}
      >
        <View style={styles.item}>
          <CommonImage style={styles.img} source={img} />
          <View style={styles.itemContent}>
            <View>
              <CommonText
                style={[styles.itemName, { color: theme.text }]}
                numberOfLines={1}
              >
                {item.symbol}
              </CommonText>
              <CommonText
                style={[styles.itemNetwork, { color: theme.subText }]}
                numberOfLines={1}
              >
                {CHAIN_ID_TYPE_MAP[item.chainId]} Network
              </CommonText>
            </View>
            <CommonTouchableOpacity
              style={styles.switcher}
              onPress={async () => {
                Keyboard.dismiss();
                await sleep(200);
                if (enable) {
                  removeWallet(item);
                } else {
                  addAsset(item);
                }
              }}
            >
              <TokenSwitcher enable={enable} />
              <View
                style={{
                  position: "absolute",
                  width: 60,
                  height: 40,
                  backgroundColor: "rgba(0, 0, 0, 0.0)",
                }}
              />
            </CommonTouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  const searchCoin = (text) => {
    let coinsList = data;
    if (text.length === 0) {
      setData(ALL);
      setSearchText(text);
      return;
    }
    if (text.length < searchText.length) {
      coinsList = ALL;
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
        <CommonAppBar title="Tokens" />
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
              },
            ]}
            autoCorrect={false}
            placeholderTextColor={theme.subText2}
            onChangeText={(text) => searchCoin(text)}
            placeholder={t("search.search_tokens")}
          />
        </View>
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <CommonFlatList
            data={data}
            keyExtractor={(item) => item.address}
            renderItem={renderItem}
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
    borderWidth: 0,
  },
  itemContainer: {
    marginBottom: 10,
    marginHorizontal: 10,
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
    fontSize: 17,
  },
  itemSymbol: {
    flex: 1,
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
    fontSize: 16,
    paddingHorizontal: 10,
    height: 45,
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
  header: {
    height: 48,
    paddingHorizontal: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftHeader: {
    width: 30,
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  contentHeader: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
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
    fontSize: 13,
  },
  switcher: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
});
