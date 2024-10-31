import { Platform, SafeAreaView, StyleSheet, View, Text } from "react-native";
import CommonBackButton from "@components/commons/CommonBackButton";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import { useTranslation } from "react-i18next";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import Icon, { Icons } from "@components/icons/Icons";
import {
  createWeb3Wallet,
  onConnect,
  web3wallet,
} from "@modules/walletconnect/WalletConnectClient";
import { useCallback, useEffect, useRef, useState } from "react";
import { EIP155_SIGNING_METHODS } from "@modules/walletconnect/EIP155";
import ActionSheet from "react-native-actions-sheet";
import { getSignParamsMessage } from "@modules/walletconnect/HelperUtils";
import CommonLoading from "@components/commons/CommonLoading";
import { WalletFactory } from "@modules/core/factory/WalletFactory";
import {
  approveEIP155Request,
  rejectEIP155Request,
} from "@modules/walletconnect/EIP155Request";
import { getSdkError } from "@walletconnect/utils";
import _ from "lodash";
import { CHAIN_ID_TYPE_MAP } from "@modules/core/constant/constant";
import { WalletConnectAction } from "@persistence/walletconnect/WalletConnectAction";
import CommonFlatList from "@components/commons/CommonFlatList";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";

function WalletConnectScreen(props) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { sessions } = useSelector((state) => state.WalletConnectReducer);
  const approvalSessionModal = useRef(null);
  const approvalRequestModal = useRef(null);
  const [loading, setLoading] = useState(false);
  const [pairingProposal, setPairingProposal] = useState();
  const [requestEventData, setRequestEventData] = useState();
  const [requestSession, setRequestSession] = useState();
  const [activeChain, setActiveChain] = useState("");
  const [uri, setUri] = useState("");

  useEffect(() => {
    (async () => {
      dispatch(WalletConnectAction.list());
      await createWeb3Wallet();
      web3wallet.on("session_proposal", onSessionProposal);
      web3wallet.on("session_request", onSessionRequest);
      web3wallet.on("session_delete", onSessionDelete);
    })();
  }, []);
  const onSessionDelete = useCallback((proposal) => {
    dispatch(WalletConnectAction.list());
  }, []);
  const onSessionProposal = useCallback((proposal) => {
    setPairingProposal(proposal);
    approvalSessionModal?.current.show();
  }, []);
  const onSessionRequest = useCallback(async (requestEvent) => {
    const { topic, params } = requestEvent;
    const { request } = params;
    const requestSessionData = web3wallet.engine.signClient.session.get(topic);

    switch (request.method) {
      case EIP155_SIGNING_METHODS.ETH_SIGN:
      case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
        setRequestSession(requestSessionData);
        setRequestEventData(requestEvent);
        approvalRequestModal?.current.show();
        return;

      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
        setRequestSession(requestSessionData);
        setRequestEventData(requestEvent);
        approvalRequestModal?.current.show();
        return;
      case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
        setRequestSession(requestSessionData);
        setRequestEventData(requestEvent);
        approvalRequestModal?.current.show();
        return;
    }
  }, []);
  const onScanSuccess = async (url) => {
    setUri(uri);
    await onConnect({ uri: url });
  };

  async function onApproveRequest() {
    try {
      if (requestEventData) {
        console.log(JSON.stringify(requestEventData));
        const { params } = requestEventData;
        const { chainId: encryptedChainId } = params;
        const chainId = encryptedChainId.replace("eip155:", "");
        CommonLoading.show();
        const wallet = await WalletFactory.getWallet(
          CHAIN_ID_TYPE_MAP[chainId]
        );
        const response = await approveEIP155Request(
          requestEventData,
          wallet.signer
        );
        await web3wallet.respondSessionRequest({
          topic: requestEventData.topic,
          response,
        });
        approvalRequestModal?.current.hide();
        setTimeout(() => {
          CommonLoading.hide();
        }, 1000);
      }
    } catch (e) {
      console.log(e);
      CommonLoading.hide();
    }
  }

  async function onRejectRequest() {
    if (requestEventData) {
      CommonLoading.show();
      const wallet = await WalletFactory.getWallet(activeChain);
      const response = rejectEIP155Request(requestEventData, wallet.signer);
      await web3wallet.respondSessionRequest({
        topic: requestEventData.topic,
        response,
      });
      approvalRequestModal?.current.hide();
      CommonLoading.hide();
    }
  }

  async function handleDecline() {
    approvalSessionModal?.current.hide();

    if (!pairingProposal) {
      return;
    }
    web3wallet.rejectSession({
      id: pairingProposal.id,
      reason: getSdkError("USER_REJECTED_METHODS"),
    });
  }

  async function handleAccept() {
    const { id, params } = pairingProposal;
    let chainId = params?.requiredNamespaces?.eip155?.chains[0];
    if (!_.isNil(chainId)) {
      const { requiredNamespaces, relays } = params;
      chainId = chainId.replace("eip155:", "");
      const wallet = await WalletFactory.getWallet(CHAIN_ID_TYPE_MAP[chainId]);
      if (pairingProposal && wallet) {
        CommonLoading.show();
        const namespaces = {};
        setActiveChain(CHAIN_ID_TYPE_MAP[chainId]);
        Object.keys(requiredNamespaces).forEach((key) => {
          const accounts = [];
          requiredNamespaces[key].chains.map((chain) => {
            [wallet.data.walletAddress].map((acc) =>
              accounts.push(`${chain}:${acc}`)
            );
          });
          namespaces[key] = {
            accounts,
            methods: requiredNamespaces[key].methods,
            events: requiredNamespaces[key].events,
          };
        });
        await web3wallet.approveSession({
          id,
          relayProtocol: relays[0].protocol,
          namespaces,
        });
        setTimeout(() => {
          dispatch(WalletConnectAction.list());
          CommonLoading.hide();
        }, 1000);
      }
      approvalSessionModal?.current.hide();
    }
  }

  const renderItem = ({ item }) => {
    const { peer } = item;
    return (
      <View style={[styles.itemContainer, { borderBottomColor: theme.border }]}>
        <View>
          <CommonText style={styles.title}>{peer.metadata.name}</CommonText>
          <CommonText>{peer.metadata.url}</CommonText>
        </View>
        <View style={styles.removeButtonContainer}>
          <CommonTouchableOpacity
            style={[styles.removeButton, { backgroundColor: theme.text3 }]}
            onPress={async () => {
              try {
                await web3wallet.disconnectSession({
                  topic: item.topic,
                  reason: getSdkError("USER_DISCONNECTED"),
                });
                dispatch(WalletConnectAction.list());
              } catch (e) {
                console.log(e);
              }
            }}
          >
            <CommonText>Disconnect</CommonText>
          </CommonTouchableOpacity>
        </View>
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
        <CommonAppBar title={t("wallet_connect")} />
        <CommonTouchableOpacity
          onPress={() => {
            navigation.navigate("WalletConnectAddScreen", {
              onScanSuccess,
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
        <View style={{ flex: 1 }}>
          <CommonFlatList
            data={sessions}
            renderItem={renderItem}
            style={{ flex: 1 }}
            keyExtractor={(item) => item.topic}
          />
        </View>
      </SafeAreaView>
      <ActionSheet
        ref={approvalSessionModal}
        headerAlwaysVisible
        isModal={Platform.OS === "android"}
        useBottomSafeAreaPadding
        containerStyle={[
          styles.sessionRequestContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <View style={styles.titleContainer}>
          <CommonText
            style={{
              fontWeight: "bold",
              fontSize: 17,
            }}
          >
            {pairingProposal?.params?.proposer?.metadata?.name}
          </CommonText>
          <CommonText>would like to connect</CommonText>
          <CommonText>
            {pairingProposal?.params?.proposer?.metadata.url}
          </CommonText>
        </View>
        <View style={[styles.contentContainer]}>
          <CommonText>REQUESTED PERMISSIONS:</CommonText>
          {pairingProposal?.params?.requiredNamespaces?.eip155?.chains?.map(
            (chain, index) => {
              return <CommonText key={chain}>{chain.toUpperCase()}</CommonText>;
            }
          )}
          {pairingProposal?.params?.requiredNamespaces?.eip155?.methods
            ?.length &&
            pairingProposal?.params?.requiredNamespaces?.eip155?.methods?.map(
              (method, index) => <CommonText key={method}>{method}</CommonText>
            )}

          {pairingProposal?.params?.requiredNamespaces?.eip155?.events?.map(
            (method, index) => (
              <CommonText key={method}>{method}</CommonText>
            )
          )}
        </View>
        <View style={[styles.buttonContainer]}>
          <CommonTouchableOpacity
            onPress={handleAccept}
            style={[styles.haftButton, { backgroundColor: theme.border }]}
          >
            <CommonText>Accept</CommonText>
          </CommonTouchableOpacity>
          <CommonTouchableOpacity
            onPress={handleDecline}
            style={[styles.haftButton, { backgroundColor: theme.text3 }]}
          >
            <CommonText>Reject</CommonText>
          </CommonTouchableOpacity>
        </View>
      </ActionSheet>
      <ActionSheet
        ref={approvalRequestModal}
        headerAlwaysVisible
        isModal={Platform.OS === "android"}
        useBottomSafeAreaPadding
        containerStyle={[
          styles.sessionRequestContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <View style={styles.titleContainer}>
          <CommonText
            style={{
              fontWeight: "bold",
              fontSize: 17,
            }}
          >
            {pairingProposal?.params?.proposer?.metadata?.name}
          </CommonText>
          <CommonText>would like to connect</CommonText>
          <CommonText>
            {pairingProposal?.params?.proposer?.metadata.url}
          </CommonText>
        </View>
        <View style={[styles.contentContainer]}>
          {requestEventData && (
            <CommonText>
              wants to{" "}
              {requestEventData?.params?.request?.method === "personal_sign"
                ? "sign a message as below: "
                : "send a transaction as below"}
            </CommonText>
          )}
          {requestEventData && (
            <CommonText>
              {JSON.stringify(
                getSignParamsMessage(requestEventData?.params?.request?.params)
              )}
            </CommonText>
          )}
        </View>
        <View style={[styles.buttonContainer]}>
          <CommonTouchableOpacity
            onPress={onApproveRequest}
            style={[styles.haftButton, { backgroundColor: theme.border }]}
          >
            <CommonText>Approve</CommonText>
          </CommonTouchableOpacity>
          <CommonTouchableOpacity
            onPress={onRejectRequest}
            style={[styles.haftButton, { backgroundColor: theme.text3 }]}
          >
            <CommonText>Reject</CommonText>
          </CommonTouchableOpacity>
        </View>
      </ActionSheet>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  screenTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  item: {
    width: "100%",
    borderBottomWidth: 0.5,
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
    flexDirection: "row",
    alignItems: "center",
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
  itemContainer: {
    width: "100%",
    height: 70,
    borderBottomWidth: 0.5,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  removeButtonContainer: {
    width: 100,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButton: {
    paddingVertical: 5,
    width: 80,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
  },
});

export default WalletConnectScreen;
