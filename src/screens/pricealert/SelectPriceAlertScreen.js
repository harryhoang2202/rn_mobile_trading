import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, TextInput, View, Text } from "react-native";
import CommonText from "@components/commons/CommonText";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CommonFlatList from "@components/commons/CommonFlatList";
import CommonBackButton from "@components/commons/CommonBackButton";
import { PriceAlertAction } from "@persistence/pricealert/PriceAlertAction";
import CommonImage from "@components/commons/CommonImage";
import FastImage from "react-native-fast-image";
import { PriceService } from "@persistence/price/PriceService";
import CommonLoading from "@components/commons/CommonLoading";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";
import CommonTouchableHighlight from "@components/commons/CommonTouchableHightlight";

export default function SelectPriceAlertScreen({ navigation, route }) {
  const { order } = route.params;
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { coins } = useSelector((state) => state.PriceAlertReducer);
  const [data, setData] = useState(coins);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      dispatch(PriceAlertAction.getCoinList()).then(
        ({ success, data: coinList }) => {
          if (success === true) {
            setData(coinList);
          }
        }
      );
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
      <View style={[styles.itemContainer]}>
        <CommonTouchableHighlight
          onPress={async () => {
            CommonLoading.show();
            try {
              PriceService.add({ id: item.tokenId }).then(
                ({ success, data }) => {
                  CommonLoading.hide();
                  if (success === true) {
                    navigation.navigate("AddPriceAlertScreen", {
                      item: { ...item, order },
                    });
                  }
                }
              );
            } catch (e) {
              console.log(e.message);
              CommonLoading.hide();
            }
          }}
        >
          <View style={styles.item}>
            <CommonImage style={styles.img} source={img} />
            <View style={styles.itemContent}>
              <View style={{ marginLeft: 20 }}>
                <CommonText
                  style={[
                    styles.itemName,
                    { fontSize: 18, color: theme.text, fontWeight: "500" },
                  ]}
                  numberOfLines={1}
                >
                  {item.name}
                </CommonText>
                <CommonText
                  style={[
                    styles.itemName,
                    { fontSize: 14, color: theme.subText, fontWeight: "500" },
                  ]}
                  numberOfLines={1}
                >
                  {item.symbol}
                </CommonText>
              </View>
            </View>
          </View>
        </CommonTouchableHighlight>
      </View>
    );
  };
  const searchCoin = (text) => {
    let coinsList = data;
    if (text.length === 0) {
      setData(coins);
      return;
    }
    if (text.length < searchText.length) {
      coinsList = coins;
    }
    setSearchText(text);
    const newData = coinsList.filter((item) => {
      const itemData = `${item.symbol.toUpperCase()}`;
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
        <CommonAppBar title="Price Alert" />
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
        <View style={{ flex: 1 }}>
          <CommonFlatList
            data={data}
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
