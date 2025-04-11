import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {useDevice} from '@/hooks/useDevice';
import {useLocalSearchParams, useNavigation, useRouter} from 'expo-router';
import {useEffect} from 'react';
import {ImageBackground, StyleSheet, Image} from 'react-native';

export default function Connecting() {
  const {title} = useLocalSearchParams<{title: string}>();
  const navigation = useNavigation();
  const router = useRouter();
  const {ble} = useDevice();

  useEffect(() => {
    navigation.setOptions({
      title,
    });
    ble
      .connectToDevice(title as string)
      .then(() => {
        router.replace('/(tabs)/home');
      })
      .catch(err => {
        console.error('Connection error:', err);
      });
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ImageBackground source={require('@/assets/images/circle_bg.png')} style={styles.img}>
        <Image source={require('@/assets/images/ring2.png')} style={styles.ring} />
      </ImageBackground>
      <ThemedText type="title" style={{marginTop: 16}}>
        Connecting...
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  img: {
    width: 213,
    height: 213,
    marginTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    width: 100,
    height: 105,
  },
});
