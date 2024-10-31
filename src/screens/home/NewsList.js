import * as React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import CommonText from "@components/commons/CommonText";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import MarqueeView from "react-native-marquee-view";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import _ from "lodash";

function NewsList(props) {
  const navigation = useNavigation();
  const { theme, defaultTheme } = useSelector((state) => state.ThemeReducer);
  const { news } = useSelector((state) => state.NewsReducer);

  const dispatch = useDispatch();
  if (news.length === 0) {
    return <></>;
  }
  return (
    <ImageBackground
      source={
        defaultTheme.code === "light"
          ? require("@assets/images/news/news-light.png")
          : require("@assets/images/news/news.png")
      }
      imageStyle={{
        borderRadius: 7,
      }}
      style={[styles.breakingNewsContainer]}
    >
      <MarqueeView style={styles.marqueeView}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          {_.map(news, function (item, index) {
            return (
              <CommonTouchableOpacity
                key={item.id}
                style={styles.textScroll}
                onPress={async () => {
                  if (item.type === "INTERNAL") {
                    await Linking.openURL(item.url);
                  } else {
                    navigation.navigate("BlogDetailScreen", {
                      item: item.blog,
                    });
                  }
                }}
              >
                <CommonText
                  style={[styles.breakingNewsText, { color: theme.text }]}
                >
                  {index + 1}. {item.title}
                </CommonText>
              </CommonTouchableOpacity>
            );
          })}
        </View>
      </MarqueeView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  breakingNewsContainer: {
    height: 30,

    flexDirection: "row",
    paddingHorizontal: 10,
    marginHorizontal: 20,
    borderRadius: 7,
    zIndex: 1000,
  },
  breakingNewsLogo: {
    width: 100,
    height: "100%",
  },
  breakingNewsText: {
    fontSize: 10,
  },
  marqueeView: {
    width: "100%",
    justifyContent: "center",
  },
  textScroll: {
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});
export default NewsList;
