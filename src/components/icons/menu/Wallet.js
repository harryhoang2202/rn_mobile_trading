// import * as React from "react";
// import CommonImage from "@components/commons/CommonImage";

// const Wallet = ({ size, isFocused }) => {
//   const defaultSize = size || 24;
//   const source = isFocused
//     ? require("@assets/images/bottombar/wallet.png")
//     : require("@assets/images/bottombar/wallet.png");
//   return (
//     <CommonImage
//       source={source}
//       style={{ width: defaultSize, height: defaultSize }}
//     />
//   );
// };

// export default Wallet;
import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import PropTypes from "prop-types";

const Wallet = (props) => (
  <Svg
    width={props.width}
    height={props.height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M33.667 20.364a7.576 7.576 0 0 1-7.576 7.575H7.91a7.576 7.576 0 0 1-7.576-7.575V8.242A7.576 7.576 0 0 1 7.91.667h18.182a7.576 7.576 0 0 1 7.576 7.575v12.122ZM7.909 3.379h18.182a4.864 4.864 0 0 1 4.864 4.863v1.516H26.09a4.545 4.545 0 1 0 0 9.09h4.864v1.516a4.864 4.864 0 0 1-4.864 4.863H7.91a4.864 4.864 0 0 1-4.863-4.863V8.242A4.864 4.864 0 0 1 7.909 3.38Zm23.046 12.757V12.47H26.09a1.833 1.833 0 1 0 0 3.666h4.864Z"
      fill={props.color}
    />
  </Svg>
);
Wallet.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
Wallet.defaultProps = {
  width: 34,
  height: 28,
  color: "#FFFFFF",
};
export default Wallet;
