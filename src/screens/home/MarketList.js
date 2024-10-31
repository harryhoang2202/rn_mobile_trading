import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import usePriceHook from "@persistence/price/PriceHook";
import Price from "@components/Price";
import { Dimensions, RefreshControl, StyleSheet, View } from "react-native";
import CommonFlatList from "@components/commons/CommonFlatList";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import CommonImage from "@components/commons/CommonImage";
import CommonText from "@components/commons/CommonText";
import NumberFormatted from "@components/NumberFormatted";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { MarketAction } from "@persistence/market/MarketAction";
import FastImage from "react-native-fast-image";
import CommonChart from "@screens/market/CommonChart";

function MarketList(props) {
  const { getPriceData } = usePriceHook();
  const { markets } = useSelector((state) => state.MarketReducer);
  const navigation = useNavigation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      loadMarket();
    })();
  }, []);
  const loadMarket = () => {
    dispatch(MarketAction.getMarkets(20, true)).then(() => {});
  };

  const renderMarketItem = ({ item }) => {
    var sparkline = item.sparkline_in_7d?.price;
    return (
      <CommonTouchableOpacity
        onPress={async () => {
          navigation.navigate("MarketDetailScreen", { coin: item });
        }}
        style={[
          styles.itemMarket,
          {
            backgroundColor: theme.background5,
            borderRadius: 10,
            marginBottom: 10,
            paddingHorizontal: 10,
          },
        ]}
      >
        <View style={styles.itemContent}>
          <View style={{ flexDirection: "row", width: 120 }}>
            <CommonImage
              style={styles.img}
              source={{
                uri: item.image,
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable,
              }}
            />
            <View>
              <CommonText
                style={[
                  { color: theme.coinText, fontWeight: "500", fontSize: 18 },
                ]}
                numberOfLines={1}
              >
                {item.name}
              </CommonText>
              <View height={5} />
              <CommonText
                style={[
                  { color: theme.subText, fontSize: 14, fontWeight: "500" },
                ]}
                numberOfLines={1}
              >
                {item.symbol.toUpperCase()}
              </CommonText>
            </View>
          </View>
          {/* <View style={{ width: 80, height: 40 }}>
            <CommonChart data={sparkline} height={40} width={80} />
          </View> */}
          <View width={5} />
          <View style={{ alignItems: "flex-end" }}>
            <Price
              numberOfLines={1}
              style={[
                {
                  color: getPriceData(item.id, 4),
                  fontWeight: "500",
                  fontSize: 18,
                },
              ]}
            >
              {getPriceData(item.id, 0)}
            </Price>
            <NumberFormatted
              decimals={2}
              sign={true}
              style={{
                color: getPriceData(item.id, 4),
                fontWeight: "500",
                fontSize: 14,
              }}
              symbol={"%"}
            >
              {getPriceData(item.id, 1)}
            </NumberFormatted>
          </View>
        </View>
      </CommonTouchableOpacity>
    );
  };
  return (
    <CommonFlatList
      data={markets}
      renderItem={renderMarketItem}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 110,
    paddingHorizontal: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerBg: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  balanceContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
  },
  balanceText: {
    fontSize: 35,
    fontWeight: "bold",
  },
  walletNameText: {
    fontSize: 10,
  },
  actionContainer: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  actionItem: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
  },
  actionIcon: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  tabViewContainer: {
    flex: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  tabViewHeader: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  tabViewHeaderItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  tabViewContent: {
    flex: 1,
    paddingHorizontal: 10,
  },
  itemInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemDesc: {
    marginLeft: 10,
  },
  itemName: {
    fontWeight: "bold",
  },
  itemSymbol: {
    fontSize: 12,
  },
  itemPrice: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    paddingRight: 10,
  },
  addTokenButton: {
    width: "100%",
    height: 72,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    height: 72,
    width: "100%",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemImg: {
    width: 42,
    height: 42,
    borderRadius: 10000,
  },
  notifyContainer: {
    width: 15,
    height: 15,
    backgroundColor: "#c7122a",
    borderRadius: 30,
    position: "absolute",
    top: -5,
    left: -5,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    fontWeight: "bold",
    fontSize: 8,
  },
  logo: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(4,211,238,0.2)",
    borderRadius: 100,
  },
  nftItem: {
    width: Dimensions.get("screen").width / 2 - 20,
    height: 220,
    marginLeft: 8,
    marginBottom: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  tabViewHeaderTitle: {
    width: "70%",
  },
  tabViewHeaderTitleText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  itemInfoContainer: {
    width: "100%",
    height: 30,
    position: "absolute",
    bottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  itemNameContainer: {
    backgroundColor: "rgba(0,0,0,0.7)",
    width: "80%",
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  image: { height: 220, width: "100%", borderRadius: 20 },

  itemMarket: {
    flexDirection: "row",
    alignItems: "center",
    height: 72,
  },
  img: {
    width: 42,
    height: 42,
    marginRight: 10,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemNameMarket: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemSymbolMarket: {
    fontSize: 13,
    textAlign: "left",
  },
  percentContainer: {
    width: 60,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});
export default MarketList;
