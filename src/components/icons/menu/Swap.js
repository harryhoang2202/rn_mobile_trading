// import * as React from "react";
// import CommonImage from "@components/commons/CommonImage";

// const Swap = ({ size, isFocused, style }) => {
//   const defaultSize = size || 24;
//   const source = isFocused
//     ? require("@assets/images/bottombar/swap_active.png")
//     : require("@assets/images/bottombar/swap_inactive.png");
//   return (
//     <CommonImage
//       source={source}
//       style={{ width: defaultSize, height: defaultSize, ...style }}
//     />
//   );
// };

// export default Swap;

import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import PropTypes from "prop-types";
const Swap = (props) => (
  <Svg
    width={props.width}
    height={props.height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M2.52 8.259a.68.68 0 0 1 .202-.486L7.315 3.18a.692.692 0 0 1 .971 0 .692.692 0 0 1 0 .972L3.694 8.745a.692.692 0 0 1-.972 0 .72.72 0 0 1-.201-.486Z"
      fill={props.color}
    />
    <Path
      d="M2.52 8.259c0-.376.312-.688.688-.688h15.584c.375 0 .687.312.687.688a.693.693 0 0 1-.688.687H3.208a.693.693 0 0 1-.687-.687ZM13.512 18.342a.68.68 0 0 1 .201-.486l4.593-4.592a.692.692 0 0 1 .972 0 .692.692 0 0 1 0 .971l-4.593 4.593a.692.692 0 0 1-.972 0 .68.68 0 0 1-.201-.486Z"
      fill={props.color}
    />
    <Path
      d="M2.52 13.741c0-.376.312-.688.688-.688h15.584c.375 0 .687.312.687.688a.692.692 0 0 1-.688.688H3.208a.687.687 0 0 1-.687-.688Z"
      fill={props.color}
    />
  </Svg>
);
Swap.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
Swap.defaultProps = {
  width: 22,
  height: 22,
  color: "#FFFFFF",
};
export default Swap;
