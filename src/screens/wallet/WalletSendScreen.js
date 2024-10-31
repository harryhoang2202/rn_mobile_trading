import React, { useEffect, useRef, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonText from "@components/commons/CommonText";
import { useTranslation } from "react-i18next";
import { Icons } from "@components/icons/Icons";
import Clipboard from "@react-native-clipboard/clipboard";
import ActionSheet from "react-native-actions-sheet";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import { WalletFactory } from "@modules/core/factory/WalletFactory";
import CommonAlert from "@components/commons/CommonAlert";
import CommonLoading from "@components/commons/CommonLoading";
import { WalletAction } from "@persistence/wallet/WalletAction";
import Price from "@components/Price";
import Balance from "@components/Balance";
import CommonGradientButton from "@components/commons/CommonGradientButton";
import { ASSET_TYPE_TOKEN } from "@modules/core/constant/constant";
import LinearGradient from "react-native-linear-gradient";
import CommonImage from "@components/commons/CommonImage";
import CommonKeyBoard from "@components/commons/CommonKeyBoard";
import { TouchableOpacity } from "react-native-gesture-handler";
import CommonAppBar from "@components/commons/CommonAppBar";
import { usePriceDetailHook } from "@persistence/price/PriceHook";
import { fonts } from "@modules/core/constant/AppTextStyle";

export default function WalletSendScreen({ navigation, route }) {
  const { activeWallet } = useSelector((state) => state.WalletReducer);
  const { getCurrentPriceDetail } = usePriceDetailHook(
    activeWallet.activeAsset.id
  );
  const { prices } = useSelector((state) => state.PriceReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { fee: feeData } = useSelector((state) => state.FeeReducer);
  const [fee] = useState(feeData[activeWallet.activeAsset.chain]);
  const [destination, setDestination] = useState("");
  const [value, setValue] = useState("0.00");
  const [maxAmount, setMaxAmount] = useState(0);
  const [toFiat, setToFiat] = useState(0);
  const [estimatedGasFee, setEstimatedGasFee] = useState({});
  const [serviceFee, setServiceFee] = useState(0);
  const actionSheetRef = useRef(null);
  const actionCamera = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [gasFee, setGasFee] = useState({
    BTC: 0.003,
  });
  const [isUSDPrice, setIsUSDPrice] = useState(false);

  useEffect(() => {
    (async () => {
      initMaxAmount();
    })();
  }, []);
  const initMaxAmount = () => {
    try {
      let maxAmount = activeWallet.activeAsset.balance;
      let makerFee = fee.rate;
      let makerAmount = (activeWallet.activeAsset.balance * makerFee) / 100;
      if (activeWallet.activeAsset.type === ASSET_TYPE_TOKEN) {
        maxAmount -= makerAmount;
      } else {
        maxAmount =
          maxAmount - makerAmount - gasFee[activeWallet.activeAsset.chain];
      }
      setMaxAmount(maxAmount > 0 ? maxAmount.toString() : "0.00");
    } catch (e) {
      console.log(e);
    }
  };
  const getServiceFee = async (balance) => {
    let makerFee = fee.rate;
    return (balance * makerFee) / 100;
  };
  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setDestination(text);
  };
  const onSuccess = (e) => {
    setDestination(e.data);
    actionCamera.current?.setModalVisible(false);
  };
  const prepareTx = async () => {
    if (!value || !destination) {
      CommonAlert.show({
        title: t("alert.error"),
        message: t("please_fill"),
        type: "error",
      });
      return;
    }
    if (value <= 0) {
      CommonAlert.show({
        title: t("alert.error"),
        message: t("insufficient_fund"),
        type: "error",
      });
      return;
    }
    const tran = {
      privateKey: activeWallet.activeAsset.privateKey,
      from: activeWallet.activeAsset.walletAddress,
      to: destination,
      value: value,
    };
    if (fee.enabled) {
      tran.takerFee = fee.rate;
      tran.takerAddress = fee.address;
    }
    const { success, data } = await WalletFactory.getTransactionFee(
      activeWallet.activeAsset.chain,
      tran
    );
    if (!success) {
      CommonAlert.show({
        title: t("alert.error"),
        message: data,
        type: "error",
      });
      return;
    }
    setEstimatedGasFee(data);
    const makerFee = await getServiceFee(value);
    setServiceFee(makerFee);
    actionSheetRef.current?.show();
  };
  const onEndEditing = async () => {
    if (!value || !destination) {
      return;
    }
    await prepareTx();
  };
  const executeTX = async () => {
    const tran = {
      privateKey: activeWallet.activeAsset.privateKey,
      from: activeWallet.activeAsset.walletAddress,
      to: destination,
      value: value,

      gasFee: estimatedGasFee.estimateGas?.btc,
    };
    if (fee.enabled) {
      tran.takerFee = fee.rate;
      tran.takerAddress = fee.address;
    }
    const { success, data } = await WalletFactory.sendTransaction(
      activeWallet.activeAsset.chain,
      tran
    );
    if (success) {
      actionSheetRef.current?.hide();
      reset();
    } else {
      CommonAlert.show({
        title: t("alert.error"),
        message: data,
        type: "error",
      });
    }
  };
  const onRefresh = async () => {
    CommonLoading.show();
    dispatch(WalletAction.balance()).then(() => {
      CommonLoading.hide();
    });
  };
  const reset = () => {
    setToFiat("");
    setValue("");
    setEstimatedGasFee({});
    setServiceFee(0);
    setDestination("");
  };
  return (
    <LinearGradient
      colors={theme.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={[styles.container]}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <CommonAppBar
            title={`${t("send.send_transaction")} ${
              activeWallet.activeAsset.symbol
            }`}
          />

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <CommonImage
              source={{ uri: activeWallet.activeAsset.logoURI }}
              style={{
                height: 100,
                width: 100,
                alignItems: "center",
              }}
            />
          </View>
          <View style={styles.content}>
            <View
              style={[styles.inputView, { backgroundColor: theme.hightLight }]}
            >
              <CommonText
                style={{
                  fontSize: 16,
                  color: theme.text,
                  fontWeight: "700",
                  marginTop: 5,
                  marginBottom: 10,
                  fontFamily: fonts.Nunito,
                }}
              >
                Destination
              </CommonText>
              <TextInput
                style={[
                  {
                    color: theme.text,
                    textAlign: "center",
                    fontFamily: "Nunito-Regular",
                    fontWeight: "400",
                    fontSize: 36,
                  },
                ]}
                onChangeText={(v) => setDestination(v)}
                value={destination}
                onEndEditing={async () => {
                  await onEndEditing();
                }}
              ></TextInput>
            </View>
            <View
              style={[styles.inputView, { backgroundColor: theme.hightLight }]}
            >
              <CommonText
                style={{
                  fontSize: 16,
                  color: theme.text,
                  fontWeight: "700",
                  marginTop: 5,
                  marginBottom: 10,
                  fontFamily: fonts.Nunito,
                }}
              >
                Amount
              </CommonText>
              <TextInput
                style={[
                  {
                    color: theme.text,
                    textAlign: "center",
                    fontFamily: "Nunito-Bold",
                    fontWeight: "bold",
                    fontSize: 46,
                  },
                ]}
                value={value}
                onChangeText={(text) => {
                  setValue(text);
                  setToFiat(text * getCurrentPriceDetail(0));
                }}
                onEndEditing={async () => {
                  await onEndEditing();
                }}
              ></TextInput>
            </View>
            <View style={styles.fiatContainer}>
              <CommonText>
                <CommonText style={styles.totalOfferAmount}>
                  {t("total_offer_amount")} {": "} {value}{" "}
                  {activeWallet.activeAsset.symbol}
                  {" ("}
                </CommonText>
                <Price style={styles.totalOfferAmount}>{toFiat}</Price>
                <CommonText style={styles.totalOfferAmount}>{")"}</CommonText>
              </CommonText>
            </View>
          </View>
          <LinearGradient
            colors={theme.gradient3}
            style={{
              height: 83,
              borderRadius: 16,
              marginHorizontal: 25,
              marginBottom: 10,
              justifyContent: "center",
              paddingHorizontal: 20,
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <CommonText style={{ color: theme.text2, fontSize: 13 }}>
                Service fee
              </CommonText>
              <Balance
                symbol={activeWallet.activeAsset.symbol}
                style={{ fontSize: 13 }}
              >
                {serviceFee}
              </Balance>
            </View>
            <View height={5} />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <CommonText style={{ color: theme.text2, fontSize: 13 }}>
                Network Fee
              </CommonText>
              <Balance
                symbol={activeWallet.activeAsset.symbol}
                style={{ fontSize: 13 }}
              >
                {estimatedGasFee.estimateGas?.btc}
              </Balance>
            </View>
          </LinearGradient>

          <View
            style={{
              height: 62,

              flex: 1,
              backgroundColor: theme.hightLight,
              marginHorizontal: 25,
              borderRadius: 19,
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setIsUSDPrice(false);
              }}
            >
              <View
                style={{
                  width: 175,
                  height: "100%",
                  borderRadius: 19,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  backgroundColor: isUSDPrice ? "transparent" : theme.container,
                }}
              >
                <CommonImage
                  source={{ uri: activeWallet.activeAsset.logoURI }}
                  style={{
                    height: 28,
                    width: 28,
                    alignItems: "center",
                  }}
                />
                <View
                  style={{
                    alignItems: "center",
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <CommonText
                    style={{
                      color: isUSDPrice ? theme.text : theme.text6,
                      fontWeight: "500",
                      fontSize: 13,
                    }}
                  >
                    {activeWallet.activeAsset.symbol}
                  </CommonText>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsUSDPrice(true);
              }}
            >
              <View
                style={{
                  width: 175,
                  height: "100%",
                  borderRadius: 19,
                  paddingHorizontal: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isUSDPrice ? theme.container : "transparent",
                }}
              >
                <CommonImage
                  source={require("@assets/images/countries/usa.png")}
                  style={{
                    height: 28,
                    width: 28,
                    alignItems: "center",
                  }}
                />
                <View
                  style={{
                    alignItems: "center",
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <CommonText
                    style={{
                      color: isUSDPrice ? theme.text6 : theme.text,
                      fontWeight: "500",
                      fontSize: 13,
                    }}
                  >
                    USD
                  </CommonText>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View height={40} />
          <View style={styles.buttonContainer}>
            <CommonGradientButton
              text={t("tx.send")}
              onPress={async () => {
                await executeTX();
              }}
              textStyle={{
                fontSize: 20,
                fontFamily: fonts.ProximaNova,
                fontWeight: "700",
              }}
            />
          </View>
          <ActionSheet
            ref={actionSheetRef}
            gestureEnabled={true}
            containerStyle={{ backgroundColor: theme.background7 }}
            headerAlwaysVisible
          >
            <View
              style={[styles.confirmTx, { backgroundColor: theme.background7 }]}
            >
              <View
                style={[
                  styles.confirmTxHeader,
                  { backgroundColor: theme.background7 },
                ]}
              >
                <View
                  style={[
                    styles.confirmTxItem,
                    {
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <CommonText
                    style={{
                      fontWeight: "bold",
                      fontSize: 18,
                    }}
                  >
                    {t("send.confirm_transaction")}
                  </CommonText>
                </View>
              </View>

              <View style={styles.confirmTxItem}>
                <CommonText>{t("send.amount")}</CommonText>
                <Balance symbol={activeWallet.activeAsset.symbol}>
                  {value}
                </Balance>
              </View>
              {fee.enabled === true && (
                <View style={styles.confirmTxItem}>
                  <CommonText>{t("send.service_fee")}</CommonText>
                  <Balance symbol={activeWallet.activeAsset.symbol}>
                    {serviceFee}
                  </Balance>
                </View>
              )}
              <View style={styles.confirmTxItem}>
                <CommonText>{t("send.estimated_gas_fee")}</CommonText>
                <Balance symbol={activeWallet.activeAsset.symbol}>
                  {estimatedGasFee.estimateGas?.btc}
                </Balance>
              </View>
              <View style={styles.confirmTxItem}>
                <CommonText>{t("send.total")}</CommonText>
                <Balance symbol={activeWallet.activeAsset.symbol}>
                  {parseFloat(estimatedGasFee.estimateGas?.btc * 2) +
                    parseFloat(value) +
                    parseFloat(serviceFee)}
                </Balance>
              </View>
              <View style={styles.confirmTxButton}>
                <CommonGradientButton
                  text={t("tx.send")}
                  onPress={async () => {
                    await executeTX();
                  }}
                />
              </View>
            </View>
          </ActionSheet>
          <ActionSheet
            ref={actionCamera}
            gestureEnabled={true}
            headerAlwaysVisible
            containerStyle={styles.cameraContainer}
          >
            <QRCodeScanner
              onRead={onSuccess}
              cameraContainerStyle={{ margin: 20 }}
              flashMode={RNCamera.Constants.FlashMode.auto}
            />
          </ActionSheet>
        </ScrollView>
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
    alignItems: "center",
    height: "100%",
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },

  inputView: {
    height: 96,
    paddingHorizontal: 5,
    borderRadius: 10,
    marginHorizontal: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 36,
    width: "100%",
  },

  fiatContainer: {
    justifyContent: "center",
    flexDirection: "row",
    height: 50,
    alignItems: "center",
  },

  cameraContainer: {
    margin: 10,
    backgroundColor: "black",
    height: 500,
  },
  confirmTx: {
    width: "100%",
  },
  confirmTxItem: {
    height: 40,
    width: "100%",
    marginVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  totalOfferAmount: {
    color: "#616161",
    fontSize: 14,
  },
  confirmTxHeader: {
    height: 50,
    width: "100%",
  },
  confirmTxButton: {
    marginVertical: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    height: 70,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});
