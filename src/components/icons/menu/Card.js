// import * as React from 'react';
// import CommonImage from '@components/commons/CommonImage';

// const Card = ({size, isFocused}) => {
//     const defaultSize = size || 24;
//     const source = isFocused
//         ? require('@assets/images/bottombar/card_active.png')
//         : require('@assets/images/bottombar/card_inactive.png');
//     return (
//         <CommonImage
//             source={source}
//             style={{width: defaultSize, height: defaultSize}}
//         />
//     );
// };

// export default Card;

import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import PropTypes from "prop-types";
const Card = (props) => (
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
      d="M16.8 0H4.2C1.88 0 0 1.919 0 4.286v6.428C0 13.081 1.88 15 4.2 15h12.6c2.32 0 4.2-1.919 4.2-4.286V4.286C21 1.919 19.12 0 16.8 0ZM4.2 1.607h12.6c.696 0 1.364.282 1.856.785.492.502.769 1.183.769 1.894v4.553H1.575V4.286c0-1.48 1.175-2.679 2.625-2.679Zm0 11.786h12.6c.696 0 1.364-.282 1.856-.785a2.707 2.707 0 0 0 .769-1.894v-.268H1.575v.268c0 1.48 1.175 2.679 2.625 2.679Z"
      fill={props.color}
    />
  </Svg>
);
Card.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
Card.defaultProps = {
  width: 21,
  height: 15,
  color: "#FFFFFF",
};
export default Card;
