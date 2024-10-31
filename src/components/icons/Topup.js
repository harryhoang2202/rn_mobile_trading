import * as React from "react";
import Svg, { SvgProps, Path, Circle } from "react-native-svg";
import PropTypes from "prop-types";
const Topup = (props) => (
  <Svg
    width={props.width}
    height={props.height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M5.107 10.561a.709.709 0 0 0-.179.474.652.652 0 0 0 .187.465c.118.127.28.2.45.2.17 0 .331-.073.45-.2l4.836-5.096v11.818c0 .37.285.67.636.67.352 0 .637-.3.637-.67V6.402l4.862 5.107c.118.127.28.2.45.2.169 0 .331-.073.45-.2a.696.696 0 0 0 0-.948l-5.94-6.258a.614.614 0 0 0-.9 0l-5.94 6.258Z"
      fill={props.color}
    />
    <Circle cx={11.5} cy={11.5} r={10.5} stroke={props.color} strokeWidth={2} />
  </Svg>
);
Topup.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
Topup.defaultProps = {
  width: 23,
  height: 23,
  color: "#FFFFFF",
};
export default Topup;
