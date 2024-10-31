import * as React from "react";
import Svg, { SvgProps, Circle, Path } from "react-native-svg";
import PropTypes from "prop-types";
const Transfert = (props) => (
  <Svg
    width={props.width}
    height={props.height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle
      cx={11.5}
      cy={11.5}
      r={10.5}
      transform="rotate(-180 11.5 11.5)"
      stroke={props.color}
      strokeWidth={2}
    />
    <Path
      d="M5.25 14.633a.624.624 0 0 0 .19.429l2.496 2.496a.623.623 0 0 0 .885 0l2.497-2.496a.624.624 0 1 0-.884-.88L9.005 15.61V5.885a.624.624 0 0 0-1.248 0v9.73l-1.434-1.433a.623.623 0 0 0-1.073.45Zm6.243-6.25a.625.625 0 0 0 1.074.432l1.428-1.428v9.725a.626.626 0 0 0 1.205.243.626.626 0 0 0 .043-.243v-9.73l1.434 1.433a.622.622 0 0 0 .892.007.623.623 0 0 0-.012-.892l-2.493-2.496a.624.624 0 0 0-.885 0L11.682 7.93a.623.623 0 0 0-.189.452Z"
      fill={props.color}
    />
  </Svg>
);
Transfert.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
Transfert.defaultProps = {
  width: 23,
  height: 23,
  color: "#FFFFFF",
};
export default Transfert;
