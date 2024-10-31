import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import FastImage from "react-native-fast-image";
import CommonImage from "@components/commons/CommonImage";
import { useTranslation } from "react-i18next";
import moment from "moment";
import CommonBackButton from "@components/commons/CommonBackButton";
import Price from "@components/Price";
import Balance from "@components/Balance";
import { AreaChart } from "react-native-svg-charts";
import numeral from "numeral";
import { usePriceDetailHook } from "@persistence/price/PriceHook";
import NumberFormatted from "@components/NumberFormatted";
import PriceById from "@components/PriceById";
import * as gradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";
import * as shape from "d3-shape";
import { Defs } from "react-native-svg";
import { LinearGradient } from "react-native-svg";
import { Stop } from "react-native-svg";
import CommonTouchableHighlight from "@components/commons/CommonTouchableHightlight";
import CommonChart from "./CommonChart";
import { fonts } from "@modules/core/constant/AppTextStyle";

export default function MarketDetailScreen({ navigation, route }) {
  const { coin } = route.params;
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { currency } = useSelector((state) => state.CurrencyReducer);
  const [sparkline, setSparkline] = useState(coin?.sparkline_in_7d?.price);
  const { getCurrentPriceDetail } = usePriceDetailHook(coin.id);
  const [labels, setLabels] = useState([]);
  const [labelSelected, selectLabel] = useState("7D");

  useEffect(() => {
    (async () => {
      setLabels(["24H", "7D", "1M", "3M", "6M", "1Y"]);
    })();
  }, []);
  const exchange = (value, decimals = 2) => {
    const format = `0,0.[${"0".repeat(decimals)}]`;
    return numeral(value * currency.value).format(format);
  };

  return (
    <gradient.LinearGradient
      colors={theme.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <CommonAppBar title={coin.name} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.coinInfo}>
              <View style={styles.coinInfoUpperArea}>
                <CommonImage
                  style={styles.coinInfoImg}
                  source={{
                    uri: coin.image,
                    priority: FastImage.priority.normal,
                    cache: FastImage.cacheControl.immutable,
                  }}
                />
                <CommonText
                  style={[{ color: theme.text }, styles.coinInfoSymbol]}
                >
                  {coin.symbol.toUpperCase()}
                </CommonText>
              </View>
              <View style={styles.coinInfoLowerArea}>
                <PriceById
                  style={[{ color: theme.text }, styles.coinInfoPrice]}
                  id={coin.id}
                />
                <View style={styles.coinInfoPercentage}>
                  <View
                    style={[
                      styles.coinInfoPercentageBg,
                      {
                        backgroundColor: theme.background3,
                      },
                    ]}
                  >
                    <NumberFormatted
                      decimals={2}
                      sign={true}
                      style={{
                        color: getCurrentPriceDetail(5),
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                      symbol={"%"}
                    >
                      {getCurrentPriceDetail(1)}
                    </NumberFormatted>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={[{ backgroundColor: theme.background9 }, styles.coinChart]}
            >
              <CommonChart data={sparkline} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {labels.map((item) => (
                  <CommonTouchableHighlight
                    onPress={() => {
                      selectLabel(item);
                    }}
                    style={{
                      width: 49,
                      height: 21,
                      borderRadius: 5,
                    }}
                  >
                    <gradient.LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      colors={
                        labelSelected === item
                          ? theme.gradient16
                          : [theme.container4, theme.container4]
                      }
                      style={{
                        height: 21,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                      }}
                    >
                      <CommonText
                        style={{
                          color: theme.text,
                          fontSize: 12,
                          fontFamily: fonts.Nunito,
                          fontWeight: "700",
                        }}
                      >
                        {item}
                      </CommonText>
                    </gradient.LinearGradient>
                  </CommonTouchableHighlight>
                ))}
              </View>
            </View>
            <View style={styles.coinStatistic}>
              <View style={styles.coinStatisticHeader}>
                <CommonText style={styles.coinStatisticTitle}>
                  Statistic
                </CommonText>
                <View>
                  <CommonText
                    style={[
                      { color: theme.subText },
                      styles.coinStatisticSubtitle,
                    ]}
                  >
                    Last updated: {moment(coin?.last_updated).fromNow()}
                  </CommonText>
                  <CommonText
                    style={[
                      {
                        color: theme.subText,
                        textAlign: "right",
                      },
                      styles.coinStatisticSubtitle,
                    ]}
                  >
                    by CoinGecko
                  </CommonText>
                </View>
              </View>

              <View
                style={[
                  styles.coinStatisticItem,
                  { borderBottomColor: theme.border6 },
                ]}
              >
                <CommonText
                  style={{ color: theme.text, fontFamily: fonts.Nunito }}
                >
                  {t("coindetails.rank")}
                </CommonText>
                <CommonText
                  style={{ color: theme.text, fontFamily: fonts.Nunito }}
                >
                  {coin?.market_cap_rank ?? "-"}
                </CommonText>
              </View>
              <View
                style={[
                  styles.coinStatisticItem,
                  { borderBottomColor: theme.border6 },
                ]}
              >
                <CommonText
                  style={{ color: theme.text, fontFamily: fonts.ProximaNova }}
                >
                  {t("coindetails.marketcap")}
                </CommonText>
                <Price
                  style={{ color: theme.text, fontFamily: fonts.ProximaNova }}
                >
                  {coin?.market_cap ?? "-"}
                </Price>
              </View>
              <View
                style={[
                  [
                    styles.coinStatisticItem,
                    { borderBottomColor: theme.border6 },
                  ],
                  { borderBottomColor: theme.border6 },
                ]}
              >
                <CommonText
                  style={{ color: theme.text, fontFamily: fonts.ProximaNova }}
                >
                  {t("coindetails.volume")}
                </CommonText>
                <Price
                  style={{ color: theme.text, fontFamily: fonts.ProximaNova }}
                >
                  {coin?.total_volume ?? "-"}
                </Price>
              </View>
              <View
                style={[
                  styles.coinStatisticItem,
                  { borderBottomColor: theme.border6 },
                ]}
              >
                <CommonText
                  style={{ color: theme.text, fontFamily: fonts.ProximaNova }}
                >
                  {t("coindetails.all_time_high")}
                </CommonText>
                <Price
                  style={{ color: theme.text, fontFamily: fonts.ProximaNova }}
                >
                  {coin?.ath ?? "-"}
                </Price>
              </View>
              <View
                style={[
                  styles.coinStatisticItem,
                  { borderBottomColor: theme.border6 },
                ]}
              >
                <CommonText
                  style={{ color: theme.text, fontFamily: fonts.ProximaNova }}
                >
                  {t("coindetails.high_24")}
                </CommonText>
                <Price
                  style={{ color: theme.text, fontFamily: fonts.ProximaNova }}
                >
                  {coin?.high_24h ?? "-"}
                </Price>
              </View>
              <View
                style={[
                  styles.coinStatisticItem,
                  { borderBottomColor: theme.border6 },
                ]}
              >
                <CommonText
                  style={{ color: theme.text, fontFamily: fonts.ProximaNova }}
                >
                  {t("coindetails.low_24h")}
                </CommonText>
                <Price
                  style={{ color: theme.text, fontFamily: fonts.ProximaNova }}
                >
                  {coin?.low_24h ?? "-"}
                </Price>
              </View>
              <View
                style={[
                  styles.coinStatisticItem,
                  { borderBottomColor: theme.border6 },
                ]}
              >
                <CommonText
                  style={{ color: theme.text, fontFamily: fonts.ProximaNova }}
                >
                  {t("coindetails.circulating_supply")}
                </CommonText>
                <Balance
                  style={{ color: theme.text, fontFamily: fonts.ProximaNova }}
                >
                  {coin?.circulating_supply ?? "-"}
                </Balance>
              </View>
              <View
                style={[
                  styles.coinStatisticItem,
                  { borderBottomColor: theme.border6 },
                ]}
              >
                <CommonText
                  style={{ color: theme.text, fontFamily: fonts.ProximaNova }}
                >
                  {t("coindetails.max_supply")}
                </CommonText>
                <Balance
                  style={{ color: theme.text, fontFamily: fonts.ProximaNova }}
                >
                  {coin?.max_supply ?? "-"}
                </Balance>
              </View>
              <View
                style={[
                  styles.coinStatisticItem,
                  { borderBottomColor: theme.border6 },
                ]}
              >
                <CommonText
                  style={{ color: theme.text, fontFamily: fonts.ProximaNova }}
                >
                  {t("coindetails.total_supply")}
                </CommonText>
                <Balance
                  style={{ color: theme.text, fontFamily: fonts.ProximaNova }}
                >
                  {coin?.total_supply ?? "-"}
                </Balance>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </gradient.LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  coinInfo: {
    width: "100%",
    height: 70,
    paddingHorizontal: 20,
  },
  coinInfoUpperArea: {
    height: 42,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
  },
  coinInfoImg: {
    height: 32,
    width: 32,
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
  coinInfoSymbol: {
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 16,
    fontFamily: fonts.Nunito,
  },
  coinInfoLowerArea: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coinInfoPrice: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: fonts.Nunito,
  },
  coinInfoPercentage: {
    width: 50,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  coinInfoPercentageBg: {
    backgroundColor: "rgba(126,126,126,0.5)",
    borderRadius: 10,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  coinChart: {
    padding: 10,
    marginHorizontal: 20,
    marginTop: 7,
    borderRadius: 4,
  },
  last7DaysText: {
    color: "gray",
    textAlign: "center",
    fontSize: 30,
    position: "absolute",
    fontWeight: "bold",
    opacity: 0.2,
    width: "100%",
    top: 80,
    left: 30,
    fontFamily: fonts.Nunito,
  },
  coinStatistic: {
    width: "100%",
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 14,
  },
  coinStatisticHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coinStatisticTitle: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: fonts.Nunito,
  },
  coinStatisticItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 55,
    borderBottomWidth: 0.5,
    paddingHorizontal: 5,
  },
  coinStatisticSubtitle: {
    fontSize: 10,
    fontFamily: fonts.Nunito,
  },
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
});
