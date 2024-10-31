import React, { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import { useTranslation } from "react-i18next";
import CommonFlatList from "@components/commons/CommonFlatList";
import CommonImage from "@components/commons/CommonImage";
import CommonButton from "@components/commons/CommonButton";
import CommonGradientButton from "@components/commons/CommonGradientButton";
import CommonTouchableHighlight from "@components/commons/CommonTouchableHightlight";
import { applicationProperties } from "@src/application.properties";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import { CardAction } from "@persistence/card/CardAction";
import CardCarouselSlide from "@screens/card/CardCarouselSlide";
import _ from "lodash";
import LinearGradient from "react-native-linear-gradient";
import CommonBackButton from "@components/commons/CommonBackButton";
import Icon, { Icons } from "@components/icons/Icons";
import CommonAppBar from "@components/commons/CommonAppBar";

// const data = [
//   {
//     id: "penta-silver",
//     name: "Pentacard (Silver)",
//     desc: "Cash withdrawals from ATMs. Available globally",
//     image: require("@assets/images/card/card-silver.png"),
//     price: 20,
//     topUpFee: 3,
//     topUpFeePercent: 3,
//     monthlyFee: 10,
//     balanceLimit: 150000,
//     transactionLimit: 150000,
//   },
// ];
export default function CardScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { data: userData } = useSelector((state) => state.UserReducer);
  console.log(userData);
  const { cardTypes } = useSelector((state) => state.CardReducer);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    (async () => {
      dispatch(CardAction.getCards()).then(({ success, data: cardsData }) => {
        if (success === true) {
          dispatch(CardAction.getBalances(cardsData));
        }
      });
    })();
  }, []);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(CardAction.getCards()).then(({ success, data: cardsData }) => {
      if (success === true) {
        dispatch(CardAction.getBalances(cardsData));
      }
      setRefreshing(false);
    });
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <CommonTouchableHighlight
          onPress={() => {
            navigation.navigate("CardDetailScreen", { item: item });
          }}
        >
          <View style={styles.item}>
            <View style={styles.itemImageContainer}>
              <CommonImage
                source={{ uri: item.image }}
                style={styles.itemImage}
                resizeMode={"stretch"}
              />
            </View>
            <View style={styles.itemInformationContainer}>
              <CommonText style={styles.itemNameText}>{item.name}</CommonText>
              <CommonText style={{ fontSize: 9 }}> {item.desc}</CommonText>
            </View>
          </View>
        </CommonTouchableHighlight>
      </View>
    );
  };
  return (
    <LinearGradient
      colors={theme.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <CommonAppBar
          title="Cards"
          onBack={() => {
            navigation.navigate({
              name: "HomeScreen",
              merge: true,
            });
          }}
        />
        <View style={styles.content}>
          <View style={styles.myCardContainer}>
            <CardCarouselSlide />
          </View>
          <CommonFlatList
            data={cardTypes}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
        {userData.kycStatus === "UNVERIFIED" && (
          <View style={styles.kycButton}>
            <CommonGradientButton
              text={t("kyc")}
              textStyle={{ color: theme.text }}
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
            />
          </View>
        )}
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
  headerBg: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  content: {
    flex: 1,
    paddingTop: 20,
  },
  itemContainer: {
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  item: {
    flex: 1,
    width: "100%",
    height: 110,
    flexDirection: "row",
    padding: 5,
  },
  itemImageContainer: {
    width: 150,
    height: "100%",
  },
  itemImage: {
    width: 150,
    height: 100,
    borderRadius: 15,
  },
  itemInformationContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  itemNameText: {
    fontSize: 18,
    fontWeight: "500",
  },
  kycButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  myCardContainer: {
    width: "100%",
    marginBottom: 20,
  },
});
