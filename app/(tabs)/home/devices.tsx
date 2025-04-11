import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {useDevice} from '@/hooks/useDevice';
import {useThemeColor} from '@/hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter} from 'expo-router';
import {observer} from 'mobx-react';
import {useEffect, useState} from 'react';
import {FlatList, Image, ListRenderItemInfo, Pressable, StyleSheet, View} from 'react-native';

export type ConnectedDevice = {
  id: string;
  name: string;
};

const Devices = observer(() => {
  const {ble} = useDevice();
  const {device} = ble.data;
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const backgroundColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem('connectedDevices').then(res => {
      const connectedDevices = JSON.parse(res ?? '[]') as ConnectedDevice[];
      setDevices(connectedDevices);
    });
  }, []);

  const renderItem = ({item}: ListRenderItemInfo<ConnectedDevice>) => {
    return (
      <ThemedView style={[styles.item, {backgroundColor: item.id === device?.id ? backgroundColor : '#fff'}]}>
        <Image source={require('@/assets/images/ring2.png')} />
        <View style={[styles.container, {justifyContent: 'space-between'}]}>
          <ThemedText type="title2" style={{color: item.id === device?.id ? '#fff' : textColor}}>
            {item.name}
          </ThemedText>
          <Pressable
            style={styles.btn}
            onPress={() => {
              if (item.id !== device?.id) {
                router.replace({
                  pathname: '/(tabs)/home/connecting',
                  params: {title: item.id},
                });
              }
            }}>
            <ThemedText style={{color: item.id === device?.id ? '#fff' : textColor}}>Connect</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList data={devices} renderItem={renderItem} />
    </ThemedView>
  );
});

export default Devices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    elevation: 8,
    flexDirection: 'row',
    borderRadius: 20,
  },
  btn: {
    borderColor: '#F3A94A',
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
});
