import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import CommonText from "@components/commons/CommonText";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Icon, { Icons } from "@components/icons/Icons";
import { PriceAlertAction } from "@persistence/pricealert/PriceAlertAction";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonImage from "@components/commons/CommonImage";
import FastImage from "react-native-fast-image";
import Price from "@components/Price";
import DragList, { DragListRenderItemInfo } from "react-native-draglist";
import { PriceAlertService } from "@persistence/pricealert/PriceAlertService";
import CommonLoading from "@components/commons/CommonLoading";
import CommonAlert from "@components/commons/CommonAlert";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";
import CommonTouchableHighlight from "@components/commons/CommonTouchableHightlight";

export default function PriceAlertScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { alerts } = useSelector((state) => state.PriceAlertReducer);
  const [data, setData] = useState(alerts);
  const { theme } = useSelector((state) => state.ThemeReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      dispatch(PriceAlertAction.list()).then(({ success, data }) => {
        if (success === true) {
          setData(data);
        }
      });
    })();
  }, [alerts]);
  const renderItem = (info) => {
    const { item, onDragStart, onDragEnd, isActive } = info;
    let img = {
      uri: item.token.logoURI,
      priority: FastImage.priority.normal,
      cache: FastImage.cacheControl.immutable,
    };
    if (item.thumb === "" || item.thumb === null) {
      img = require("@assets/images/token/no-photo.png");
    }
    let alertType = "";
    if (item.type === "LONG") {
      alertType = "Price above";
    } else {
      alertType = "Price below";
    }

    return (
      <View style={[styles.item, { backgroundColor: theme.container4 }]}>
        <CommonTouchableHighlight
          onPressIn={onDragStart}
          onPressOut={onDragEnd}
        >
          <View style={styles.row}>
            <CommonImage style={styles.img} source={img} />
            <View style={styles.itemContent}>
              <View style={styles.alertPriceInfo}>
                <CommonText
                  style={[
                    styles.itemName,
                    { color: theme.text, fontSize: 18, fontWeight: "500" },
                  ]}
                >
                  {item.token.name}
                </CommonText>
                <CommonText
                  style={{
                    color: theme.subText,
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  {item.token.symbol}
                </CommonText>
              </View>
              <View style={styles.alertPrice}>
                <View>
                  <CommonText
                    style={{
                      color: theme.subText,
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    {alertType}
                  </CommonText>
                  <Price
                    decimals={5}
                    style={{
                      color: theme.text,
                      fontSize: 18,
                      fontWeight: "500",
                    }}
                  >
                    {item.alertPrice}
                  </Price>
                </View>
                <CommonTouchableOpacity
                  onPress={() => {
                    CommonLoading.show();
                    dispatch(PriceAlertAction.remove(item.id)).then(
                      ({ success }) => {
                        CommonLoading.hide();
                        if (!success) {
                          CommonAlert.show({
                            title: t("alert.error"),
                            message: t("price_alert_cannot_delete"),
                            type: "error",
                          });
                          return;
                        }
                        CommonAlert.show({
                          title: t("alert.success"),
                          message: t("price_alert_delete_success"),
                          type: "info",
                        });
                      }
                    );
                  }}
                  style={[styles.removeContainer]}
                >
                  <Icon type={Icons.EvilIcons} size={18} name={"trash"} />
                </CommonTouchableOpacity>
              </View>
            </View>
          </View>
        </CommonTouchableHighlight>
      </View>
    );
  };

  const onReordered = (fromIndex, toIndex) => {
    const copy = [...data]; // Don't modify react data in-place
    const removed = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, removed[0]); // Now insert at the new pos
    copy.map((item, index) => {
      item.order = index;
    });
    setData(copy);
    PriceAlertService.saveOrder(copy);
  };
  return (
    <LinearGradient
      colors={theme.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <CommonAppBar title={t("price_alert")} />
        <CommonTouchableOpacity
          onPress={() => {
            navigation.navigate("SelectPriceAlertScreen", {
              order: alerts.length,
            });
          }}
        >
          <View
            style={[
              styles.addContainer,
              {
                borderColor: theme.border7,
                backgroundColor: theme.container6,
              },
            ]}
          >
            <CommonText style={{ fontSize: 18, color: theme.text }}>
              +
            </CommonText>
          </View>
        </CommonTouchableOpacity>
        <View height={20} />
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <DragList
            data={data}
            keyExtractor={(item) => item.id}
            onReordered={onReordered}
            renderItem={renderItem}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  addContainer: {
    height: 67,
    borderStyle: "dashed",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 40,
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
  row: {
    minHeight: 70,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  item: {
    width: "100%",
    marginBottom: 10,
    borderRadius: 10,
  },
  deleteItem: {
    height: 70,
    width: "100%",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  img: {
    width: 49,
    height: 49,
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
    fontSize: 17,
    marginRight: 10,
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
    flex: 4,
    fontSize: 16,
    borderWidth: 1,
    backgroundColor: "red",
    paddingHorizontal: 10,
    height: 45,
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
  deleteButton: {
    width: 75,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
  alertPrice: {
    alignItems: "center",
    flexDirection: "row",
  },
  alertPriceInfo: {
    paddingLeft: 10,
  },
  removeContainer: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
});
