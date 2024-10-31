import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Switch,
  View,
  Text,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonText from "@components/commons/CommonText";

import Icon, { Icons } from "@components/icons/Icons";
import ActionSheet from "react-native-actions-sheet";
import { AppLockAction } from "@persistence/applock/AppLockAction";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";
import CommonTouchableHighlight from "@components/commons/CommonTouchableHightlight";
import { fonts } from "@modules/core/constant/AppTextStyle";

export default function SecurityScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const dispatch = useDispatch();
  const actionSheetRef = useRef();
  const actionSheetLockMethodRef = useRef();
  const { appLock } = useSelector((state) => state.AppLockReducer);
  const [isEnabled, setIsEnabled] = useState(appLock.appLock);
  const toggleSwitch = async () => {
    setIsEnabled((previousState) => !previousState);
    const lock = !appLock.appLock;
    const newLock = {
      appLock: lock,
      autoLock: appLock.autoLock,
      biometryLock: appLock.biometryLock,
      appLockText: appLock.appLockText,
    };
    if (!lock) {
      newLock.autoLock = 60;
      newLock.biometryLock = false;
      newLock.appLockText = "app_lock.away1minute";
    }
    dispatch(AppLockAction.setAppLock(newLock));
  };
  const appLockText = {
    "app_lock.away1minute": t("app_lock.away1minute"),
    "app_lock.away5minutes": t("app_lock.away5minutes"),
    "app_lock.away1Hour": t("app_lock.away1Hour"),
    "app_lock.away5Hours": t("app_lock.away5Hours"),
  };
  useEffect(() => {
    (async () => {})();
  }, []);

  return (
    <LinearGradient
      colors={theme.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <CommonAppBar title={t("settings.security")} />

        <View style={styles.content}>
          <View style={[styles.item]}>
            <CommonTouchableHighlight onPress={() => {}}>
              <View style={styles.row}>
                <CommonText
                  style={{ color: theme.text, fontSize: 18, fontWeight: "500" }}
                >
                  {t("settings.app_lock")}
                </CommonText>
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
            </CommonTouchableHighlight>
          </View>
          {appLock.appLock && (
            <>
              <View style={[styles.item]}>
                <CommonTouchableHighlight
                  onPress={() => {
                    actionSheetRef.current?.show();
                  }}
                >
                  <View style={styles.row}>
                    <CommonText
                      style={{
                        color: theme.text,
                        fontSize: 18,
                        fontWeight: "500",
                      }}
                    >
                      {t("app_lock.autolock")}
                    </CommonText>
                    <View style={styles.rightSubItem}>
                      <CommonText
                        style={{
                          color: theme.text,
                          fontSize: 12,
                          fontWeight: "500",
                        }}
                      >
                        {appLockText[appLock.appLockText]}
                      </CommonText>
                    </View>
                  </View>
                </CommonTouchableHighlight>
              </View>
              <View style={[styles.item]}>
                <CommonTouchableHighlight
                  onPress={() => {
                    actionSheetLockMethodRef.current?.show();
                  }}
                >
                  <View style={styles.row}>
                    <CommonText
                      style={{
                        color: theme.text,
                        fontSize: 18,
                        fontWeight: "500",
                      }}
                    >
                      {t("app_lock.lockmethod")}
                    </CommonText>
                    <View style={styles.rightSubItem}>
                      <CommonText
                        style={{
                          color: theme.text,
                          fontSize: 12,
                          fontWeight: "500",
                        }}
                      >
                        {appLock.biometryLock
                          ? Platform.OS === "ios"
                            ? t("app_lock.faceid")
                            : t("app_lock.touchid")
                          : t("app_lock.passcode")}
                      </CommonText>
                    </View>
                  </View>
                </CommonTouchableHighlight>
              </View>
            </>
          )}
        </View>
        <ActionSheet
          ref={actionSheetRef}
          gestureEnabled={true}
          containerStyle={{
            backgroundColor: theme.background8,
            paddingBottom: 20,
            paddingHorizontal: 20,
          }}
          headerAlwaysVisible
        >
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
              App Look
            </CommonText>
          </View>
          <View style={[styles.item]}>
            <CommonTouchableHighlight
              buttonGradientColor={[theme.hightLight, theme.hightLight]}
              onPress={() => {
                const newLock = {
                  appLock: appLock.appLock,
                  autoLock: 60,
                  biometryLock: appLock.biometryLock,
                  appLockText: "app_lock.away1minute",
                };
                dispatch(AppLockAction.setAppLock(newLock));
              }}
            >
              <View style={styles.row}>
                <CommonText
                  style={{ color: theme.text, fontSize: 18, fontWeight: "500" }}
                >
                  {t("app_lock.away1minute")}
                </CommonText>
                <View style={styles.rightSubItem}>
                  {appLock.autoLock === 60 && (
                    <Icon name="check" size={20} type={Icons.Entypo} />
                  )}
                </View>
              </View>
            </CommonTouchableHighlight>
          </View>
          <View style={[styles.item]}>
            <CommonTouchableHighlight
              buttonGradientColor={[theme.hightLight, theme.hightLight]}
              onPress={() => {
                const newLock = {
                  appLock: appLock.appLock,
                  autoLock: 300,
                  biometryLock: appLock.biometryLock,
                  appLockText: "app_lock.away5minutes",
                };
                dispatch(AppLockAction.setAppLock(newLock));
              }}
            >
              <View style={styles.row}>
                <CommonText
                  style={{ color: theme.text, fontSize: 18, fontWeight: "500" }}
                >
                  {t("app_lock.away5minutes")}
                </CommonText>
                <View style={styles.rightSubItem}>
                  {appLock.autoLock === 300 && (
                    <Icon name="check" size={20} type={Icons.Entypo} />
                  )}
                </View>
              </View>
            </CommonTouchableHighlight>
          </View>
          <View style={[styles.item]}>
            <CommonTouchableHighlight
              buttonGradientColor={[theme.hightLight, theme.hightLight]}
              onPress={() => {
                const newLock = {
                  appLock: appLock.appLock,
                  autoLock: 3600,
                  biometryLock: appLock.biometryLock,
                  appLockText: "app_lock.away1Hour",
                };
                dispatch(AppLockAction.setAppLock(newLock));
              }}
            >
              <View style={styles.row}>
                <CommonText
                  style={{ color: theme.text, fontSize: 18, fontWeight: "500" }}
                >
                  {t("app_lock.away1Hour")}
                </CommonText>
                <View style={styles.rightSubItem}>
                  {appLock.autoLock === 3600 && (
                    <Icon name="check" size={20} type={Icons.Entypo} />
                  )}
                </View>
              </View>
            </CommonTouchableHighlight>
          </View>
          <View style={[styles.item]}>
            <CommonTouchableHighlight
              buttonGradientColor={[theme.hightLight, theme.hightLight]}
              onPress={() => {
                const newLock = {
                  appLock: appLock.appLock,
                  autoLock: 18000,
                  biometryLock: appLock.biometryLock,
                  appLockText: "app_lock.away5Hours",
                };
                dispatch(AppLockAction.setAppLock(newLock));
              }}
            >
              <View style={styles.row}>
                <CommonText
                  style={{ color: theme.text, fontSize: 18, fontWeight: "500" }}
                >
                  {t("app_lock.away5Hours")}
                </CommonText>
                <View style={styles.rightSubItem}>
                  {appLock.autoLock === 18000 && (
                    <Icon name="check" size={20} type={Icons.Entypo} />
                  )}
                </View>
              </View>
            </CommonTouchableHighlight>
          </View>
        </ActionSheet>
        <ActionSheet
          ref={actionSheetLockMethodRef}
          gestureEnabled={true}
          containerStyle={{
            backgroundColor: theme.background8,
            paddingBottom: 20,
            paddingHorizontal: 20,
          }}
          headerAlwaysVisible
        >
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
              Look Method
            </CommonText>
          </View>
          <View style={[styles.item]}>
            <CommonTouchableHighlight
              buttonGradientColor={[theme.hightLight, theme.hightLight]}
              onPress={() => {
                const newLock = {
                  appLock: appLock.appLock,
                  autoLock: appLock.autoLock,
                  biometryLock: false,
                  appLockText: appLock.appLockText,
                };
                dispatch(AppLockAction.setAppLock(newLock));
              }}
            >
              <View style={styles.row}>
                <CommonText
                  style={{ color: theme.text, fontSize: 18, fontWeight: "500" }}
                >
                  {t("app_lock.passcode")}
                </CommonText>
                <View style={styles.rightSubItem}>
                  {appLock.biometryLock === false && (
                    <Icon name="check" size={20} type={Icons.Entypo} />
                  )}
                </View>
              </View>
            </CommonTouchableHighlight>
          </View>
          <View style={[styles.item]}>
            <CommonTouchableHighlight
              buttonGradientColor={[theme.hightLight, theme.hightLight]}
              onPress={() => {
                const newLock = {
                  appLock: appLock.appLock,
                  autoLock: appLock.autoLock,
                  biometryLock: true,
                  appLockText: appLock.appLockText,
                };
                dispatch(AppLockAction.setAppLock(newLock));
              }}
            >
              <View style={styles.row}>
                <CommonText
                  style={{ color: theme.text, fontSize: 18, fontWeight: "500" }}
                >
                  {Platform.OS === "android"
                    ? t("app_lock.touchid")
                    : t("app_lock.faceid")}
                </CommonText>
                <View style={styles.rightSubItem}>
                  {appLock.biometryLock === true && (
                    <Icon name="check" size={20} type={Icons.Entypo} />
                  )}
                </View>
              </View>
            </CommonTouchableHighlight>
          </View>
        </ActionSheet>
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
  textItem: { flex: 3 },
  row: {
    minHeight: 45,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  rightSubItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    marginHorizontal: 20,
  },
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
});
