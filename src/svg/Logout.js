import * as React from "react";
import Svg, { Path } from "react-native-svg";

const Logout = (props) => (
  <Svg
    width={14}
    height={14}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M6.977 12.814H1.744a.582.582 0 0 1-.581-.581V1.767c0-.32.26-.58.581-.58h5.233a.58.58 0 1 0 0-1.164H1.744C.783.023 0 .806 0 1.767v10.466c0 .961.783 1.744 1.744 1.744h5.233a.58.58 0 1 0 0-1.163Z"
      fill="#fff"
    />
    <Path
      d="m13.827 6.586-3.535-3.488a.581.581 0 0 0-.816.828l2.526 2.493h-6.77a.58.58 0 1 0 0 1.162h6.77l-2.526 2.493a.581.581 0 1 0 .816.828l3.535-3.488a.582.582 0 0 0 0-.828Z"
      fill="#fff"
    />
  </Svg>
)

export default Logout;