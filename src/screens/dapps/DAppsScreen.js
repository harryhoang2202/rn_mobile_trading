import React, { useEffect } from "react";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import CommonFlatList from "@components/commons/CommonFlatList";
import { applicationProperties } from "@src/application.properties";
import CommonImage from "@components/commons/CommonImage";
import CommonTouchableHighlight from "@components/commons/CommonTouchableHightlight";
import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";

export default function DAppsScreen({ navigation, route }) {
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { t } = useTranslation();
  useEffect(() => {
    (async () => {})();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.item, { backgroundColor: theme.container4 }]}>
        <CommonTouchableHighlight
          onPress={() => {
            navigation.navigate("DAppsDetailScreen", { item });
          }}
        >
          <View style={[styles.row]}>
            <View style={styles.leftItemContainer}>
              <View style={[styles.iconContainer]}>
                <CommonImage
                  source={{ uri: item.logo }}
                  style={styles.iconContainer}
                />
              </View>
              <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <CommonText
                  style={{ color: theme.text, fontSize: 18, fontWeight: "500" }}
                >
                  {item.name}
                </CommonText>
                <CommonText
                  style={{ color: theme.subText, fontSize: 9 }}
                  numberOfLines={3}
                >
                  {item.desc}
                </CommonText>
              </View>
            </View>
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
        <CommonAppBar
          title="DApps"
          onBack={() => {
            navigation.navigate({
              name: "HomeScreen",
              merge: true,
            });
          }}
        />
        <View style={{ width: 30 }}></View>
        <View style={styles.content}>
          <CommonFlatList
            data={applicationProperties.dapps}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
          />
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
    height: 48,
    paddingHorizontal: 10,
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
  headerBg: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  content: {
    paddingHorizontal: 10,
    paddingBottom: 160,
  },
  item: {
    width: "100%",
    marginBottom: 10,
    borderRadius: 10,
  },
  row: {
    minHeight: 90,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
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
    height: 340,
    marginBottom: 170,
  },
  titleContainer: {
    height: 30,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    minHeight: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 10,
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
});
