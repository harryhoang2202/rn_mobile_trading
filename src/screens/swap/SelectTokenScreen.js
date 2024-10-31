import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import CommonText from "@components/commons/CommonText";
import FastImage from "react-native-fast-image";
import CommonImage from "@components/commons/CommonImage";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import _ from "lodash";
import CommonFlatList from "@components/commons/CommonFlatList";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonLoading from "@components/commons/CommonLoading";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import { Icons } from "@components/icons/Icons";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";

export default function SelectTokenScreen({ navigation, route }) {
  const { platform, onSelect, currentToken } = route.params;
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const token = useSelector((state) => state.TokenReducer);
  const [tokens, setTokens] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const filteredTokens = _.filter(token[platform], function (a) {
        return a.symbol !== currentToken;
      });
      setData(filteredTokens);
      setTokens(filteredTokens);
    })();
  }, []);

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
      <CommonTouchableOpacity
        onPress={async () => {
          CommonLoading.show();
          await onSelect(item);
          CommonLoading.hide();
          navigation.goBack();
        }}
        style={[styles.item, { backgroundColor: theme.container4 }]}
      >
        <CommonImage style={styles.img} source={img} />
        <View style={styles.itemContent}>
          <View>
            <CommonText
              style={[styles.itemName, { color: theme.text }]}
              numberOfLines={1}
            >
              {item.symbol}
            </CommonText>
          </View>
        </View>
      </CommonTouchableOpacity>
    );
  };
  const searchCoin = (text) => {
    let coinsList = data;
    if (text.length === 0) {
      setData(tokens);
      return;
    }
    if (text.length < searchText.length) {
      coinsList = tokens;
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
  item: {
    height: 70,

    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  img: {
    width: 42,
    height: 42,
    marginRight: 0,
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 10,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    //color: Colors.foreground,
    marginLeft: 10,
    fontSize: 17,
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
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 15,
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
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
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
    alignItems: "center",
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
});
