import React from "react";
import { Platform, SafeAreaView, StyleSheet, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import _ from "lodash";
import CommonAlert from "@components/commons/CommonAlert";
import { useTranslation } from "react-i18next";
import CommonImage from "@components/commons/CommonImage";
import Price from "@components/Price";
import LinearGradient from "react-native-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";
import CommonAppBar from "@components/commons/CommonAppBar";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import { applicationProperties } from "@src/application.properties";
import { fonts } from "@modules/core/constant/AppTextStyle";

export default function CardDetailScreen({ navigation, route }) {
  const { item } = route.params;
  console.log(item);
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { data: userData } = useSelector((state) => state.UserReducer);
  console.log(userData);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={theme.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <CommonAppBar title="My Cards" />
        <View height={20} />
        <View style={styles.content}>
          <View style={[styles.imageContainer, { shadowColor: "#000000" }]}>
            <CommonImage
              source={{ uri: item.image }}
              style={[styles.cardImage]}
              resizeMode={"stretch"}
            />
          </View>

          <CommonTouchableOpacity
            onPress={() => {
              navigation.navigate("CardKycScreen", {
                item: {
                  url:
                    applicationProperties.endpoints.app.kycUrl +
                    "/auth/login?authToken=" +
                    userData.access_token,
                },
              });
            }}
            style={{
              height: 37,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 20,
            }}
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={
                userData.user.kycStatus === "VERIFIED"
                  ? theme.gradient9
                  : userData.user.kycStatus === "SUBMITTED"
                  ? theme.gradient8
                  : theme.gradient7
              }
              style={{
                width: "auto",
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderRadius: 17,
              }}
            >
              <CommonText
                style={{
                  fontFamily: fonts.Nunito,
                  fontWeight: "700",
                  color:
                    userData.user.kycStatus === "UNVERIFIED"
                      ? "#312B4A"
                      : theme.text,
                }}
              >
                {userData.user.kycStatus === "VERIFIED"
                  ? "KYC Approved"
                  : userData.user.kycStatus === "SUBMITTED"
                  ? "KYC  Submitted"
                  : "  Access KYC  "}
              </CommonText>
            </LinearGradient>
          </CommonTouchableOpacity>

          <View
            style={{
              backgroundColor: theme.background8,
              padding: 20,
              borderRadius: 16,
            }}
          >
            <View
              style={[
                styles.coinStatisticItem,
                { borderBottomColor: theme.border3 },
              ]}
            >
              <CommonText
                style={[{ color: theme.text }, styles.coinStatisticText]}
              >
                {t("card.price")}
              </CommonText>
              <Price
                style={{
                  color: theme.text,
                  fontWeight: "500",
                  fontFamily: fonts.Nunito,
                  fontSize: 11,
                }}
              >
                {item.price}
              </Price>
            </View>
            <View
              style={[
                styles.coinStatisticItem,
                { borderBottomColor: theme.border3 },
              ]}
            >
              <CommonText
                style={[{ color: theme.text }, styles.coinStatisticText]}
              >
                {t("loading.price")}
              </CommonText>
              <CommonText>
                <Price
                  style={[{ color: theme.text }, styles.coinStatisticText]}
                >
                  {item.topUpFee}
                </Price>
                <CommonText
                  style={[{ color: theme.text }, styles.coinStatisticText]}
                >
                  {" "}
                  + {item.topUpFeePercent}%
                </CommonText>
              </CommonText>
            </View>
            <View
              style={[
                styles.coinStatisticItem,
                { borderBottomColor: theme.border3 },
              ]}
            >
              <CommonText
                style={[{ color: theme.text }, styles.coinStatisticText]}
              >
                {t("monthly.price")}
              </CommonText>
              <Price style={[{ color: theme.text }, styles.coinStatisticText]}>
                {item.monthlyFee}
              </Price>
            </View>
            <View
              style={[
                styles.coinStatisticItem,
                { borderBottomColor: theme.border3 },
              ]}
            >
              <CommonText
                style={[{ color: theme.text }, styles.coinStatisticText]}
              >
                {t("balance.limit")}
              </CommonText>
              <Price style={[{ color: theme.text }, styles.coinStatisticText]}>
                {item.balanceLimit}
              </Price>
            </View>
            <View style={[styles.coinStatisticItem, { borderBottomWidth: 0 }]}>
              <CommonText
                style={[{ color: theme.text }, styles.coinStatisticText]}
              >
                {t("transaction.limit")}
              </CommonText>
              <Price style={[{ color: theme.text }, styles.coinStatisticText]}>
                {item.transactionLimit}
              </Price>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (userData.user.kycStatus === "VERIFIED") {
              navigation.navigate("BuyCardScreen", { item });
            } else {
              CommonAlert.show({
                title: t("alert.error"),
                message: "You need to do the KYC",
                type: "error",
              });
            }
          }}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={theme.gradient10}
            locations={[0, 0.31, 1]}
            style={{
              height: 64,
              width: "60%",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 1000,
              marginTop: 20,
            }}
          >
            <CommonText
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: theme.text3,
                fontFamily: fonts.ProximaNova,
              }}
            >
              Buy
            </CommonText>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
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
  content: {
    paddingHorizontal: 20,
  },
  item: {
    width: "100%",
    borderBottomWidth: 0.5,
  },
  row: {
    minHeight: 90,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftItemContainer: {
    height: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rightItemContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  browserContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 0 : 48,
  },
  sessionRequestContainer: {
    width: "100%",
    marginBottom: Platform.OS === "android" ? 0 : 170,
  },
  titleContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  contentContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    minHeight: 200,
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
    height: 64,
  },
  haftButton: {
    width: "50%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  browserHeader: {
    height: 30,
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
  cardImage: {
    width: "100%",
    height: 196,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 20,
  },
  imageContainer: {
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 4,
  },
  coinStatisticItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 30,
    borderBottomWidth: 0.5,
  },
  coinStatisticText: {
    fontWeight: "500",
    fontFamily: fonts.Nunito,
    fontSize: 11,
  },
});
