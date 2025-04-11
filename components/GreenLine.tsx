import Svg, { Defs,  LinearGradient, Rect, Stop, SvgProps } from "react-native-svg";

export function GreenLine({width,height = 1,...rest}:SvgProps){
  return <Svg width={width} height={height} {...rest}>
     <Defs>
        <LinearGradient id="grad" x1={'0%'} y1={'50%'} x2={'100%'} y2={'50%'}>
          <Stop offset="0" stopColor="#13805A" stopOpacity="1" />
          <Stop offset="1" stopColor="#2FC27D" stopOpacity="1" />
        </LinearGradient>
      </Defs>
    <Rect width={width} height={height} fill={'url(#grad)'}/>
  </Svg>
}