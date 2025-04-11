import {Stack} from 'expo-router';
import {View} from 'react-native';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{headerShown: false, headerShadowVisible: false}}>
      <Stack.Screen name="scanning" options={{headerShown: true, title: 'Add Device'}} />
      <Stack.Screen name="connecting" options={({route}) => ({headerShown: true})} />
      <Stack.Screen name="devices" options={{headerShown: true, title: 'My Device'}} />
      <Stack.Screen name="index" options={{headerShown: false}} />
    </Stack>
  );
}
