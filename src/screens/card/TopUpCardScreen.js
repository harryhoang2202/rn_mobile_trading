import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import ActionSheet from "react-native-actions-sheet";
import CommonLoading from "@components/commons/CommonLoading";
import CommonBackButton from "@components/commons/CommonBackButton";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import CommonGradientButton from "@components/commons/CommonGradientButton";
import { Logs } from "@modules/log/logs";
import CommonFlatList from "@components/commons/CommonFlatList";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import CommonImage from "@components/commons/CommonImage";
import Balance from "@components/Balance";
import CommonAlert from "@components/commons/CommonAlert";
import { WalletFactory } from "@modules/core/factory/WalletFactory";
import { PriceService } from "@persistence/price/PriceService";
import { OrderService } from "@persistence/order/OrderService";
import useCardTypeDetailHook from "@persistence/card/CardTypeHook";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";
import CommonTouchableHighlight from "@components/commons/CommonTouchableHightlight";
import { Checkbox, RadioButton } from "react-native-paper";

export default function TopUpCardScreen({ navigation, route }) {
  const { item: card } = route.params;

  const { theme } = useSelector((state) => state.ThemeReducer);
  const { cardType: item } = useCardTypeDetailHook(card.cardTypeId);
  const { activeWallet } = useSelector((state) => state.WalletReducer);
  const { fee: feeData } = useSelector((state) => state.FeeReducer);
  const [amount, setAmount] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState({});
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [cardFee, setCardFee] = useState("");
  const [topUpFee, setTopUpFee] = useState("");
  const [estimateGas, setEstimateGas] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const actionSheetRef = useRef(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isDefault, setDefault] = useState(true);
  const [isAcceptTerms, setAcceptTerms] = useState(false);
  const [isPrivateCard, setPrivateCard] = useState(true);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    (async () => {
      const methods = _.filter(activeWallet.coins, function (wallet) {
        return _.includes(["ETH", "BSC", "POLYGON"], wallet.chain);
      });
      setPaymentMethods(methods);
      setSelectedMethod(methods[0]);
    })();
  }, []);

  const prepareTx = async () => {
    if (_.isEmpty(amount)) {
      CommonAlert.show({
        title: t("alert.error"),
        message: t("please_fill"),
        type: "error",
      });
      return;
    }
    if (amount < 50 || amount > item.balanceLimit) {
      CommonAlert.show({
        title: t("alert.error"),
        message: `The amount should between 50 and ${item.balanceLimit}`,
        type: "error",
      });
      return;
    }

    try {
      CommonLoading.show();
      const price = await PriceService.getCurrentPrice(selectedMethod.id);
      setCurrentPrice(price[0]);
      const cryptoValue = parseFloat(amount) / parseFloat(price[0]);
      setCryptoAmount(`${cryptoValue}`);
      const topUpPrice = parseFloat(item.topUpFee) / parseFloat(price[0]);
      const topUpPricePercent =
        (parseFloat(amount) * parseFloat(item.topUpFeePercent)) /
        100 /
        parseFloat(price[0]);
      setTopUpFee(`${topUpPrice + topUpPricePercent}`);
      const fee = feeData[selectedMethod.chain];
      const tx = {
        from: selectedMethod.walletAddress,
        to: fee.address,
        value: cryptoValue,
      };
      const { success, data } = await WalletFactory.getTransactionFee(
        selectedMethod.chain,
        tx
      );
      if (success === false) {
        CommonAlert.show({
          title: t("alert.error"),
          message: data,
          type: "error",
        });
        return;
      }
      setEstimateGas(data.estimateGas);
      const total =
        cryptoValue +
        parseFloat(data.estimateGas?.ether) +
        +topUpPrice +
        topUpPricePercent;
      setTotalAmount(`${total}`);
      actionSheetRef.current?.show();
    } catch (error) {
      Logs.error("TopUpCardScreen: prepareTx" + error);
    } finally {
      CommonLoading.hide();
    }
  };
  const executeTX = async () => {
    actionSheetRef.current?.hide();
    try {
      CommonLoading.show();
      const tx = {
        to: selectedMethod.walletAddress,
        value: totalAmount,
      };
      const { success, data } = await WalletFactory.sendTransaction(
        selectedMethod.chain,
        {
          ...tx,
          ...estimateGas.gas,
        }
      );
      if (success === true) {
        await createOrder(data.tx);
      } else {
        CommonAlert.show({
          title: t("alert.error"),
          message: data,
          type: "error",
        });
      }
    } catch (error) {
      Logs.error("TopUpCardScreen: executeTX" + error);
      CommonAlert.show({
        title: t("alert.error"),
        message: error,
        type: "error",
      });
    } finally {
      CommonLoading.hide();
    }
  };
  const createOrder = async (txHash) => {
    const order = {
      type: "DEPOSIT",
      cardId: card.id,
      chain: selectedMethod.chain,
      originalAmount: amount,
      totalAmount: parseFloat(totalAmount) * currentPrice,
      status: "NEW",
      txId: txHash,
      price: currentPrice,
    };
    const { success, data } = await OrderService.add(order);
    if (success === true) {
      CommonAlert.show({
        title: t("alert.success"),
        message: t("tx.your_transaction_has_been_sent"),
      });
      navigation.pop(2);
    }
  };
  const renderItem = ({ item: methodItem }) => {
    return (
      <View style={[styles.itemContainer]}>
        <CommonTouchableHighlight
          onPress={async () => {
            setSelectedMethod(methodItem);
          }}
        >
          <View style={styles.item}>
            <CommonImage
              style={styles.img}
              source={{ uri: methodItem.logoURI }}
            />
            <View style={styles.itemContent}>
              <View>
                <CommonText style={styles.itemName} numberOfLines={1}>
                  {methodItem.symbol}
                </CommonText>
                <CommonText
                  style={[styles.itemNetwork, { color: theme.subText }]}
                  numberOfLines={1}
                >
                  {methodItem.chain} Network
                </CommonText>
              </View>
              <View>
                <Balance symbol={item.symbol}>{methodItem.balance}</Balance>
              </View>
            </View>
            <RadioButton.Android
              value={methodItem.id}
              uncheckedColor={theme.switchInactive}
              color={theme.switchActive}
              status={
                selectedMethod.id === methodItem.id ? "checked" : "unchecked"
              }
              onPress={() => {
                setSelectedMethod(methodItem);
              }}
            />
            {item.discount && (
              <View
                style={{
                  position: "absolute",
                  height: 50,
                  width: 80,
                  right: 70,
                }}
              >
                <View
                  style={{
                    height: 50,
                    width: 80,
                    backgroundColor: "#F3BA2F",
                    position: "absolute",
                    transform: [{ skewX: "-40deg" }],
                  }}
                />
                <View
                  style={{
                    height: 50,
                    width: 80,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CommonText
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      color: theme.text8,
                    }}
                  >
                    -{item.discount}%
                  </CommonText>
                </View>
              </View>
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
        <ScrollView>
          <CommonAppBar title={item.name} />
          <View style={styles.content}>
            <CommonText
              style={{
                fontSize: 14,
                color: theme.text,
                textAlign: "justify",
                marginVertical: 20,
              }}
            >
              Select the currency you wish to use for purchasing your Pentacard.
              If you opt to use Pentacoin, all our service fees and recurring
              costs are reduced by 20%. The payment will be automatically
              deducted from your wallet, based on the cryptocurrency you select
              for payment.
            </CommonText>
            <CommonText style={[styles.inputTitle, { marginLeft: 10 }]}>
              Top-Up Amount ($)
            </CommonText>
            <View
              style={[
                styles.inputView,
                { backgroundColor: theme.inputBackground },
              ]}
            >
              <TextInput
                style={[styles.input, { color: theme.inputText }]}
                onChangeText={(value) => setAmount(value)}
                value={amount}
                placeholder={t("Top-Up Amount")}
                numberOfLines={1}
                returnKeyType="done"
                placeholderTextColor="gray"
                autoCompleteType={"off"}
                autoCapitalize={"none"}
                autoCorrect={false}
                onEndEditing={async () => {}}
              />
            </View>

            <View style={styles.paymentMethodContainer}>
              <CommonText style={styles.paymentTitle}>
                Payment Methods
              </CommonText>
              <CommonFlatList
                style={styles.listContainer}
                data={paymentMethods}
                renderItem={renderItem}
              />
            </View>
            <View height={20} />
            <View
              style={{
                height: 36,
                backgroundColor: theme.container7,
                borderRadius: 6,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <RadioButton.Android
                value={isDefault}
                uncheckedColor={theme.switchInactive}
                color={theme.switchActive}
                status={isDefault ? "checked" : "unchecked"}
                onPress={() => {
                  setDefault(true);
                }}
              />
              <CommonText style={{ paddingLeft: 10, fontSize: 12 }}>
                Default Pentacard (Plastic)
              </CommonText>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "48%",
                  height: 36,
                  borderRadius: 6,
                  backgroundColor: theme.container7,
                  alignItems: "center",
                }}
              >
                <Checkbox.Android
                  value={!isPrivateCard}
                  status={!isPrivateCard ? "checked" : "unchecked"}
                  onPress={() => {
                    setPrivateCard(false);
                  }}
                />
                <CommonText style={{ paddingLeft: 10, fontSize: 12 }}>
                  With printed names
                </CommonText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: "48%",
                  height: 36,
                  borderRadius: 6,
                  backgroundColor: theme.container7,
                  alignItems: "center",
                }}
              >
                <Checkbox.Android
                  value={isPrivateCard}
                  status={isPrivateCard ? "checked" : "unchecked"}
                  onPress={() => {
                    setPrivateCard(true);
                  }}
                />
                <CommonText style={{ paddingLeft: 10, fontSize: 12 }}>
                  Private card
                </CommonText>
              </View>
            </View>
            <View
              style={{
                height: 36,
                backgroundColor: theme.container7,
                borderRadius: 6,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 30,
                padding: 5,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <RadioButton.Android
                  value={!isDefault}
                  uncheckedColor={theme.switchInactive}
                  color={theme.switchActive}
                  status={!isDefault ? "checked" : "unchecked"}
                  onPress={() => {
                    setDefault(false);
                  }}
                />
                <CommonText style={{ paddingLeft: 10, fontSize: 12 }}>
                  Customized Card
                </CommonText>
              </View>
              <View
                style={{
                  width: "50%",
                  backgroundColor: theme.container8,
                  borderRadius: 6,
                  height: 26,
                }}
              >
                <TextInput
                  onChangeText={(value) => {}}
                  editable={!isDefault}
                  style={[styles.input, { color: theme.text }]}
                  placeholder={"ID Card"}
                  numberOfLines={1}
                  placeholderTextColor={theme.hightLight}
                />
              </View>
            </View>
            <CommonText style={{ paddingTop: 10 }}>
              <CommonText style={{ color: theme.text }}>
                If you desire a custom Pentacard, you can select and purchase
                one at{" "}
                <CommonText style={{ color: theme.text9, paddingTop: 10 }}>
                  Pentacard.com
                </CommonText>
              </CommonText>
            </CommonText>
          </View>

          <View style={styles.buttonContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton.Android
                value={isAcceptTerms}
                uncheckedColor={theme.switchInactive}
                color={theme.switchActive}
                status={isAcceptTerms ? "checked" : "unchecked"}
                onPress={() => {
                  setAcceptTerms(isAcceptTerms ? false : true);
                }}
              />
              <CommonText style={{ paddingLeft: 10, fontSize: 12 }}>
                I accept the terms and conditions
              </CommonText>
            </View>

            <TouchableOpacity
              onPress={prepareTx}
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "70%",
              }}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={theme.gradient10}
                style={{
                  height: 64,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 1000,
                  marginTop: 20,
                }}
              >
                <CommonText
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: theme.text3,
                  }}
                >
                  Pay
                </CommonText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
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
          style={[styles.confirmTx, { backgroundColor: theme.background8 }]}
        >
          <View style={[styles.confirmTxHeader]}>
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
            <Balance symbol={selectedMethod.symbol}>{cryptoAmount}</Balance>
          </View>
          <View style={styles.confirmTxItem}>
            <CommonText>{t("send.estimated_gas_fee")}</CommonText>
            <Balance symbol={selectedMethod.symbol}>
              {estimateGas?.ether}
            </Balance>
          </View>
          <View style={styles.confirmTxItem}>
            <CommonText>{t("card.activation")}</CommonText>
            <Balance symbol={selectedMethod.symbol}>{cardFee}</Balance>
          </View>
          <View style={styles.confirmTxItem}>
            <CommonText>{t("card.first_deposit")}</CommonText>
            <Balance symbol={selectedMethod.symbol}>{topUpFee}</Balance>
          </View>
          <View style={styles.confirmTxItem}>
            <CommonText>{t("send.total")}</CommonText>
            <Balance symbol={selectedMethod.symbol}>{totalAmount}</Balance>
          </View>
          <View style={styles.confirmTxButton}>
            <CommonGradientButton text={t("tx.send")} onPress={executeTX} />
          </View>
        </View>
      </ActionSheet>
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
  content: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    marginBottom: 10,
    borderRadius: 10,
  },
  item: {
    flex: 1,
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },
  img: {
    width: 32,
    height: 32,
    marginRight: 0,
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 10,
    backgroundColor: "black",
    borderRadius: 100,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  itemName: {
    fontSize: 17,
  },
  itemSymbol: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    textAlign: "right",
  },
  row: {
    minHeight: 90,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftItemContainer: {
    height: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rightItemContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  browserContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 0 : 48,
  },
  sessionRequestContainer: {
    width: "100%",
    marginBottom: Platform.OS === "android" ? 0 : 170,
  },
  titleContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  contentContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    minHeight: 200,
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 10,
  },
  haftButton: {
    width: "50%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  browserHeader: {
    height: 30,
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
  cardImage: {
    width: "100%",
    height: 230,
    borderRadius: 20,
  },
  imageContainer: {
    width: "100%",
  },
  coinStatisticItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 55,
    borderBottomWidth: 0.5,
  },
  coinStatisticSubtitle: {
    fontSize: 10,
  },
  inputView: {
    height: 60,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 5,
    borderRadius: 10,
    fontSize: 14,
    marginVertical: 10,
    marginBottom: 0,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  input: { flex: 1, color: "black", paddingHorizontal: 10 },
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
  middleHeader: {
    flex: 1,
  },
  max: {
    textTransform: "capitalize",
    fontWeight: "bold",
  },
  totalOfferAmount: {
    color: "#616161",
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
  paymentMethodContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  listContainer: {
    minHeight: 100,
    width: "100%",
    paddingHorizontal: 10,
  },
  paymentTitle: {
    fontWeight: "bold",
    marginVertical: 10,
  },
  inputTitle: {
    fontWeight: "bold",
  },
  checkbox: {
    width: 16,
    height: 16,
  },
});
