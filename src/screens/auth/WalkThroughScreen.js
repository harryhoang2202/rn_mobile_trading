import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import Swiper from "react-native-swiper";
import CommonImage from "@components/commons/CommonImage";
import CommonText from "@components/commons/CommonText";
import { useNavigation } from "@react-navigation/native";
import CommonButton from "@components/commons/CommonButton";
import CommonGradientButton from "@components/commons/CommonGradientButton";
import CustomActionSheet from "./CustomActionSheet";
import { fonts } from "@modules/core/constant/AppTextStyle";

const slides = [
  {
    key: 1,
    title: "Private \n& secure",
    text: "Private keys never leave your device",
    image: require("@assets/images/walkthrough/01.png"),
  },
  {
    key: 2,
    title: "All assets in \none place",
    text: "View and store your assets seamlessly",
    image: require("@assets/images/walkthrough/02.png"),
  },
  {
    key: 3,
    title: "Trade assets",
    text: "Trade your assets anonymously",
    image: require("@assets/images/walkthrough/03.png"),
  },
];
export default function WalkThroughScreen() {
  const navigation = useNavigation();
  const [create, setCreate] = useState(true);
  const [showSheet, setShowSheet] = useState(false);

  useEffect(() => {}, []);

  const renderItem = () => {
    return slides.map((item) => (
      <View key={item.key} style={styles.slide}>
        <CommonImage
          source={item.image}
          style={styles.image}
          resizeMode={"contain"}
        />
        <View style={styles.titleContainer}>
          <CommonText style={[styles.title]}>{item.title}</CommonText>
        </View>
        <View style={styles.descContainer}>
          <CommonText style={[styles.desc, { color: "#9455BA" }]}>
            {item.text}
          </CommonText>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@assets//images/walkthrough/bg3.png")}
        style={[styles.backgroundImage]}
      >
        <View style={styles.header}>
          <CommonImage
            source={require("@assets/images/walkthrough/logo.png")}
            style={{
              width: 225,
              height: 60,
              marginLeft: 40,
              marginTop: 50,
            }}
          />
          <CommonImage
            source={require("@assets/images/walkthrough/dot.png")}
            style={{
              width: 32,
              height: 32,
              marginLeft: 70,
              marginTop: 50,
            }}
          />
        </View>
        {!showSheet && (
          <View style={styles.body}>
            <Swiper
              paginationStyle={styles.pagination}
              style={styles.swiperContainer}
              activeDotStyle={styles.activeDot}
              dotStyle={styles.dot}
            >
              {renderItem()}
            </Swiper>
            <View style={styles.bottomContainer}>
              <CommonGradientButton
                text={"CREATE A NEW WALLET"}
                textStyle={{
                  color: "#FFFFFF",
                  fontSize: 20,
                  fontFamily: fonts.ProximaNova,
                }}
                onPress={() => {
                  setCreate(true);
                  setShowSheet(true);
                }}
              />
              <CommonButton
                text={"I already have a wallet"}
                textStyle={{
                  color: "#FFFFFF",
                  fontWeight: "400",
                  fontFamily: fonts.ProximaNova,
                }}
                onPress={() => {
                  setCreate(false);
                  setShowSheet(true);
                }}
              />
            </View>
          </View>
        )}

        <Modal
          isVisible={showSheet}
          hasBackdrop={true}
          style={{
            margin: 0,
            justifyContent: "flex-end",
          }}
        >
          <CustomActionSheet
            onCancel={() => {
              setCreate(false);
              setShowSheet(false);
            }}
            onNext={() => {
              setShowSheet(false);
              navigation.navigate("SetPinCodeScreen", {
                new: create,
              });
            }}
          />
        </Modal>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
  },
  header: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10,
  },
  body: {
    flex: 1,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  image: {
    height: 280,
    width: 360,
  },

  titleContainer: {
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: "400",
    textAlign: "left",
    marginBottom: 10,
    fontFamily: fonts.ProximaNova,
  },
  pagination: {
    marginLeft: 40,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  swiperContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  activeDot: {
    width: 20,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#D9D9D9",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#4C1690",
  },
  descContainer: {
    width: "100%",
    justifyContent: "center",
    marginBottom: 50,
    paddingHorizontal: 40,
  },
  desc: {
    fontSize: 16,
    textAlign: "left",
    fontFamily: fonts.ProximaNova,
  },
  bottomContainer: {
    height: 180,
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
