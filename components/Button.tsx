import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable, StyleSheet, Text, ViewProps } from "react-native"

type ButtonProps = ViewProps & {
  text:string,
  onPress:() => void
}

export function Button({style,text,onPress,...rest}:ButtonProps){

  const backgroundColor = useThemeColor({}, 'tint');
  const color = useThemeColor({}, 'buttonText');

  return <Pressable style={[style,{backgroundColor},styles.button]} onPress={onPress} {...rest}>
    <Text style={[styles.text,{color}]}>{text}</Text>
  </Pressable>
}

const styles = StyleSheet.create({
  button:{
    borderRadius:8,
    paddingHorizontal:16,
    paddingVertical:8
  },
  text:{
    fontSize:14,
    lineHeight:17,
  }
})