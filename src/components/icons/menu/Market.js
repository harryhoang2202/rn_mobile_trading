// import * as React from 'react';
// import CommonImage from '@components/commons/CommonImage';

// const Market = ({size, isFocused}) => {
//     const defaultSize = size || 24;
//     const source = isFocused
//         ? require('@assets/images/bottombar/market_active.png')
//         : require('@assets/images/bottombar/market_inactive.png');
//     return (
//         <CommonImage
//             source={source}
//             style={{width: defaultSize, height: defaultSize}}
//         />
//     );
// };

// export default Market;
import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import PropTypes from "prop-types";
const Market = (props) => (
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
      d="m19.28 1.82 1.66 4.61a3 3 0 0 1-.24 2.72 3.38 3.38 0 0 1-1.79 1.29v6.8a2.88 2.88 0 0 1-2.94 2.82H6.31a2.89 2.89 0 0 1-3-2.82v-6.7A3.39 3.39 0 0 1 1.5 9.45a3 3 0 0 1-.44-3l1.65-4.62A2.53 2.53 0 0 1 5.12.23h11.75a2.52 2.52 0 0 1 2.41 1.59Zm-6.929 16.61h.009v.03a.738.738 0 0 1-.008-.03Zm0 0H9.81a.93.93 0 0 0 0-.23v-2.11A1.16 1.16 0 0 1 11.09 15a1.15 1.15 0 0 1 1.23 1.05v2.14c0 .081.01.162.031.24Zm3.569 0h-2.11a.932.932 0 0 0 0-.23v-2.11a2.68 2.68 0 0 0-2.76-2.58 2.68 2.68 0 0 0-2.77 2.58v2.14a.93.93 0 0 0 0 .23H6.26a1.34 1.34 0 0 1-1.4-1.27v-6.67A3.25 3.25 0 0 0 7.55 8 3.31 3.31 0 0 0 11 10.59 3.31 3.31 0 0 0 14.37 8a3.26 3.26 0 0 0 2.86 2.6v6.64a1.34 1.34 0 0 1-1.31 1.22v-.03Zm2-9.59a1.65 1.65 0 0 0 1.32-.72v.03A1.26 1.26 0 0 0 19.31 7l-1.65-4.55a.81.81 0 0 0-.79-.45H5.12a.81.81 0 0 0-.78.41L2.69 7a1.28 1.28 0 0 0 .1 1.32c.25.306.608.503 1 .55.126.015.254.015.38 0a1.64 1.64 0 0 0 1.67-1.2 1.8 1.8 0 0 1 1.74-1.48 1.76 1.76 0 0 1 1.74 1.49A1.62 1.62 0 0 0 11 8.87a1.61 1.61 0 0 0 1.67-1.22 1.79 1.79 0 0 1 1.74-1.49 1.76 1.76 0 0 1 1.74 1.48 1.63 1.63 0 0 0 1.69 1.2h.08Z"
      fill={props.color}
    />
  </Svg>
);
Market.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
Market.defaultProps = {
  width: 22,
  height: 21,
  color: "#FFFFFF",
};
export default Market;
