import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import CommonText from "@components/commons/CommonText";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import Icon, { Icons } from "@components/icons/Icons";
import Clipboard from "@react-native-clipboard/clipboard";
import CommonButton from "@components/commons/CommonButton";
import { TokenAction } from "@persistence/token/TokenAction";
import { TokenFactory } from "@modules/core/factory/TokenFactory";
import { applicationProperties } from "@src/application.properties";
import CommonLoading from "@components/commons/CommonLoading";
import _ from "lodash";
import CommonAlert from "@components/commons/CommonAlert";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";
import CommonGradientButton from "@components/commons/CommonGradientButton";

export default function AddTokenScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const dispatch = useDispatch();
  const [network, setNetwork] = useState(applicationProperties.networks[0]);
  const [token, setToken] = useState({
    address: "",
    decimals: "",
    name: "",
    symbol: "",
    logo: "",
    verified: false,
  });
  useEffect(() => {
    (async () => {})();
  }, [network.chain]);
  const fetchTokenMetaData = async () => {
    CommonLoading.show();
    const tokenMetadata = await TokenFactory.getTokenMetadata(
      network.chain,
      token.address
    );
    if (!_.isNil(tokenMetadata)) {
      setToken(tokenMetadata);
      CommonLoading.hide();
      return;
    }
    CommonAlert.show({
      title: t("alert.error"),
      message: t("token_not_found"),
      type: "error",
    });
    CommonLoading.hide();
  };
  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setToken({ ...token, address: text });
  };
  return (
    <LinearGradient
      colors={theme.gradient}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <CommonAppBar title={t("token.add_new_token")} />
        <View style={styles.content}>
          <View style={[styles.formContainer, { borderColor: theme.border }]}>
            <CommonTouchableOpacity
              style={[styles.networkContainer]}
              onPress={() => {
                navigation.navigate("SelectNetworkScreen", {
                  onCallBack: (network) => {
                    setNetwork(network);
                  },
                });
              }}
            >
              <View style={[styles.network]}>
                <CommonText
                  style={[styles.networkText, { color: theme.text2 }]}
                >
                  Network
                </CommonText>
              </View>
              <View style={styles.selectedNetwork}>
                <CommonText
                  style={[styles.networkText, { color: theme.text2 }]}
                >
                  {network.name}
                </CommonText>
                <Icon
                  name="right"
                  size={20}
                  color={theme.text}
                  type={Icons.AntDesign}
                />
              </View>
            </CommonTouchableOpacity>
            <View style={styles.titleContainer}>
              <CommonText style={{ color: theme.text2 }}>
                Contract address
              </CommonText>
            </View>
            <View
              style={[
                styles.inputView,
                {
                  borderColor: theme.border,
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: theme.text }]}
                onChangeText={(v) => {
                  setToken({ ...token, address: v });
                }}
                value={token.address}
                placeholder={t("custom_token.contract_address")}
                returnKeyType="done"
                placeholderTextColor="gray"
                onEndEditing={async () => {
                  await fetchTokenMetaData();
                }}
              />
              <CommonTouchableOpacity
                onPress={async () => {
                  await fetchCopiedText();
                  if (token.address !== "") {
                    await fetchTokenMetaData();
                  }
                }}
                style={styles.moreBtn}
              >
                <Icon
                  name="content-paste"
                  size={20}
                  color={theme.text}
                  type={Icons.MaterialIcons}
                />
              </CommonTouchableOpacity>
            </View>
            <View style={styles.titleContainer}>
              <CommonText style={{ color: theme.text2 }}>Name</CommonText>
            </View>

            <View
              style={[
                styles.inputView,
                {
                  borderColor: theme.border,
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder={t("token_name")}
                numberOfLines={1}
                returnKeyType="done"
                value={token.name}
                placeholderTextColor="gray"
                autoCompleteType={"off"}
                autoCapitalize={"none"}
                autoCorrect={false}
                editable={false}
              />
            </View>
            <View style={styles.titleContainer}>
              <CommonText style={{ color: theme.text2 }}>Symbol</CommonText>
            </View>
            <View
              style={[
                styles.inputView,
                {
                  borderColor: theme.border,
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder={t("token_symbol")}
                numberOfLines={1}
                value={token.symbol}
                returnKeyType="done"
                placeholderTextColor="gray"
                autoCompleteType={"off"}
                autoCapitalize={"none"}
                autoCorrect={false}
                editable={false}
              />
            </View>
            <View style={styles.titleContainer}>
              <CommonText style={{ color: theme.text2 }}>Decimals</CommonText>
            </View>
            <View
              style={[
                styles.inputView,
                {
                  borderColor: theme.border,
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder={t("token_decimals")}
                numberOfLines={1}
                value={token.decimals}
                returnKeyType="done"
                placeholderTextColor="gray"
                autoCompleteType={"off"}
                autoCapitalize={"none"}
                autoCorrect={false}
                editable={false}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CommonGradientButton
              text={t("token_save")}
              onPress={async () => {
                if (token.symbol === "") {
                  return;
                }
                let chainId = 1;
                let logo = applicationProperties.logoURI.eth;
                const platform = {
                  chain: network.chain,
                  contract: token.address,
                };
                if (network.chain === "BSC") {
                  chainId = 56;
                  logo = applicationProperties.logoURI.bsc;
                } else if (network.chain === "POLYGON") {
                  chainId = 137;
                  logo = applicationProperties.logoURI.polygon;
                }
                try {
                  const data = {
                    ...token,
                    id: token.symbol,
                    logoURI: logo,
                    chainId: chainId,
                    verified: false,
                  };
                  const allData = {
                    ...data,
                    platform,
                  };
                  CommonLoading.show();
                  dispatch(TokenAction.addTokenByChain("ALL", allData)).then(
                    ({ isExists }) => {
                      dispatch(
                        TokenAction.addTokenByChain(network.chain, data)
                      ).then(({ isExists }) => {
                        CommonLoading.hide();
                        navigation.goBack();
                      });
                    }
                  );
                } catch (e) {
                  console.log(e);
                }
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  header: {
    height: 48,
    paddingHorizontal: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gradient: {
    width: "100%",
    height: "100%",
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
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  formContainer: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 0.5,
    paddingBottom: 20,
    marginTop: 20,
  },
  networkContainer: {
    width: "100%",
    paddingHorizontal: 20,
    height: 70,
    flexDirection: "row",
  },
  network: {
    width: 100,
    height: "100%",
    justifyContent: "center",
  },
  selectedNetwork: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  networkText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  inputView: {
    height: 70,
    borderWidth: 0.5,
    borderColor: "#c4c4c4",
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 14,
    marginVertical: 10,
    marginBottom: 0,
    marginHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  input: { flex: 1, color: "black" },
  moreBtn: {
    justifyContent: "center",
    marginRight: 10,
    paddingLeft: 10,
  },
  buttonContainer: {
    height: 70,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
});
