import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CommonAlert from "@components/commons/CommonAlert";
import CommonText from "@components/commons/CommonText";
import CommonImage from "@components/commons/CommonImage";
import PriceById from "@components/PriceById";
import Icon, { Icons } from "@components/icons/Icons";
import CommonGradientButton from "@components/commons/CommonGradientButton";
import ActionSheet from "react-native-actions-sheet";
import CommonFlatList from "@components/commons/CommonFlatList";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import _ from "lodash";
import { PriceService } from "@persistence/price/PriceService";
import { WalletFactory } from "@modules/core/factory/WalletFactory";
import CommonLoading from "@components/commons/CommonLoading";
import { PriceAlertAction } from "@persistence/pricealert/PriceAlertAction";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";
import CommonTouchableHighlight from "@components/commons/CommonTouchableHightlight";
import { fonts } from "@modules/core/constant/AppTextStyle";

export default function AddPriceAlertScreen({ navigation, route }) {
  const { item } = route.params;
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const dispatch = useDispatch();
  const actionSheetRef = useRef(null);
  const [alertPrice, setAlertPrice] = useState("");
  const [alertTypes, setAlertTypes] = useState([
    {
      type: "LONG",
      text: "Price above",
    },
    {
      type: "SHORT",
      text: "Price below",
    },
  ]);
  const [alertType, setAlertType] = useState({
    type: "LONG",
    text: "Price above",
  });

  useEffect(() => {
    (async () => {
      CommonLoading.hide();
    })();
  }, []);
  const add = async () => {
    if (_.isEmpty(alertPrice)) {
      CommonAlert.show({
        title: t("alert.error"),
        message: t("please_fill"),
        type: "error",
      });
      return;
    }
    const price = parseFloat(alertPrice);
    const { _result } = PriceService.getCurrentPrice(item.tokenId);
    const currentPrice = _result[0];
    if (alertType.type === "LONG") {
      if (price <= currentPrice) {
        CommonAlert.show({
          title: t("alert.error"),
          message: t("price_alert_price_above"),
          type: "error",
        });
        return;
      }
    } else if (alertType.type === "SHORT") {
      if (price >= currentPrice) {
        CommonAlert.show({
          title: t("alert.error"),
          message: t("price_alert_price_below"),
          type: "error",
        });
        return;
      }
    }
    const { data: ethWallet } = await WalletFactory.getWallet("ETH");
    const data = {
      order: item.order,
      type: alertType.type,
      alertPrice: price,
      tokenId: item.id,
      status: "NEW",
      username: ethWallet.walletAddress,
    };
    CommonLoading.show();
    dispatch(PriceAlertAction.add(data)).then(({ success }) => {
      CommonLoading.hide();
      if (!success) {
        CommonAlert.show({
          title: t("alert.error"),
          message: t("price_alert_already_added"),
          type: "error",
        });
        return;
      }
      dispatch(PriceAlertAction.list());
      navigation.pop(2);
    });
  };
  const renderItem = ({ item }) => {
    return (
      <View style={[styles.item, { backgroundColor: theme.container4 }]}>
        <CommonTouchableHighlight
          onPress={() => {
            setAlertType(item);
            actionSheetRef.current?.hide();
          }}
        >
          <View
            style={{
              minHeight: 45,
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 15,
            }}
          >
            <CommonText
              style={{
                marginLeft: 10,
                flex: 3,
                color: theme.text,
                fontSize: 18,
                fontWeight: "500",
              }}
            >
              {item.text}
            </CommonText>
            {item.type === alertType.type && (
              <Icon name="check" size={20} type={Icons.AntDesign} />
            )}
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
        <CommonAppBar title={t("add_price_alert")} />
        <View style={styles.content}>
          <View
            style={[
              styles.tokenContainer,
              { backgroundColor: theme.container4 },
            ]}
          >
            <CommonImage source={{ uri: item.logoURI }} style={styles.img} />
            <View style={styles.tokenInformation}>
              <CommonText>{item.symbol}</CommonText>
              <PriceById id={item.tokenId} />
            </View>
          </View>
          <CommonTouchableOpacity
            onPress={() => {
              actionSheetRef.current?.show();
            }}
            style={[
              styles.tokenContainer,
              { backgroundColor: theme.container4 },
            ]}
          >
            <View style={styles.tokenInformation}>
              <CommonText>{t("price_alert_type")}</CommonText>
              <View style={styles.alertType}>
                <CommonText>{alertType.text}</CommonText>
                <Icon
                  type={Icons.Feather}
                  size={18}
                  name={"chevron-down"}
                  color={"white"}
                  style={{ marginLeft: 5, marginTop: 2 }}
                />
              </View>
            </View>
          </CommonTouchableOpacity>
          <View
            style={[styles.inputView, { backgroundColor: theme.container4 }]}
          >
            <TextInput
              style={[styles.input, { color: theme.inputText }]}
              onChangeText={setAlertPrice}
              value={alertPrice}
              placeholder={t("price_alert_price")}
              numberOfLines={1}
              returnKeyType="done"
              placeholderTextColor="gray"
              autoCompleteType={"off"}
              autoCapitalize={"none"}
              autoCorrect={false}
              onEndEditing={async () => {}}
            />
          </View>
          <View style={styles.buttonContainer}>
            <CommonGradientButton
              text={t("price_alert_add")}
              onPress={add}
              textStyle={{
                fontWeight: "700",
                fontSize: 20,
                fontFamily: fonts.ProximaNova,
              }}
            />
          </View>
        </View>
        <ActionSheet
          ref={actionSheetRef}
          gestureEnabled={true}
          containerStyle={{ backgroundColor: theme.background8 }}
          headerAlwaysVisible
        >
          <CommonFlatList
            data={alertTypes}
            keyExtractor={(item) => item.type}
            renderItem={renderItem}
          />
        </ActionSheet>
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
  item: {
    width: "100%",
    marginBottom: 10,
    borderRadius: 10,
  },
  img: {
    width: 38,
    height: 38,
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
  content: {
    flex: 1,
    paddingTop: 10,
  },
  inputView: {
    height: 60,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 14,
    marginVertical: 10,
    marginBottom: 0,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  input: { flex: 1, color: "black" },
  tokenContainer: {
    height: 60,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 14,
    marginVertical: 10,
    marginBottom: 0,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tokenInformation: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  alertType: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    height: 70,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  alertItem: {
    height: 70,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});
