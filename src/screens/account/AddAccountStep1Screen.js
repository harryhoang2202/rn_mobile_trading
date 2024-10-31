import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import CommonBackButton from "@components/commons/CommonBackButton";
import Icon, { Icons } from "@components/icons/Icons";
import CommonFlatList from "@components/commons/CommonFlatList";
import CommonImage from "@components/commons/CommonImage";
import { WALLET_LIST } from "@persistence/wallet/WalletConstant";
import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";
export default function AddAccountStep1Screen({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const renderItem = ({ item }) => {
    return (
      <CommonTouchableOpacity
        onPress={() => {
          navigation.navigate("AddAccountStep2Screen", {
            account: item,
          });
        }}
        style={[styles.item, { backgroundColor: theme.container7 }]}
        key={item.chain}
      >
        <View style={styles.leftItemContainer}>
          <View style={[styles.iconContainer]}>
            <CommonImage
              source={{ uri: item.image }}
              style={styles.iconContainer}
            />
          </View>
          <CommonText
            style={{ color: theme.text, fontWeight: "500", fontSize: 18 }}
          >
            {item.name}
          </CommonText>
        </View>
        <CommonTouchableOpacity
          style={styles.leftItemContainer}
          onPress={() => {}}
        >
          <Icon type={Icons.Feather} size={18} name={"chevron-right"} />
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
      <SafeAreaView style={styles.container}>
        <CommonAppBar title="Wallet" />
        <View style={styles.section}>
          <CommonFlatList
            data={WALLET_LIST}
            keyExtractor={(item) => item.chain}
            renderItem={renderItem}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
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
    paddingHorizontal: 10,
  },
  item: {
    height: 70,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  leftItemContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 30,
    height: 30,
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
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
});
