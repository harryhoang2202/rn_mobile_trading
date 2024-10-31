import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, Switch, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonText from "@components/commons/CommonText";
import Icon, { Icons } from "@components/icons/Icons";
import { StorageUtil } from "@modules/core/util/StorageUtil";
import { NotificationService } from "@persistence/notification/NotificationService";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";
import CommonTouchableHighlight from "@components/commons/CommonTouchableHightlight";
import ActionSheet from "react-native-actions-sheet";
import LanguageScreen from "./LanguageScreen";
import CurrencyScreen from "./CurrencyScreen";

export default function PreferencesScreen({ navigation, route }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { theme, defaultTheme } = useSelector((state) => state.ThemeReducer);
  const [language, setLanguage] = useState("");
  const { currency } = useSelector((state) => state.CurrencyReducer);
  const { data } = useSelector((state) => state.UserReducer);
  const { user } = data;
  const [isEnabled, setIsEnabled] = useState(user.allowNotification);
  const actionSheetLanguagesRef = useRef();
  const actionSheetCurrencyRef = useRef();
  useEffect(() => {
    (async () => {
      await getLanguage();
    })();
  }, []);
  const getLanguage = async () => {
    const lang = (await StorageUtil.getItem("@lng")) || "en";
    switch (lang) {
      case "en":
        setLanguage(t("language.english"));
        break;
      case "cn":
        setLanguage(t("language.chinese"));
        break;
      case "vi":
        setLanguage(t("language.vietnamese"));
        break;
      case "tw":
        setLanguage(t("language.taiwanese"));
        break;
      case "jp":
        setLanguage(t("language.japanses"));
        break;
      case "kr":
        setLanguage(t("language.korean"));
        break;
      case "in":
        setLanguage(t("language.indian"));
        break;
      case "indo":
        setLanguage(t("language.indonesian"));
        break;
      case "ma":
        setLanguage(t("language.malaysian"));
        break;
    }
  };
  const toggleSwitch = async () => {
    NotificationService.toggleSubscribe(!isEnabled);
    setIsEnabled((previousState) => !previousState);
  };
  return (
    <LinearGradient
      colors={theme.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <CommonAppBar title={t("settings.preferences")} />
        <View style={styles.content}>
          <View style={[styles.item]}>
            <CommonTouchableHighlight
              onPress={() => {
                //   navigation.navigate("LanguageScreen", {
                //     onCallBack: getLanguage,
                //   });
                actionSheetLanguagesRef.current?.show();
              }}
            >
              <View style={styles.row}>
                <View style={styles.leftSubItem}>
                  <Icon
                    name="language"
                    size={20}
                    type={Icons.Ionicons}
                    color={theme.text}
                  />
                </View>
                <View style={styles.centerSubItem}>
                  <CommonText style={[{ color: theme.text }, styles.textItem]}>
                    {t("settings.language")}
                  </CommonText>
                </View>
                <View style={styles.rightSubItem}>
                  <View style={{ flexDirection: "row" }}>
                    <CommonText
                      style={{
                        color: theme.text,
                        fontWeight: "500",
                        fontSize: 12,
                      }}
                    >
                      {language}
                    </CommonText>
                  </View>
                </View>
              </View>
            </CommonTouchableHighlight>
          </View>
          <View style={[styles.item]}>
            <CommonTouchableHighlight
              onPress={() => {
                actionSheetCurrencyRef.current?.show();
              }}
            >
              <View style={styles.row}>
                <View style={styles.leftSubItem}>
                  <Icon
                    name="currency-usd"
                    size={20}
                    type={Icons.MaterialCommunityIcons}
                    color={theme.text}
                  />
                </View>
                <View style={styles.centerSubItem}>
                  <CommonText style={[{ color: theme.text }, styles.textItem]}>
                    {t("settings.currency")}
                  </CommonText>
                </View>
                <View style={styles.rightSubItem}>
                  <View style={{ flexDirection: "row" }}>
                    <CommonText
                      style={{
                        color: theme.text,
                        fontWeight: "500",
                        fontSize: 12,
                      }}
                    >
                      {currency.code} - {currency.name}
                    </CommonText>
                  </View>
                </View>
              </View>
            </CommonTouchableHighlight>
          </View>
          <View style={[styles.item]}>
            <CommonTouchableHighlight
              onPress={() => {
                navigation.navigate("CurrencyScreen");
              }}
            >
              <View style={styles.row}>
                <View style={styles.leftSubItem}>
                  <Icon
                    name="notifications-none"
                    size={20}
                    type={Icons.MaterialIcons}
                    color={theme.text}
                  />
                </View>
                <View style={styles.centerSubItem}>
                  <CommonText style={[{ color: theme.text }, styles.textItem]}>
                    {t("settings.notification")}
                  </CommonText>
                </View>
                <View style={styles.rightSubItem}>
                  <Switch
                    trackColor={{
                      false: theme.switchInactive,
                      true: theme.switchActive,
                    }}
                    thumbColor={theme.container4}
                    ios_backgroundColor="#3e3e3e"
                    value={isEnabled}
                    onValueChange={toggleSwitch}
                  />
                </View>
              </View>
            </CommonTouchableHighlight>
          </View>
          <ActionSheet
            ref={actionSheetLanguagesRef}
            gestureEnabled={true}
            containerStyle={{
              backgroundColor: theme.background8,
              paddingBottom: 20,
              paddingHorizontal: 20,
            }}
            headerAlwaysVisible
          >
            <LanguageScreen
              onCallBack={() => {
                getLanguage();
              }}
            />
          </ActionSheet>
          <ActionSheet
            ref={actionSheetCurrencyRef}
            gestureEnabled={true}
            containerStyle={{
              backgroundColor: theme.background8,
              paddingBottom: 20,
              paddingHorizontal: 20,
              minHeight: 200,
            }}
            headerAlwaysVisible
          >
            <CurrencyScreen />
          </ActionSheet>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
  },
  header: {
    height: 50,
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
  leftSubItem: { width: 20 },
  rightSubItem: {},
  centerSubItem: { flex: 1 },
  textItem: { marginLeft: 15, fontWeight: "500", fontSize: 18 },
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
  row: {
    minHeight: 45,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
});
