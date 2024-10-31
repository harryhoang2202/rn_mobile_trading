// import * as React from 'react';
// import CommonImage from '@components/commons/CommonImage';

// const Dapp = ({size, isFocused}) => {
//     const defaultSize = size || 24;
//     const source = isFocused
//         ? require('@assets/images/bottombar/dapp_active.png')
//         : require('@assets/images/bottombar/dapp_inactive.png');
//     return (
//         <CommonImage
//             source={source}
//             style={{width: defaultSize, height: defaultSize}}
//         />
//     );
// };

// export default Dapp;

import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import PropTypes from "prop-types";
const Dapp = (props) => (
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
      d="M2.25 0h3.09a2.25 2.25 0 0 1 2.25 2.26v3.08a2.25 2.25 0 0 1-2.25 2.25H2.25A2.25 2.25 0 0 1 0 5.34V2.26A2.25 2.25 0 0 1 2.25 0Zm3.09 6.08a.76.76 0 0 0 .75-.75V2.26a.75.75 0 0 0-.75-.75H2.25a.75.75 0 0 0-.75.75v3.07a.76.76 0 0 0 .75.75h3.09ZM12.66 0h3.09A2.25 2.25 0 0 1 18 2.26v3.08a2.25 2.25 0 0 1-2.25 2.25h-3.09a2.25 2.25 0 0 1-2.25-2.25V2.25A2.25 2.25 0 0 1 12.66 0Zm3.09 6.08a.76.76 0 0 0 .75-.75V2.26a.75.75 0 0 0-.75-.75h-3.09a.75.75 0 0 0-.75.75v3.07a.76.76 0 0 0 .75.75h3.09ZM2.25 10.41h3.09a2.25 2.25 0 0 1 2.25 2.25v3.09A2.25 2.25 0 0 1 5.34 18H2.25A2.25 2.25 0 0 1 0 15.74v-3.08a2.25 2.25 0 0 1 2.25-2.25Zm3.09 6.08a.75.75 0 0 0 .75-.75v-3.08a.76.76 0 0 0-.75-.75H2.25a.76.76 0 0 0-.75.75v3.08c0 .414.336.75.75.75h3.09ZM12.66 10.41h3.09A2.25 2.25 0 0 1 18 12.66v3.08A2.25 2.25 0 0 1 15.75 18h-3.09a2.25 2.25 0 0 1-2.25-2.26v-3.08a2.25 2.25 0 0 1 2.25-2.25Zm3.09 6.08a.75.75 0 0 0 .75-.75v-3.08a.76.76 0 0 0-.75-.75h-3.09a.76.76 0 0 0-.75.75v3.08c0 .414.336.75.75.75h3.09Z"
      fill={props.color}
    />
  </Svg>
);
Dapp.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
Dapp.defaultProps = {
  width: 18,
  height: 18,
  color: "#FFFFFF",
};
export default Dapp;
