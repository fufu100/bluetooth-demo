import React, {useEffect} from 'react';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {useRouter} from 'expo-router';
import {FlatList, Image, ImageBackground, ListRenderItemInfo, Pressable, StyleSheet, View} from 'react-native';
import {Device} from 'react-native-ble-plx';
import {observer} from 'mobx-react';
import {useDevice} from '@/hooks/useDevice';

const Scanning = observer(() => {
  const router = useRouter();
  const {ble} = useDevice();
  const {allDevices} = ble.data;

  useEffect(() => {
    ble.requestPermissions().then(granted => {
      if (granted) {
        console.log('Permissions granted');
        ble.scanForPeripherals();
      } else {
        console.log('Permissions denied');
      }
    });
  }, []);

  const ListHeader = () => {
    return (
      <ThemedView style={styles.imgView}>
        <ImageBackground source={require('@/assets/images/circle_bg.png')} style={styles.img}>
          <Image source={require('@/assets/images/bluetooth_green.png')} />
        </ImageBackground>
        <ThemedText type="title">Searching...</ThemedText>
      </ThemedView>
    );
  };

  const renderItem = ({item}: ListRenderItemInfo<Device>) => {
    const onPress = () => {
      router.push({
        pathname: '/(tabs)/home/connecting',
        params: {title: item.id},
      });
    };
    return (
      <Pressable style={styles.item} onPress={onPress}>
        <Image source={require('@/assets/images/ring2.png')} />
        <View style={{gap: 12, flex: 1}}>
          <ThemedText type="title2">{item.name}</ThemedText>
          <ThemedText type="subtitle">{item.id}</ThemedText>
        </View>
        <View style={{alignItems: 'center'}}>
          <Image source={require('@/assets/images/mdi_wireless.png')} />
          <ThemedText type="subtitle" style={{color: '#F3A94A'}}>
            connect
          </ThemedText>
        </View>
      </Pressable>
    );
  };

  return (
    <ThemedView style={{flex: 1}}>
      <FlatList ListHeaderComponent={<ListHeader />} data={allDevices} renderItem={renderItem} />
    </ThemedView>
  );
});

export default Scanning;

const styles = StyleSheet.create({
  imgView: {
    marginTop: 50,
    alignItems: 'center',
    gap: 16,
  },
  img: {
    width: 213,
    height: 213,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#F5F5F3',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
});
