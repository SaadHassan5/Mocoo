import * as React from "react"
import Svg, { Path } from "react-native-svg"

const ArrowLeft = (props) => (
  <Svg
    width={15}
    height={14}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="m8.156 13.813.625-.594c.156-.156.156-.406 0-.531L3.937 7.811h10.688A.38.38 0 0 0 15 7.438v-.875a.403.403 0 0 0-.375-.375H3.937l4.844-4.843c.156-.125.156-.375 0-.532L8.156.22c-.125-.157-.375-.157-.531 0L1.094 6.75a.36.36 0 0 0 0 .531l6.531 6.532c.156.156.406.156.531 0Z"
      fill="#0E1133"
    />
  </Svg>
)

export default ArrowLeft;