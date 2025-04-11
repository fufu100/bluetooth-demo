import Svg, { Defs, LinearGradient, Rect, Stop, SvgProps } from "react-native-svg";

export function YellowBgView({width,height,...rest}:SvgProps){
  return <Svg width={width} height={height} {...rest}>
     <Defs>
        <LinearGradient id="grad" x1={'50%'} y1={'0%'} x2={'50%'} y2={'100%'}>
          <Stop offset="0" stopColor="#F3A94A" stopOpacity="1" />
          <Stop offset="1" stopColor="#EFC16C" stopOpacity="1" />
        </LinearGradient>
      </Defs>
    <Rect width={width} height={height} rx={20} ry={20} fill={'url(#grad)'}/>
  </Svg>
}