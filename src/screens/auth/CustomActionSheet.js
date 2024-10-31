import React, { useState } from "react";

import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Linking,
  ImageBackground,
  Touchable,
} from "react-native";

import CommonImage from "@components/commons/CommonImage";
import { useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import { useTranslation } from "react-i18next";
import Icon, { Icons } from "@components/icons/Icons";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import { applicationProperties } from "@src/application.properties";
import CommonGradientButton from "@components/commons/CommonGradientButton";
import { useNavigation } from "@react-navigation/native";
import { fonts } from "@modules/core/constant/AppTextStyle";

const CustomActionSheet = (props) => {
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <CommonTouchableOpacity
        style={{
          position: "absolute",
          flex: 1,
          width: "100%",
          height: "100%",
        }}
        onPress={() => {
          props?.onCancel();
        }}
      ></CommonTouchableOpacity>
      <View style={[styles.actionSheetContainer]}>
        <ImageBackground
          source={require("@assets/images/walkthrough/bg2.png")}
          style={{
            flex: 1,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 20,
          }}
        >
          <View style={[styles.agreementHeader]}>
            <View
              style={{
                width: 60,
                height: 6,
                backgroundColor: "#FFFFFF",
                borderRadius: 10,
                marginTop: 20,
                marginBottom: 20,
              }}
            ></View>
            <CommonText style={styles.agreementHeaderText}>
              {t("legal")}
            </CommonText>
          </View>
          <View style={styles.privacyAndTermsContainer}>
            <CommonText
              style={{
                color: "#FFFFFF",
                textAlign: "left",
                marginVertical: 10,
                fontSize: 16,
                marginRight: 40,
                marginBottom: 40,
                fontFamily: fonts.ProximaNova,
              }}
            >
              {t("please_review_the_terms_of_service")}
            </CommonText>
            <View style={[styles.privacyAndTerms]}>
              <CommonTouchableOpacity
                style={[styles.privacyPolicy, { borderBottomColor: "#BEC7C5" }]}
                onPress={async () => {
                  await Linking.openURL(
                    applicationProperties.endpoints.privacyPolicy
                  );
                }}
              >
                <CommonText
                  style={{
                    color: "#949494",
                    fontSize: 16,
                    fontFamily: fonts.ProximaNova,
                  }}
                >
                  {t("privacy_policy")}
                </CommonText>
                <Icon
                  type={Icons.Feather}
                  size={18}
                  name={"chevron-right"}
                  color={"#949494"}
                />
              </CommonTouchableOpacity>
              <CommonTouchableOpacity
                style={styles.termsOfService}
                onPress={async () => {
                  await Linking.openURL(
                    applicationProperties.endpoints.termsOfService
                  );
                }}
              >
                <CommonText
                  style={{
                    color: "#949494",
                    fontSize: 16,
                    fontFamily: fonts.ProximaNova,
                  }}
                >
                  {t("terms_of_service")}
                </CommonText>
                <Icon
                  type={Icons.Feather}
                  size={18}
                  name={"chevron-right"}
                  color={"#949494"}
                />
              </CommonTouchableOpacity>
            </View>
          </View>
          <View style={styles.agreementCheckboxContainer}>
            <CommonTouchableOpacity
              onPress={() => {
                setChecked(!checked);
              }}
            >
              <CommonImage
                style={styles.check}
                source={
                  checked
                    ? require("@assets/images/checkbox/checked.png")
                    : require("@assets/images/checkbox/unchecked.png")
                }
              />
            </CommonTouchableOpacity>
            <CommonText
              style={{
                color: theme.text,
                marginLeft: 10,
                fontSize: 12,
                fontFamily: fonts.ProximaNova,
              }}
            >
              {t("i_have_read_and_accept")}
            </CommonText>
          </View>
          <View style={styles.bottomContainer}>
            <CommonGradientButton
              disabled={!checked}
              text={t("continue")}
              textStyle={{ color: "#FFFFFF", fontFamily: fonts.ProximaNova }}
              onPress={() => {
                if (checked) {
                  props?.onNext();
                }
              }}
            />
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    height: 180,
    width: "100%",

    paddingHorizontal: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  actionSheetContainer: {
    height: "75%",
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    justifyContent: "flex-end",
  },
  agreementHeader: {
    height: 42,
    width: "100%",

    justifyContent: "center",
    alignItems: "center",
  },

  agreementHeaderText: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: fonts.ProximaNova,
  },
  privacyAndTermsContainer: {
    flex: 1,
    padding: 20,
  },
  privacyAndTerms: {
    width: "100%",
    height: 100,
    borderRadius: 21,
    shadowColor: "#000",
    backgroundColor: "#FFFFFF",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    padding: 10,
  },
  privacyPolicy: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    borderBottomWidth: 1,
  },
  termsOfService: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },

  agreementCheckboxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    marginBottom: 60,
  },
  check: {
    width: 32,
    height: 32,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
});

CustomActionSheet.propTypes = {
  onClose: PropTypes.func,
  onNext: PropTypes.func,
};

CustomActionSheet.defaultProps = {
  onClose: () => {},
  onNext: () => {},
};
export default CustomActionSheet;
