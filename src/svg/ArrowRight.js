import * as React from "react"
import Svg, { Path } from "react-native-svg"

const ArrowRight = (props) => (
  <Svg
    width={14}
    height={13}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="m6.71.816-.546.52c-.137.137-.137.355 0 .465l4.238 4.238H1.078a.332.332 0 0 0-.328.328v.766c0 .191.137.328.328.328h9.324l-4.238 4.266c-.137.109-.137.328 0 .464l.547.52c.11.137.328.137.465 0l5.715-5.715a.315.315 0 0 0 0-.465L7.176.816C7.039.68 6.82.68 6.71.816Z"
      fill="#BCBEC4"
    />
  </Svg>
)

export default ArrowRight;