// import * as React from "react";
// import CommonImage from "@components/commons/CommonImage";

// const Setting = ({ size, isFocused }) => {
//   const defaultSize = size || 24;
//   const source = isFocused
//     ? require("@assets/images/bottombar/setting.png")
//     : require("@assets/images/bottombar/setting.png");
//   return (
//     <CommonImage
//       source={source}
//       style={{ width: defaultSize, height: defaultSize }}
//     />
//   );
// };

// export default Setting;

import * as React from "react";
import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg";
import PropTypes from "prop-types";
const Setting = (props) => (
  <Svg
    width={props.width}
    height={props.height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        d="M1.395 5.92A1.96 1.96 0 0 0 2.94 3.27a.92.92 0 0 1 .275-1.035A7.375 7.375 0 0 1 5.415.96a.925.925 0 0 1 1.045.29 1.955 1.955 0 0 0 3.08 0 .925.925 0 0 1 1.045-.29 7.41 7.41 0 0 1 2.05 1.15.93.93 0 0 1 .29 1.065 1.95 1.95 0 0 0 1.625 2.68.925.925 0 0 1 .81.745 7.16 7.16 0 0 1 .045 2.575.925.925 0 0 1-.815.775A1.952 1.952 0 0 0 13 12.705a.91.91 0 0 1-.255 1.09 7.43 7.43 0 0 1-2.18 1.255.92.92 0 0 1-1.065-.335 1.936 1.936 0 0 0-1.6-.84 1.96 1.96 0 0 0-1.57.79.92.92 0 0 1-1.08.305 7.499 7.499 0 0 1-2-1.195.925.925 0 0 1-.27-1.055 1.95 1.95 0 0 0-1.565-2.695.925.925 0 0 1-.785-.76A7.25 7.25 0 0 1 .5 8c0-.448.042-.895.125-1.335a.915.915 0 0 1 .77-.745ZM5.5 8a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z"
        fill={props.color}
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path
          fill={props.color}
          transform="matrix(-1 0 0 1 16 0)"
          d="M0 0h16v16H0z"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
Setting.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
Setting.defaultProps = {
  width: 16,
  height: 16,
  color: "#FFFFFF",
};
export default Setting;
