// <?xml version="1.0" encoding="UTF-8" standalone="no"?>
// <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
// <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
//   <path d="M 22.5,11.63 L 22.5,6" style="fill:none; stroke:#000000; stroke-linejoin:miter;"/>
//   <path d="M 20,8 L 25,8" style="fill:none; stroke:#000000; stroke-linejoin:miter;"/>
//   <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" style="fill:#ffffff; stroke:#000000; stroke-linecap:butt; stroke-linejoin:miter;"/>
//   <path d="M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37" style="fill:#ffffff; stroke:#000000;"/>
//   <path d="M 12.5,30 C 18,27 27,27 32.5,30" style="fill:none; stroke:#000000;"/>
//   <path d="M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5" style="fill:none; stroke:#000000;"/>
//   <path d="M 12.5,37 C 18,34 27,34 32.5,37" style="fill:none; stroke:#000000;"/>
// </svg>

import { SvgIcon, SvgIconProps } from "@mui/material";

const KingOutlineIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <path d="M 22.5,11.63 L 22.5,6" style={{fill:"none", stroke:"#000000", strokeLinejoin:"miter"}} />
      <path d="M 20,8 L 25,8" style={{fill:"none", stroke:"#000000", strokeLinejoin:"miter"}} />
      <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" style={{fill:"#ffffff", stroke:"#000000", strokeLinecap:"butt", strokeLinejoin:"miter"}} />
      <path d="M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37" style={{fill:"#ffffff", stroke:"#000000"}} />
      <path d="M 12.5,30 C 18,27 27,27 32.5,30" style={{fill:"none", stroke:"#000000"}} />
      <path d="M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5" style={{fill:"none", stroke:"#000000"}} />
      <path d="M 12.5,37 C 18,34 27,34 32.5,37" style={{fill:"none", stroke:"#000000"}} />
    </SvgIcon>
  )
}

export default KingOutlineIcon