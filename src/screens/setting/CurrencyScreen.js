import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonText from "@components/commons/CommonText";
import { useDispatch, useSelector } from "react-redux";
import CommonFlatList from "@components/commons/CommonFlatList";
import { applicationProperties } from "@src/application.properties";

import Icon, { Icons } from "@components/icons/Icons";
import { CurrencyAction } from "@persistence/currency/CurrencyAction";
import CommonLoading from "@components/commons/CommonLoading";
import CommonTouchableHighlight from "@components/commons/CommonTouchableHightlight";
import { fonts } from "@modules/core/constant/AppTextStyle";

export default function CurrencyScreen() {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { currency } = useSelector((state) => state.CurrencyReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {})();
  }, []);
  const renderItem = (item) => {
    return (
      <View style={[styles.item]}>
        <CommonTouchableHighlight
          onPress={async () => {
            CommonLoading.show();
            dispatch(CurrencyAction.getCurrency(item)).then(() => {
              CommonLoading.hide();
            });
          }}
          buttonGradientColor={[theme.hightLight, theme.hightLight]}
        >
          <View style={styles.row}>
            <View style={styles.itemContent}>
              <CommonText
                style={[{ color: theme.text }, styles.itemName]}
                numberOfLines={1}
              >
                {item.code} - {item.name}
              </CommonText>
            </View>
            {currency.code === item.code && (
              <Icon name="check" size={20} type={Icons.AntDesign} />
            )}
          </View>
        </CommonTouchableHighlight>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          height: 60,
          justifyContent: "flex-start",
          paddingTop: 10,
          alignItems: "center",
        }}
      >
        <CommonText
          style={{
            color: theme.text,
            fontSize: 21,
            fontWeight: "700",
            fontFamily: fonts.Nunito,
          }}
        >
          Currency
        </CommonText>
      </View>
      <View style={styles.content}>
        {applicationProperties.currencies.map(renderItem)}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: "50%",
    width: "100%",
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
  item: {
    width: "100%",
    marginBottom: 10,
    borderRadius: 10,
  },
  row: {
    minHeight: 45,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  textItem: { marginLeft: 10, flex: 3 },
  img: {
    width: 20,
    height: 20,
    marginRight: 0,
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 10,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemName: {
    marginLeft: 10,
    fontSize: 17,
    fontWeight: "500",
    fontSize: 18,
  },
  itemSymbol: {
    marginLeft: 10,
    fontSize: 13,
  },
  content: {
    flex: 1,
  },
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
});
