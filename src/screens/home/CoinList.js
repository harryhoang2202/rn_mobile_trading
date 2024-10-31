import * as React from "react";
import { useCallback, useState } from "react";
import usePriceHook from "@persistence/price/PriceHook";
import Price from "@components/Price";
import { Dimensions, StyleSheet, View } from "react-native";
import CommonButton from "@components/commons/CommonButton";
import CommonFlatList from "@components/commons/CommonFlatList";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import { WalletAction } from "@persistence/wallet/WalletAction";
import CommonImage from "@components/commons/CommonImage";
import CommonText from "@components/commons/CommonText";
import Balance from "@components/Balance";
import NumberFormatted from "@components/NumberFormatted";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import CommonLoading from "@components/commons/CommonLoading";
import { MarketAction } from "@persistence/market/MarketAction";
import { useWalletList } from "@persistence/wallet/WalletHook";
import { Icons } from "@components/icons/Icons";

function CoinList(props) {
  const { getPriceData } = usePriceHook();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { wallets } = useWalletList();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const onRefresh = useCallback(async () => {
    CommonLoading.show();
    dispatch(WalletAction.balance()).then(() => {
      setRefreshing(false);
      CommonLoading.hide();
    });
  }, []);
  const renderItem = ({ item }) => {
    return (
      <CommonTouchableOpacity
        onPress={() => {
          dispatch(WalletAction.setActiveAsset(item)).then(() => {
            navigation.navigate("WalletDetailScreen", {
              coin: { ...item, isNative: item.type !== "coin" },
            });
          });
        }}
      >
        <View
          style={[
            styles.item,
            {
              borderBottomWidth: 0.5,
              borderColor: theme.border2,
              backgroundColor: theme.background5,
            },
          ]}
        >
          <View style={styles.itemInfo}>
            <View>
              <CommonImage
                source={{ uri: item.logoURI }}
                style={styles.itemImg}
              />
            </View>
            <View style={styles.itemDesc}>
              <CommonText
                style={[
                  { color: theme.coinText, fontWeight: "500", fontSize: 18 },
                ]}
              >
                {item.name}
              </CommonText>
              <View height={5} />
              <Balance
                style={[
                  { color: theme.subText, fontSize: 14, fontWeight: "500" },
                ]}
                symbol={item.symbol}
              >
                {item.balance}
              </Balance>
            </View>
          </View>
          <View style={styles.itemPrice}>
            <View style={[styles.itemDesc, { alignItems: "flex-end" }]}>
              <Price
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

              <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "column", marginRight: 5 }}>
                  {getPriceData(item.id, 1) >= 0 ? (
                    <Icons.Entypo
                      name="chevron-up"
                      size={10}
                      color={theme.longColor}
                    />
                  ) : (
                    <View height={2} />
                  )}
                  {getPriceData(item.id, 1) < 0 ? (
                    <Icons.Entypo
                      name="chevron-down"
                      size={10}
                      color={theme.shortColor}
                    />
                  ) : (
                    <View height={2} />
                  )}
                </View>
                <NumberFormatted
                  decimals={2}
                  sign={true}
                  style={{
                    color: getPriceData(item.id, 5),
                    fontSize: 14,
                    paddingVertical: 3,
                    fontWeight: "500",
                  }}
                  symbol={"%"}
                >
                  {getPriceData(item.id, 1)}
                </NumberFormatted>
              </View>
            </View>
          </View>
        </View>
      </CommonTouchableOpacity>
    );
  };
  return (
    <CommonFlatList
      data={wallets}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      keyExtractor={(item) => `${item.id}${item.chain}`}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListFooterComponent={() => {
        return (
          <View style={styles.addTokenButton}>
            <CommonButton
              text={t("token.add_new")}
              textStyle={{ color: theme.text2 }}
              onPress={() => {
                navigation.navigate("TokenScreen");
              }}
            />
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 18,
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
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  itemImg: {
    width: 42,
    height: 42,
    borderRadius: 10000,
  },
  notifyContainer: {
    width: 15,
    height: 15,
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
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemNameMarket: {
    marginLeft: 10,
    fontSize: 15,
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
export default CoinList;
