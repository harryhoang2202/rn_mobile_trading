import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  ScrollView,
  Touchable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CommonLoading from "@components/commons/CommonLoading";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { CardService } from "@persistence/card/CardService";
import Carousel from "react-native-snap-carousel";
import { animatedStyles, scrollInterpolator } from "@src/utils/CarouselUtil";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";
import CommonImage from "@components/commons/CommonImage";
import CommonText from "@components/commons/CommonText";
import Price from "@components/Price";
import { Icons } from "@components/icons/Icons";
import Transfert from "@components/icons/Transfert";
import Topup from "@components/icons/Topup";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import Balance from "@components/Balance";
import Visa from "@components/icons/Visa";
import { fonts } from "@modules/core/constant/AppTextStyle";

const SLIDER_WIDTH = Dimensions.get("window").width;

export default function MyCardDetailScreen({ navigation, route }) {
  const { card } = route.params;
  const { cards } = useSelector((state) => state.CardReducer);
  const { data: userData } = useSelector((state) => state.UserReducer);
  const { user } = userData;
  const { theme } = useSelector((state) => state.ThemeReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([
    { debit_credit: "DEBIT", processing_amount: 200 },
    { debit_credit: "DEBIT", processing_amount: 200 },
  ]);
  const [isShowingBalance, setShowingBalance] = useState();
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    (async () => {})();
  }, []);
  const onRefresh = useCallback(async () => {
    CommonLoading.show();
    await getTransaction();
    CommonLoading.hide();
  }, []);
  const getTransaction = async () => {
    const { data } = await CardService.getTransactions(card.cardBulkNo);
    const { success, message } = data;
    if (success === true) {
      setTransactions(message);
    }
  };
  const cardFormat = (str, n) => {
    return str
      .toString()
      .split(/(.{4})/)
      .filter((x) => x.length === 4)
      .join("-");
  };

  const renderCardBalanceItem = (item, index) => {
    return (
      <View style={styles.itemContainer}>
        <CommonImage
          source={
            index === 0
              ? require("@assets/images/card/card1.png")
              : require("@assets/images/card/card2.png")
          }
          style={{ width: "100%", height: "100%" }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{ flex: 1, justifyContent: "space-between", padding: 10 }}
            >
              <CommonTouchableOpacity
                onPress={() => {
                  setShowingBalance(!isShowingBalance);
                }}
              >
                <Icons.Ionicons
                  name={isShowingBalance ? "eye" : "eye-off"}
                  color={theme.portfolioBalance}
                  size={32}
                />
              </CommonTouchableOpacity>
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  paddingBottom: 10,
                }}
              >
                <CommonText
                  style={{ fontSize: 13, color: theme.portfolioBalance }}
                >
                  {"Balance:"}
                </CommonText>
                {isShowingBalance ? (
                  <Balance
                    style={{
                      fontSize: 38,
                      color: theme.portfolioBalance,
                      fontWeight: "700",
                    }}
                    prefix={"$"}
                  >
                    {item.cardBalance}
                  </Balance>
                ) : (
                  <CommonText
                    style={{
                      fontSize: 38,
                      color: theme.portfolioBalance,
                      fontWeight: "700",
                    }}
                  >
                    ******
                  </CommonText>
                )}
              </View>
            </View>
            <View
              style={{
                width: 130,
                justifyContent: "space-between",
                alignItems: "flex-start",
                paddingBottom: 20,
                paddingTop: 10,
              }}
            >
              <CommonTouchableOpacity onPress={() => {}}>
                <LinearGradient
                  colors={index === 0 ? theme.gradient14 : theme.gradient15}
                  style={styles.iconContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Transfert />
                  <CommonText
                    style={{
                      marginLeft: 10,
                      color: theme.portfolioBalance,
                      fontFamily: fonts.Nunito,
                      fontWeight: "700",
                      fontSize: 15,
                    }}
                  >
                    Transfert
                  </CommonText>
                </LinearGradient>
              </CommonTouchableOpacity>
              <CommonTouchableOpacity
                onPress={() => {
                  navigation.navigate("TopUpCardScreen", {
                    item: item,
                  });
                }}
              >
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  colors={index === 0 ? theme.gradient14 : theme.gradient15}
                  style={styles.iconContainer}
                >
                  <Topup />
                  <CommonText
                    style={{
                      marginLeft: 10,
                      color: theme.portfolioBalance,
                      fontFamily: fonts.Nunito,
                      fontWeight: "700",
                      fontSize: 15,
                    }}
                  >
                    Top Up
                  </CommonText>
                </LinearGradient>
              </CommonTouchableOpacity>
            </View>
          </View>
        </CommonImage>
      </View>
    );
  };
  const renderCardItem = (item, index) => {
    if (index === 0) {
      return (
        <View style={styles.itemCardContainer}>
          <CommonImage
            source={require("@assets/images/card/card-white.png")}
            style={{ width: "100%", height: 182 }}
          ></CommonImage>
        </View>
      );
    }
    return (
      <View style={styles.itemCardContainer}>
        <CommonImage
          source={require("@assets/images/card/card2.png")}
          style={{ width: "100%", height: "100%" }}
        >
          <View
            style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 20 }}
          >
            <CommonImage
              source={require("@assets/images/card/pentacoin.png")}
              style={{
                height: 32,
                width: 148,
                marginBottom: 30,
                marginLeft: 10,
              }}
            />
            <View style={styles.cardNoContainer}>
              <CommonText
                style={[styles.cardNo, { color: theme.portfolioBalance }]}
              >
                {cardFormat(item.cardNo)}
              </CommonText>
              <CommonText
                style={[
                  styles.cardNo,
                  { color: theme.portfolioBalance, fontWeight: "700" },
                ]}
              >
                {user.firstname + " " + user.lastname}
              </CommonText>
            </View>

            <View style={styles.cardHolderContainer}>
              <View
                style={{
                  height: 40,

                  justifyContent: "center",
                }}
              >
                <CommonText
                  style={[
                    styles.cardNo,
                    { color: theme.portfolioBalance, fontSize: 12 },
                  ]}
                >
                  {item.expMonth + "-" + item.expYear}
                </CommonText>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CommonText
                  style={[
                    styles.cardNo,
                    { color: theme.portfolioBalance, fontSize: 12 },
                  ]}
                >
                  CCV {item.cvv}
                </CommonText>
                <Visa height={30} width={40} />
              </View>
            </View>
          </View>
        </CommonImage>
      </View>
    );
  };

  const renderTransactionItem = (item, index) => {
    return (
      <View
        style={{
          height: 58,
          borderBottomWidth: index + 1 === transactions.length ? 0 : 0.5,
          borderBottomColor: "#474769",
          marginHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <CommonText
            style={{
              color: theme.text,
              fontFamily: fonts.Nunito,
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            Recieve from User13
          </CommonText>
          <View height={5} />
          <CommonText
            style={{
              color: theme.subText,
              fontSize: 12,
              fontFamily: fonts.Nunito,
            }}
          >
            PentaCard *1345
          </CommonText>
        </View>
        <View>
          <Price
            style={{
              color: theme.longColor,
              fontSize: 16,
              fontFamily: fonts.Nunito,
              fontWeight: "500",
            }}
          >
            +$120.00
          </Price>
        </View>
      </View>
    );
  };
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={theme.gradient}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <CommonAppBar title="My Cards" />
        <View height={155}>
          <ScrollView
            alwaysBounceVertical={false}
            style={{
              flexDirection: "row",
            }}
          >
            <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
              {cards.map((item, index) => renderCardBalanceItem(item, index))}
              <View
                style={{
                  width: 92,
                  height: 142,
                  backgroundColor: theme.container6,
                  borderWidth: 2,
                  borderStyle: "dashed",
                  borderColor: theme.border7,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 15,
                }}
              >
                <CommonText style={{ fontSize: 18, color: theme.text }}>
                  +
                </CommonText>
              </View>
            </View>
          </ScrollView>
        </View>
        <View height={200}>
          <ScrollView
            alwaysBounceVertical={false}
            style={{ flexDirection: "row", height: 196 }}
          >
            <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
              {cards.map((item, index) => renderCardItem(item, index))}
              <View
                style={{
                  width: 92,
                  height: 182,
                  backgroundColor: theme.container6,
                  borderWidth: 2,
                  borderStyle: "dashed",
                  borderColor: theme.border7,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 15,
                }}
              >
                <CommonText style={{ fontSize: 18, color: theme.text }}>
                  +
                </CommonText>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ marginTop: 20, marginBottom: 10, paddingLeft: 20 }}>
            <CommonText style={{ fontWeight: "700", fontFamily: fonts.Nunito }}>
              Last Transactions
            </CommonText>
          </View>
          <View
            style={{
              minHeight: 80,
              backgroundColor: theme.background8,
              marginHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <CommonText
                style={{
                  color: theme.subText,
                  fontFamily: fonts.Nunito,
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                03 September 2023
              </CommonText>
            </View>
            {transactions.map((item, index) =>
              renderTransactionItem(item, index)
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  itemContainer: {
    height: 155,
    width: 321,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginRight: 20,
    borderRadius: 16,
  },
  itemCardContainer: {
    height: 196,
    width: 321,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginRight: 20,
    borderRadius: 16,
  },
  itemLabel: {
    color: "white",
    fontSize: 24,
  },
  iconContainer: {
    width: 121,
    height: 58,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
  },

  cardNoContainer: {
    width: "100%",
    height: 60,
    paddingLeft: 30,
    justifyContent: "center",
  },

  cardNo: {
    fontSize: 22,
  },

  cardHolderContainer: {
    width: "100%",
    height: 40,
    paddingHorizontal: 30,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },

  cardHolderName: {
    flex: 1,
  },

  expireContainer: {
    height: 40,
    width: 100,
  },

  cvvContainer: {
    flex: 1,
  },
});
