import PINCode from "@haskkor/react-native-pincode";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { fonts } from "@modules/core/constant/AppTextStyle";
export function PinCode(props) {
  const { t } = useTranslation();
  const { appLock } = useSelector((state) => state.AppLockReducer);
  const [pinCodeLength, setPinCodeLength] = useState(0);

  const renderPinDots = () => {
    const dots = [];
    for (let i = 0; i < 4; i++) {
      const dotStyle =
        pinCodeLength >= i + 1 ? styles.filledDot : styles.emptyDot;

      dots.push(
        <View
          style={[
            dotStyle,
            {
              backgroundColor:
                pinCodeLength >= i + 1
                  ? props.styleDotFillColor
                  : props.styleDotEmptyColor,
            },
          ]}
          key={i}
        />
      );
    }
    return dots;
  };

  return (
    <PINCode
      onFail={props.onFail}
      finishProcess={props.onSuccess}
      status={props.status}
      getCurrentPinLength={(length) => {
        setPinCodeLength(length);
      }}
      onClickButtonLockedPage={() => {
        if (props.onClickButtonLockedPage) {
          props.onClickButtonLockedPage();
        }
      }}
      touchIDDisabled={!appLock.biometryLock}
      colorCircleButtons={props.colorCircleButtons}
      passwordComponent={() => (
        <View style={styles.pinContainer}>{renderPinDots()}</View>
      )}
      stylePinCodeTextSubtitle={props.stylePinCodeTextSubtitle}
      stylePinCodeColorTitle={props.stylePinCodeColorTitle}
      stylePinCodeTextTitle={props.stylePinCodeTextTitle}
      // bottomLeftComponent={() => (
      //   <TouchableHighlight onPress={() => {}}>
      //     <View style={styles.buttonDeleteContainer}>
      //       <Icons.Ionicons
      //         name="close-circle-outline"
      //         color={"#FFFFFF"}
      //         size={26}
      //       />
      //     </View>
      //   </TouchableHighlight>
      // )}

      stylePinCodeDeleteButtonthemeShowUnderlay={
        props.stylePinCodeDeleteButtonthemeShowUnderlay
      }
      stylePinCodeDeleteButtonColorHideUnderlay={
        props.stylePinCodeDeleteButtonColorHideUnderlay
      }
      stylePinCodeButtonNumber={props.stylePinCodeColorButtonNumber}
      stylePinCodeTextButtonCircle={props.stylePinCodeTextButtonCircle}
      styleLockScreenButton={{ transform: [{ scale: 0 }] }}
      buttonDeleteText={t("pincode.buttonDeleteText")}
      subtitleChoose={t("pincode.subtitleChoose")}
      subtitleError={t("pincode.subtitleError")}
      textButtonLockedPage={t("pincode.textButtonLockedPage")}
      textCancelButtonTouchID={t("pincode.textCancelButtonTouchID")}
      textDescriptionLockedPage={t("pincode.textDescriptionLockedPage")}
      textSubDescriptionLockedPage={t("pincode.textSubDescriptionLockedPage")}
      textTitleLockedPage={t("pincode.textTitleLockedPage")}
      titleAttemptFailed={t("pincode.titleAttemptFailed")}
      titleChoose={t("pincode.titleChoose")}
      titleConfirm={t("pincode.titleConfirm")}
      titleConfirmFailed={t("pincode.titleConfirmFailed")}
      titleEnter={t("pincode.titleEnter")}
      titleValidationFailed={t("pincode.titleValidationFailed")}
      touchIDSentence={t("pincode.touchIDSentence")}
      touchIDTitle={t("pincode.touchIDTitle")}
    />
  );
}
PinCode.propTypes = {
  onFail: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  onClickButtonLockedPage: PropTypes.func,
  colorCircleButtons: PropTypes.string,
  stylePinCodeColorTitle: PropTypes.string,
  stylePinCodeDeleteButtonthemeShowUnderlay: PropTypes.string,
  stylePinCodeDeleteButtonColorHideUnderlay: PropTypes.string,
  stylePinCodeColorButtonNumber: PropTypes.string,
  styleDotFillColor: PropTypes.string,
  styleDotEmptyColor: PropTypes.string,
  stylePinCodeTextButtonCircle: PropTypes.any,
  stylePinCodeTextTitle: PropTypes.any,
  stylePinCodeTextSubtitle: PropTypes.any,
};

PinCode.defaultProps = {
  colorCircleButtons: "#D9D9D9",
  stylePinCodeColorTitle: "#FFFFFF",
  stylePinCodeDeleteButtonthemeShowUnderlay: "#788397",
  stylePinCodeDeleteButtonColorHideUnderlay: "#788397",
  stylePinCodeColorButtonNumber: "#FFFFFF",
  styleDotFillColor: "#4C1691",
  styleDotEmptyColor: "#FFFFFF",
  stylePinCodeTextButtonCircle: {
    fontFamily: "Roboto-Medium",
    fontWeight: "500",
  },
  stylePinCodeTextTitle: {
    fontSize: 32,
    fontFamily: "ProximaNova-Regular",
    fontWeight: "400",
  },
  stylePinCodeTextSubtitle: { fontSize: 16, fontFamily: "Roboto-Medium" },
};
const styles = StyleSheet.create({
  pinCode: {
    fontWeight: "300",
  },
  text: {
    fontWeight: "500",
    fontFamily: "ProximaNova-Regular",
  },
  pinContainer: {
    flexDirection: "row",
    marginBottom: 40,
  },
  filledDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 10,
  },
  emptyDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    marginHorizontal: 10,
  },
  buttonDeleteContainer: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 70,
  },
});
