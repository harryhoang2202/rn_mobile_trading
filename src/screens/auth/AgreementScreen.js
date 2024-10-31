import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import CommonText from "@components/commons/CommonText";
import { useTranslation } from "react-i18next";
import CommonImage from "@components/commons/CommonImage";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import CommonGradientButton from "@components/commons/CommonGradientButton";
import { fonts } from "@modules/core/constant/AppTextStyle";

export default function AgreementScreen({ navigation }) {
  const { t } = useTranslation();
  const [agreement1, setAgreement1] = useState(false);
  const [agreement2, setAgreement2] = useState(false);
  const [agreement3, setAgreement3] = useState(false);
  useEffect(() => {
    (async () => {})();
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@assets//images/walkthrough/bg2.png")}
        style={[
          styles.backgroundImage,
          { transform: [{ scaleX: 1.05 }, { scaleY: 1 }] },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <CommonImage
              source={require("@assets/images/walkthrough/logo.png")}
              style={{ width: 132, height: 36 }}
            />
            <CommonImage
              source={require("@assets/images/walkthrough/dot.png")}
              style={{ width: 32, height: 32 }}
            />
          </View>
        </View>
        <View height={40} />
        <View style={{ flex: 1 }}>
          <View style={[styles.content]}>
            <View style={styles.titleContainer}>
              <CommonText style={[styles.titleText, { color: "#FFFFFF" }]}>
                {t("backup.back_up_your_wallet_now")}
              </CommonText>
              <CommonText style={[styles.descText]}>
                {t("backup.in_the_next_step")}
              </CommonText>
            </View>
            <View style={styles.imageContainer}>
              <CommonImage
                source={
                  agreement1 && agreement2 && agreement3
                    ? require("@assets/images/walkthrough/05.png")
                    : require("@assets/images/walkthrough/04.png")
                }
                style={{ width: 256, height: 256 }}
              />
            </View>
            <View style={styles.agreementContainer}>
              <View style={[styles.agreementItem]}>
                <CommonTouchableOpacity
                  onPress={() => {
                    setAgreement1(!agreement1);
                  }}
                >
                  <CommonImage
                    style={styles.check}
                    source={
                      agreement1
                        ? require("@assets/images/checkbox/checked.png")
                        : require("@assets/images/checkbox/unchecked.png")
                    }
                  />
                </CommonTouchableOpacity>
                <View style={{ flex: 1 }}>
                  <CommonText
                    style={[styles.agreementText, { color: "#FFFFFF" }]}
                  >
                    {t("backup.if_i_lose")}
                  </CommonText>
                </View>
              </View>
              <View style={[styles.agreementItem]}>
                <CommonTouchableOpacity
                  onPress={() => {
                    setAgreement2(!agreement2);
                  }}
                >
                  <CommonImage
                    style={styles.check}
                    source={
                      agreement2
                        ? require("@assets/images/checkbox/checked.png")
                        : require("@assets/images/checkbox/unchecked.png")
                    }
                  />
                </CommonTouchableOpacity>
                <View style={{ flex: 1 }}>
                  <CommonText
                    style={[styles.agreementText, { color: "#FFFFFF" }]}
                  >
                    {t("backup.if_i_expose")}
                  </CommonText>
                </View>
              </View>
              <View style={[styles.agreementItem]}>
                <CommonTouchableOpacity
                  onPress={() => {
                    setAgreement3(!agreement3);
                  }}
                >
                  <CommonImage
                    style={styles.check}
                    source={
                      agreement3
                        ? require("@assets/images/checkbox/checked.png")
                        : require("@assets/images/checkbox/unchecked.png")
                    }
                  />
                </CommonTouchableOpacity>
                <View style={{ flex: 1 }}>
                  <CommonText
                    style={[styles.agreementText, { color: "#FFFFFF" }]}
                  >
                    {t("backup.never_ask")}
                  </CommonText>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <CommonGradientButton
            text={t("continue")}
            disabled={!(agreement1 && agreement2 && agreement3)}
            textStyle={{ color: "#FFFFFF", fontFamily: fonts.ProximaNova }}
            onPress={() => {
              if (agreement1 && agreement2 && agreement3) {
                navigation.navigate("MnemonicScreen");
              }
            }}
          />
        </View>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10,
  },
  content: {
    flex: 1,
    width: "100%",
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: fonts.ProximaNova,
  },
  descText: {
    marginVertical: 10,
    textAlign: "center",
    color: "#FFFFFF",
    fontFamily: fonts.ProximaNova,
  },
  imageContainer: {
    width: "100%",
    height: 256,
    alignItems: "center",
    justifyContent: "center",
  },
  agreementContainer: {
    width: "100%",
    paddingHorizontal: 40,
  },
  agreementItem: {
    width: "100%",
    height: 50,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  agreementText: {
    fontSize: 15,
    fontFamily: fonts.ProximaNova,
  },
  check: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  bottomContainer: {
    height: 180,
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  logoContainer: {
    height: 80,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingLeft: 40,
    paddingRight: 30,
  },
});
