import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonFlatList from "@components/commons/CommonFlatList";
import Icon, { Icons } from "@components/icons/Icons";
import CommonImage from "@components/commons/CommonImage";
import { useTranslation } from "react-i18next";
import { WALLET_TYPE } from "@persistence/wallet/WalletConstant";
import { WalletAction } from "@persistence/wallet/WalletAction";
import CommonLoading from "@components/commons/CommonLoading";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";

export default function AccountScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme, defaultTheme } = useSelector((state) => state.ThemeReducer);
  const dispatch = useDispatch();
  const { activeWallet, wallets } = useSelector((state) => state.WalletReducer);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {})();
  }, []);
  const renderItem = ({ item }) => {
    return (
      <CommonTouchableOpacity
        style={[styles.item, { backgroundColor: theme.container7 }]}
        onPress={() => {
          CommonLoading.show();
          dispatch(WalletAction.setActiveWallet(item)).then(() => {
            CommonLoading.hide();
          });
        }}
        key={item.id.toString()}
      >
        <View style={styles.leftItemContainer}>
          <View style={[styles.iconContainer]}>
            <CommonImage
              source={{ uri: item.image }}
              style={[
                styles.icon,
                activeWallet.id === item.id ? { borderWidth: 4 } : {},
              ]}
            />
          </View>
          <View style={{ width: 200 }}>
            <CommonText
              style={{ color: theme.text, fontWeight: "500", fontSize: 18 }}
            >
              {item.name}
            </CommonText>
            <CommonText
              numberOfLines={1}
              ellipsizeMode="middle"
              style={{ color: theme.subText, fontSize: 9 }}
            >
              {item.type === WALLET_TYPE.MANY
                ? "Multi-Coin Wallet"
                : item.activeAsset.walletAddress}
            </CommonText>
          </View>
        </View>
        <CommonTouchableOpacity
          style={styles.leftItemContainer}
          onPress={() => {
            navigation.navigate("AccountDetailScreen", {
              account: item,
            });
          }}
        >
          <Icon
            type={Icons.Feather}
            size={18}
            name={"alert-circle"}
            color={theme.text}
          />
        </CommonTouchableOpacity>
      </CommonTouchableOpacity>
    );
  };
  return (
    <LinearGradient
      colors={theme.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={[styles.container]}>
        <CommonAppBar title="Wallet" />
        <View height={20} />
        <View style={styles.section}>
          <CommonFlatList
            data={wallets}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            onRefresh={() => {}}
            refreshing={loading}
          />
        </View>
        <View height={10} />
        <CommonTouchableOpacity
          onPress={() => {
            navigation.navigate("AddAccountStep1Screen");
          }}
        >
          <View
            style={{
              height: 67,
              borderStyle: "dashed",
              borderWidth: 1,
              borderColor: theme.border7,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.container6,
            }}
          >
            <CommonText
              style={{ fontSize: 18, color: theme.text, fontWeight: "500" }}
            >
              + Create New Wallet
            </CommonText>
          </View>
        </CommonTouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    height: 48,

    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
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
  section: {
    width: "100%",

    borderRadius: 10,
  },
  item: {
    height: 70,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  leftItemContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rightItemContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    marginLeft: 10,
    marginVertical: 5,
  },
  icon: {
    width: 42,
    height: 42,
    borderColor: "green",
    borderRadius: 50,
  },
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
});
