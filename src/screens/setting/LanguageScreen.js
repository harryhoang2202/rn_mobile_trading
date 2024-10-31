import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonText from "@components/commons/CommonText";

import i18n from "i18next";
import Icon, { Icons } from "@components/icons/Icons";
import { StorageUtil } from "@modules/core/util/StorageUtil";
import CommonTouchableHighlight from "@components/commons/CommonTouchableHightlight";
import { fonts } from "@modules/core/constant/AppTextStyle";

export default function LanguageScreen({ onCallBack }) {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const dispatch = useDispatch();
  const [currentLang, setCurrentLang] = useState("");
  useEffect(() => {
    (async () => {
      const lang = (await StorageUtil.getItem("@lng")) || "en";
      setCurrentLang(lang);
    })();
  }, []);
  const setLanguage = async (lng) => {
    await i18n.changeLanguage(lng);
    await StorageUtil.setItem("@lng", lng);
    await onCallBack();
  };

  const renderLanguageItem = (langCode, langName) => {
    return (
      <View style={[styles.item]}>
        <CommonTouchableHighlight
          buttonGradientColor={[theme.hightLight, theme.hightLight]}
          onPress={() => setLanguage(langCode)}
        >
          <View style={styles.row}>
            <CommonText style={[{ color: theme.text }, styles.textItem]}>
              {langName}
            </CommonText>
            {currentLang === langCode && (
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
          Language
        </CommonText>
      </View>
      {renderLanguageItem("en", t("language.english"))}
      {renderLanguageItem("vi", t("language.vietnamese"))}
      {renderLanguageItem("cn", t("language.chinese"))}
      {renderLanguageItem("tw", t("language.taiwanese"))}
      {renderLanguageItem("in", t("language.indian"))}
      {renderLanguageItem("indo", t("language.indonesian"))}
      {renderLanguageItem("jp", t("language.japanses"))}
      {renderLanguageItem("kr", t("language.korean"))}
      {renderLanguageItem("ma", t("language.malaysian"))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: "70%",
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
  textItem: { marginLeft: 10, flex: 3, fontSize: 18, fontWeight: "500" },
  content: {},
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
});
