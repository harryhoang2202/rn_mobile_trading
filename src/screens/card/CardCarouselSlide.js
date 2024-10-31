import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import Carousel from "react-native-snap-carousel";
import { useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import CommonImage from "@components/commons/CommonImage";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import { useNavigation } from "@react-navigation/native";

const SLIDE_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = SLIDE_WIDTH * 0.91;
export default function CardCarouselSlide() {
  const { cards } = useSelector((state) => state.CardReducer);
  const { theme } = useSelector((state) => state.ThemeReducer);
  const { data: userData } = useSelector((state) => state.UserReducer);
  const { user } = userData;
  const navigation = useNavigation();

  const cardFormat = (str, n) => {
    return str
      .toString()
      .split(/(.{4})/)
      .filter((x) => x.length === 4)
      .join("-");
  };
  const renderItem = ({ item }) => {
    console.log("card", item);
    return (
      <CommonTouchableOpacity
        style={[styles.item]}
        onPress={() => {
          navigation.navigate("MyCardDetailScreen", {
            card: { ...item },
          });
        }}
      >
        <CommonImage
          source={require("@assets/images/card/card-silver.png")}
          containerStyle={styles.imageContainer}
          style={[styles.itemImg, { shadowColor: "#000000" }]}
          resizeMode={"stretch"}
        />
        <View style={styles.itemContainer}>
          <View style={styles.itemInfo}>
            <CommonText style={[styles.cardNumber, { color: theme.text2 }]}>
              {cardFormat(item?.cardNo)}
            </CommonText>
            <CommonImage
              source={{ uri: item.image }}
              style={{ width: 48, height: 48 }}
            />
          </View>
        </View>
        <View style={styles.balanceContainer}>
          <CommonText style={[styles.cvvText, { color: theme.text2 }]}>
            {user.firstname + " " + user.lastname}
          </CommonText>
        </View>
      </CommonTouchableOpacity>
    );
  };
  return (
    <Carousel
      data={cards}
      renderItem={renderItem}
      sliderWidth={SLIDE_WIDTH}
      itemWidth={ITEM_WIDTH}
      useScrollView={true}
      hasParallaxImages={true}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    width: ITEM_WIDTH,
    height: 230,
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 4,
    marginBottom: 10,
  },
  itemImg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  imageContainer: {
    height: "100%",

    borderRadius: 20,
  },
  itemContainer: {
    flex: 1,
    padding: 15,
  },
  itemInfo: {
    height: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 120,
    marginLeft: 10,
  },
  itemValue: {
    fontSize: 30,
  },
  cardNumber: {
    fontSize: 22,
    fontWeight: "bold",
  },
  cvvText: {
    fontSize: 22,
    marginLeft: 2,
    marginBottom: 2,
    fontWeight: "bold",
  },
  balanceContainer: {
    width: "100%",
    height: 60,
    justifyContent: "center",
    paddingLeft: 20,
  },
});
