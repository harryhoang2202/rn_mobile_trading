import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { WalletAction } from "@persistence/wallet/WalletAction";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import Icon, { Icons } from "@components/icons/Icons";
import CommonText from "@components/commons/CommonText";
import CommonFlatList from "@components/commons/CommonFlatList";
import CommonLoading from "@components/commons/CommonLoading";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import Price from "@components/Price";
import { WalletFactory } from "@modules/core/factory/WalletFactory";
import NftImage from "@components/NftImage";
import { NftsFactory } from "@modules/core/factory/NftsFactory";
import { MarketAction } from "@persistence/market/MarketAction";
import CoinList from "@screens/home/CoinList";
import MarketList from "@screens/home/MarketList";
import NewsList from "@screens/home/NewsList";
import { NewsAction } from "@persistence/news/NewsAction";
import { OneSignal } from "react-native-onesignal";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";
import { fonts } from "@modules/core/constant/AppTextStyle";

function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { activeWallet } = useSelector((state) => state.WalletReducer);
  const { profit, percentIncreases } = useSelector(
    (state) => state.BalanceReducer
  );
  const { theme } = useSelector((state) => state.ThemeReducer);
  const [tab, setTab] = useState("Tokens");
  const [nfts, setNfts] = useState([]);
  const [chain, setChain] = useState("ETH");
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const tabData = [
    {
      key: "Tokens",
      title: t("home.tokens"),
    },
    {
      key: "Markets",
      title: t("home.markets"),
    },
    ,
    {
      key: "NFTs",
      title: t("home.nfts"),
    },
  ];
  useEffect(() => {
    (async () => {
      loadNfts();
      OneSignal.InAppMessages.addTrigger("test", "test");
    })();
  }, [activeWallet.chain]);
  useEffect(() => {
    (async () => {
      dispatch(NewsAction.getNews());
    })();
  }, []);
  const loadNfts = async () => {
    setTimeout(async () => {
      const ethWallet = await WalletFactory.getWallet("ETH");
      const result = await NftsFactory.getNfts(
        activeWallet.chain,
        ethWallet.data.walletAddress
      );
      setNfts(result);
    }, 1000);
  };

  const onRefresh = useCallback(async () => {
    CommonLoading.show();
    dispatch(WalletAction.balance()).then(() => {
      setRefreshing(false);
      dispatch(MarketAction.getMarkets(30, true));
      dispatch(NewsAction.getNews());
      CommonLoading.hide();
    });
  }, []);
  const renderTabbarItem = () => {
    return tabData.map((item) => (
      <View
        style={[
          { flex: 1 },
          tab === item.key
            ? {
                backgroundColor: theme.background2,
              }
            : {},
          tab === "Tokens" ? { borderTopLeftRadius: 10 } : {},
          tab === "NFTs" ? { borderTopRightRadius: 10 } : {},
        ]}
      >
        <CommonTouchableOpacity
          onPress={() => {
            setTab(item.key);
          }}
          style={[
            styles.tabViewHeaderItem,

            tab === item.key
              ? {
                  borderBottomColor: theme.border2,
                }
              : { borderBottomColor: theme.border },
          ]}
        >
          <CommonText
            style={{
              color: tab === item.key ? theme.text : theme.text7,
              fontWeight: "bold",
              fontSize: 16,
              fontFamily: fonts.Nunito,
            }}
          >
            {item.title}
          </CommonText>
        </CommonTouchableOpacity>
      </View>
    ));
  };
  const renderNftItem = ({ item, index }) => {
    return (
      <CommonTouchableOpacity
        style={styles.nftItem}
        onPress={async () => {
          navigation.navigate("NftDetailScreen", {
            nft: item,
            chain: chain,
          });
        }}
      >
        <NftImage
          style={styles.image}
          resizeMode={"cover"}
          source={item.metadata.image}
        />
        <View style={styles.itemInfoContainer}>
          <View style={styles.itemNameContainer}>
            <CommonText
              style={{ color: theme.text2, fontWeight: "500" }}
              numberOfLines={1}
            >
              {item.name || item.metadata.description}
            </CommonText>
          </View>
        </View>
      </CommonTouchableOpacity>
    );
  };
  return (
    <LinearGradient
      colors={theme.gradient}
      style={[styles.container]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={[styles.container]}>
        <CommonAppBar title="Wallet" allowBack={false} />
        <NewsList />
        <View height={10} />
        <ImageBackground
          source={require("@assets/images/home/bg-balance.png")}
          style={styles.balanceContainer}
          imageStyle={{
            borderRadius: 16,
          }}
        >
          <View style={{ flex: 1 }}>
            <CommonText style={{ fontSize: 13, color: theme.portfolioBalance }}>
              Portfolio Balance
            </CommonText>
            <Price
              style={[{ color: theme.portfolioBalance }, styles.balanceText]}
            >
              {activeWallet.totalBalance}
            </Price>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <CommonText
                  style={[
                    styles.walletNameText,
                    { color: theme.portfolioBalance },
                  ]}
                >
                  {profit}
                </CommonText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <CommonText
                  style={[
                    styles.walletNameText,
                    { color: theme.portfolioBalance },
                  ]}
                >
                  {Math.abs(percentIncreases)}%
                </CommonText>
                <Icons.Feather
                  name={percentIncreases >= 0 ? "trending-up" : "trending-down"}
                  color={theme.portfolioBalance}
                  size={14}
                  style={{ marginLeft: 10 }}
                />
              </View>
            </View>
          </View>
        </ImageBackground>
        <View height={30} />
        <View style={[styles.actionContainer]}>
          <CommonTouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              navigation.navigate("SelectWalletScreen", {
                action: "SEND",
              });
            }}
          >
            <View
              style={[styles.actionIcon, { backgroundColor: theme.button }]}
            >
              <Icon
                type={Icons.Feather}
                size={23}
                name={"arrow-up"}
                color={theme.icon1}
              />
            </View>
            <CommonText
              style={{
                fontSize: 16,
                fontWeight: "700",
                fontFamily: fonts.Nunito,
                color: theme.text,
              }}
            >
              {t("wallet.send")}
            </CommonText>
          </CommonTouchableOpacity>

          <CommonTouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              navigation.navigate("SelectWalletScreen", {
                action: "RECEIVE",
              });
            }}
          >
            <View
              style={[styles.actionIcon, { backgroundColor: theme.button }]}
            >
              <Icon
                type={Icons.Feather}
                size={23}
                name={"arrow-down"}
                color={theme.icon1}
              />
            </View>
            <CommonText
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: theme.text,
                fontFamily: fonts.Nunito,
              }}
            >
              {t("wallet.receive")}
            </CommonText>
          </CommonTouchableOpacity>
          <CommonTouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              navigation.navigate("SelectWalletScreen", {
                action: "BUY",
              });
            }}
          >
            <View
              style={[styles.actionIcon, { backgroundColor: theme.button }]}
            >
              <Icon
                type={Icons.Ionicons}
                size={23}
                name={"ios-cart-outline"}
                color={theme.icon1}
              />
            </View>
            <CommonText
              style={{
                fontSize: 16,
                fontFamily: fonts.Nunito,
                fontWeight: "700",
                color: theme.text,
              }}
            >
              {t("wallet.buy")}
            </CommonText>
          </CommonTouchableOpacity>
        </View>

        <View style={[styles.tabViewContainer]}>
          <View
            style={[
              styles.tabViewHeader,
              { backgroundColor: theme.background },
            ]}
          >
            {renderTabbarItem()}
          </View>
          <View style={styles.tabViewContent}>
            {tab === "Tokens" && <CoinList />}
            {tab === "Markets" && <MarketList />}
            {tab === "NFTs" && (
              <CommonFlatList
                data={nfts}
                style={{ marginTop: 20 }}
                renderItem={renderNftItem}
                keyExtractor={(item) =>
                  `${item.token_id}${item.token_address}${item.block_number_minted}${item.last_metadata_sync}`
                }
                onRefresh={onRefresh}
                refreshing={refreshing}
                numColumns={2}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  balanceContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    height: 120,
    borderRadius: 16,
    paddingHorizontal: 40,
    flexDirection: "row",
    marginHorizontal: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 4 },
  },
  balanceText: {
    fontSize: 32,
    fontWeight: "700",
  },
  walletNameText: {
    fontSize: 13,
  },
  actionContainer: {
    height: 100,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginHorizontal: 60,
    marginBottom: 20,
  },
  actionItem: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: {
    width: 58,
    height: 58,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  tabViewContainer: {
    flex: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
  },
  tabViewHeader: {
    height: 30,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tabViewHeaderItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
  },
  tabViewContent: {
    flex: 1,
    paddingBottom: 110,
  },
  itemInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemDesc: {
    marginLeft: 10,
  },
  itemName: {
    fontWeight: "bold",
  },
  itemSymbol: {
    fontSize: 12,
  },
  itemPrice: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    paddingRight: 10,
  },
  addTokenButton: {
    width: "100%",
    height: 72,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    height: 72,
    width: "100%",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemImg: {
    width: 42,
    height: 42,
    borderRadius: 10000,
  },
  notifyContainer: {
    width: 15,
    height: 15,
    backgroundColor: "#c7122a",
    borderRadius: 30,
    position: "absolute",
    top: -5,
    left: -5,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    fontWeight: "bold",
    fontSize: 8,
  },
  logo: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(4,211,238,0.2)",
    borderRadius: 100,
  },
  nftItem: {
    width: Dimensions.get("screen").width / 2 - 20,
    height: 220,
    marginLeft: 8,
    marginBottom: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  tabViewHeaderTitle: {
    width: "70%",
  },
  tabViewHeaderTitleText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  itemInfoContainer: {
    width: "100%",
    height: 30,
    position: "absolute",
    bottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  itemNameContainer: {
    backgroundColor: "rgba(0,0,0,0.7)",
    width: "80%",
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  image: { height: 220, width: "100%", borderRadius: 20 },

  itemMarket: {
    flexDirection: "row",
    alignItems: "center",
    height: 72,
  },
  img: {
    width: 42,
    height: 42,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemNameMarket: {
    marginLeft: 10,
    fontSize: 15,
  },
  itemSymbolMarket: {
    fontSize: 13,
    textAlign: "left",
  },
  percentContainer: {
    width: 60,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});
export default HomeScreen;
