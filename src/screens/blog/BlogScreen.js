import React, { useEffect } from "react";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import CommonFlatList from "@components/commons/CommonFlatList";
import CommonImage from "@components/commons/CommonImage";
import CommonTouchableHighlight from "@components/commons/CommonTouchableHightlight";
import { useTranslation } from "react-i18next";
import { BlogAction } from "@persistence/blog/BlogAction";
import LinearGradient from "react-native-linear-gradient";
import CommonAppBar from "@components/commons/CommonAppBar";

export default function BlogScreen({ navigation, route }) {
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { blogs } = useSelector((state) => state.BlogReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    (async () => {
      dispatch(BlogAction.getBlogs());
    })();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View
        style={[styles.itemContainer, { backgroundColor: theme.container4 }]}
      >
        <CommonTouchableHighlight
          onPress={() => {
            navigation.navigate("BlogDetailScreen", { item });
          }}
        >
          <View style={[styles.item]}>
            <View style={styles.leftItemContainer}>
              <View style={[styles.iconContainer]}>
                <CommonImage
                  source={{ uri: item.thumbnailUrl }}
                  style={styles.iconContainer}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  height: "100%",
                  paddingHorizontal: 10,
                }}
              >
                <CommonText
                  numberOfLines={2}
                  style={{
                    color: theme.text,
                    fontWeight: "500",
                    fontSize: 18,
                  }}
                >
                  {item.title}
                </CommonText>
                <CommonText
                  style={{ color: theme.subText, fontSize: 9 }}
                  numberOfLines={6}
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
          title="Blog"
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
            data={blogs}
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
  itemContainer: {
    marginBottom: 10,
    borderRadius: 10,
  },
  item: {
    width: "100%",
    minHeight: 90,
    borderRadius: 10,
    paddingHorizontal: 5,
    flexDirection: "row",
    paddingVertical: 7.5,
  },
  row: {
    minHeight: 90,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 7.5,
  },
  leftItemContainer: {
    height: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 128,
    height: 145,
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
