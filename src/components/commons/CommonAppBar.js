import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import CommonBackButton from "@components/commons/CommonBackButton";
import { Icons } from "@components/icons/Icons";
import CommonText from "@components/commons/CommonText";
import { fonts } from "@modules/core/constant/AppTextStyle";
function CommonAppBar(props) {
  const { theme } = useSelector((state) => state.ThemeReducer);
  const navigation = useNavigation();
  return (
    <View style={[styles.header]}>
      {props?.allowBack && (
        <View style={styles.leftHeader}>
          <CommonBackButton
            icon={
              <Icons.AntDesign name="arrowleft" size={20} color={theme.icon} />
            }
            color={theme.text}
            onPress={async () => {
              if (props.onBack != null) {
                props?.onBack();
              } else {
                navigation.goBack();
              }
            }}
          />
        </View>
      )}
      <View style={[styles.contentHeader]}>
        <CommonText style={[{ color: theme.text }, styles.headerTitle]}>
          {props?.title}
        </CommonText>
      </View>
      {props?.actions}
      {props?.allowBack === true && <View style={{ width: 30 }}></View>}
    </View>
  );
}
CommonAppBar.propTypes = {
  allowBack: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onBack: PropTypes.func,
  actions: PropTypes.any,
};

CommonAppBar.defaultProps = {
  allowBack: true,
};
const styles = StyleSheet.create({
  header: {
    height: 48,
    paddingHorizontal: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "700",
    fontFamily: fonts.Nunito,
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
});

export default CommonAppBar;
