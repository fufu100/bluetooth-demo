import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet,Image,Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BlurTabBarBackground() {
  const {width} = Dimensions.get('window');
  return (
    // <BlurView
    //   // System chrome material automatically adapts to the system's theme
    //   // and matches the native tab bar appearance on iOS.
    //   tint="systemChromeMaterial"
    //   intensity={100}
    //   style={StyleSheet.absoluteFill}
    // />
    <Image source={require('@/assets/images/ic_tab_bg.png')} style={[StyleSheet.absoluteFill,{backgroundColor:'white',width}]}/>
  );
}

export function useBottomTabOverflow() {
  const tabHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  return tabHeight - bottom;
}
