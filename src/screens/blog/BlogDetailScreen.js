import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonText from "@components/commons/CommonText";
import { useTranslation } from "react-i18next";
import WebView from "react-native-webview";
import LinearGradient from "react-native-linear-gradient";
import Icon, { Icons } from "@components/icons/Icons";
import CommonAppBar from "@components/commons/CommonAppBar";

export default function BlogDetailScreen({ navigation, route }) {
  const { item } = route.params;
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { coin } = route.params;
  const webview = useRef();
  const [content, setContent] = useState("");
  useEffect(() => {
    const blogDetail = `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Bootstrap demo</title>
         <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
         <style>
         body { 
          color: ${theme.text};
            text-align: justify;
         }
          p, h1, h2, h3, h4, h5, h6, i {
            color : ${theme.text};
            text-align: justify;
          }
          img { 
           max-width: 100%;
           height: auto;
          }
         </style>
      </head>
      <body style="padding: 10px; background-color:${theme.container4} ">
        ${item.content}
      </body>
    </html>`;
    setContent(blogDetail);
  }, []);
  return (
    <LinearGradient
      colors={theme.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <CommonAppBar title="Blog" />
        <View height={40} />
        <View style={[styles.content, { backgroundColor: theme.container4 }]}>
          <CommonText
            style={{ fontSize: 18, color: theme.text, marginBottom: 20 }}
          >
            {item.title}
          </CommonText>
          <WebView
            ref={webview}
            source={{ html: content }}
            style={{
              height: "100%",
              width: "100%",
              paddingVertical: 10,
            }}
            originWhitelist={["*"]}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={true}
            showsVerticalScrollIndicator={false}
            userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
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
  content: {
    flex: 1,
    marginHorizontal: 10,
    padding: 5,
  },
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
});
