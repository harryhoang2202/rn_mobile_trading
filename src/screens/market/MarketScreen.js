import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MarketAction } from "@persistence/market/MarketAction";
import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";
import usePriceHook from "@persistence/price/PriceHook";
import MarketList from "@screens/home/MarketList";
export default function MarketScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { markets } = useSelector((state) => state.MarketReducer);
  const dispatch = useDispatch();
  const { getPriceData } = usePriceHook();
  useEffect(() => {
    (async () => {
      dispatch(MarketAction.getMarkets(20, true)).then(() => {});
    })();
  }, []);

  return (
    <LinearGradient
      colors={theme.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <CommonAppBar
          title={t("market.market").toUpperCase()}
          onBack={() => {
            navigation.navigate({
              name: "HomeScreen",
              merge: true,
            });
          }}
        />
        <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 120 }}>
          <MarketList />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customBtn: {
    borderWidth: 0,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    height: 72,
    paddingHorizontal: 10,
  },
  itemMarket: {
    flexDirection: "row",
    alignItems: "center",
    height: 72,
  },
  itemNameMarket: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemSymbolMarket: {
    fontSize: 13,
    textAlign: "left",
  },
  img: {
    width: 42,
    height: 42,
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
    marginLeft: 10,
  },
  itemName: {
    marginLeft: 10,
    fontSize: 15,
  },
  itemSymbol: {
    fontSize: 13,
    textAlign: "left",
  },
  searchContainer: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  search: {
    flex: 4,
    borderWidth: 1,
    backgroundColor: "red",
    paddingHorizontal: 10,
    height: 36,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
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
  chart: {
    paddingRight: 0,
    paddingBottom: 10,
    paddingTop: 10,
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
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
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
});
