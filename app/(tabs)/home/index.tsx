import {Button} from '@/components/Button';
import {GreenLine} from '@/components/GreenLine';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {YellowBgView} from '@/components/YellowBgView';
import {useDevice} from '@/hooks/useDevice';
import {router} from 'expo-router';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, Image, Dimensions, Switch, ScrollView, Pressable, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Command} from '@/constants/Commands';
import {observer} from 'mobx-react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const {width} = Dimensions.get('window');

type DataType = {
  count: number;
  countSetting: number;
  screenOrientation: boolean;
  show: number;
  from: string;
  to: string;
  every: string;
};

const WorkScreen = observer(() => {
  const [open, setOpen] = useState(true);
  const [bind, setBind] = useState(true);
  const [data, setData] = useState<DataType>({
    count: 0,
    countSetting: 0,
    screenOrientation: true,
    show: 0,
    from: '00:00 AM',
    to: '00:00 AM',
    every: '0',
  });
  const opacity = bind ? {opacity: 1} : {opacity: 0.5};
  const {ble} = useDevice();
  const {device} = ble.data;

  useEffect(() => {
    ble.sendBleData(Command.TX_GET_BL_SETTING, '00', 1);
    ble.receiveBleData = (command: string, d: string) => {
      if (command === Command.RX_COUNT_REALTIME) {
        const count = parseInt(d, 16);
        setData(prev => ({...prev, count}));
      } else if (command == Command.TX_GET_BL_SETTING) {
        if (d.length === 50) {
          const countSetting = parseInt(d.substring(36, 38), 16);
          const remind = d.substring(49, d.length);
          setOpen(remind[0] == '1');
          setData({
            ...data,
            from: moment()
              .hour(parseInt(remind.substring(1, 3), 16))
              .minute(parseInt(remind.substring(3, 5), 16))
              .format('hh:mm A'),
            to: moment()
              .hour(parseInt(remind.substring(5, 7), 16))
              .minute(parseInt(remind.substring(7, 9), 16))
              .format('hh:mm A'),
            every: parseInt(remind.substring(9, 11), 16).toString(),
            countSetting,
          });
        }
      }
    };

    return () => {
      ble.disconnectFromDevice();
      ble.receiveBleData = undefined;
    };
  }, []);

  const countSetting = useCallback(
    (step: number) => {
      const count = data.countSetting + step;
      setData({...data, countSetting: count});
      ble.sendBleData(Command.TX_SET_COUNT_VIBRATION, count.toString(16), 1);
    },
    [data.countSetting],
  );

  return (
    <ThemedView style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <ThemedView style={[styles.topView, opacity]}>
            <Image source={require('@/assets/images/ring.png')} />
            <ThemedView style={{gap: 8, alignItems: 'flex-end', justifyContent: 'center'}}>
              <Image source={require('@/assets/images/bluetooth.png')} />
              <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
                <Image source={require('@/assets/images/battery.png')} />
                <ThemedText style={{fontSize: 10}}>50%</ThemedText>
              </View>
              <Pressable
                onPress={() => {
                  ble.sendMessage('02');
                }}>
                <Image source={require('@/assets/images/refresh.png')} />
              </Pressable>
            </ThemedView>
            <ThemedView style={{gap: 8, alignItems: 'center', flex: 1}}>
              <View style={{flexDirection: 'row', gap: 12, alignItems: 'center'}}>
                <Image source={require('@/assets/images/edit.png')} />
                <ThemedText type="title2">{device?.name}</ThemedText>
              </View>
              <Button
                text="Switch Device"
                style={{marginTop: 8}}
                onPress={() => {
                  router.push('/(tabs)/home/devices');
                }}
              />
              <View style={styles.statusView}>
                <ThemedText type="small" style={{}}>
                  {'Unbind'}
                </ThemedText>
              </View>
            </ThemedView>
          </ThemedView>

          <View style={styles.yellowView}>
            <YellowBgView width={width - 32} height={136} style={{position: 'absolute'}} />
            <ThemedText style={{marginTop: 8}} type="title">
              SHOP NOW
            </ThemedText>
            <ThemedText style={{marginTop: 8, textAlign: 'center'}}>
              This section will lead to an external website, to be browsed through the app
            </ThemedText>
          </View>

          <ThemedView style={styles.shadow}>
            <View style={[styles.item, opacity]}>
              <Image source={require('@/assets/images/tasbih_counter.png')} />
              <ThemedText style={{flex: 1}}>Tasbih Counter</ThemedText>
              <ThemedText type="title" style={styles.itemRightText}>
                {data.count}
              </ThemedText>
              <GreenLine width={width - 32} style={styles.line} />
            </View>

            <View style={[styles.item, opacity]}>
              <Image source={require('@/assets/images/setting.png')} />
              <ThemedText style={{flex: 1}}>Tasbih Counter Setting</ThemedText>
              <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                <Pressable onPress={() => countSetting(-1)} style={{marginTop: 4}}>
                  <Image source={require('@/assets/images/minus.png')} />
                </Pressable>
                <ThemedText type="title" style={{paddingHorizontal: 8, textAlign: 'justify'}}>
                  {data.countSetting}
                </ThemedText>
                <Pressable onPress={() => countSetting(1)} style={{marginTop: 4}}>
                  <Image source={require('@/assets/images/plus.png')} />
                </Pressable>
              </View>
              <GreenLine width={width - 32} style={styles.line} />
            </View>

            <View style={[styles.item, {height: 'auto', alignItems: 'center', paddingBottom: 8}, opacity]}>
              <Image source={require('@/assets/images/tasbih.png')} />
              <ThemedText style={{flex: 1}}>Tasbih Screen</ThemedText>
              <View style={{alignItems: 'center'}}>
                <ThemedText type="title" style={{paddingVertical: 4}}>
                  {data.screenOrientation ? 'Normal' : 'Up Side Down'}
                </ThemedText>
                <GreenLine width={72} height={2} style={styles.line} />
              </View>
              <Pressable
                onPress={() => {
                  setData({...data, screenOrientation: !data.screenOrientation});
                  ble.sendBleData(Command.TX_SCREEN_ROTATE, '', 0);
                }}>
                <ThemedText type="small" style={styles.itemRightText}>
                  Up & Down
                </ThemedText>
              </Pressable>
              <GreenLine width={width - 32} style={styles.line} />
            </View>

            <View>
              <View style={[styles.item, opacity]}>
                <ThemedText style={{flex: 1}}>Tasbih Reminder</ThemedText>
                <Switch value={open} onValueChange={value => setOpen(value)} />
              </View>
              {open && (
                <View style={{flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12}}>
                  <View style={{gap: 12}}>
                    <View style={styles.rowCenter}>
                      <ThemedText type="small">From</ThemedText>
                      <Pressable
                        onPress={() => {
                          setData({...data, show: 1});
                        }}>
                        <ThemedText type="small" style={styles.gray}>
                          {data.from}
                        </ThemedText>
                      </Pressable>
                    </View>
                    <View style={styles.rowCenter}>
                      <ThemedText type="small">To</ThemedText>
                      <Pressable
                        onPress={() => {
                          setData({...data, show: 2});
                        }}>
                        <ThemedText type="small" style={styles.gray}>
                          {data.to}
                        </ThemedText>
                      </Pressable>
                    </View>
                  </View>
                  <View style={styles.rowCenter}>
                    <ThemedText type="small">Every</ThemedText>
                    <ThemedView style={[styles.gray, {flexDirection: 'row'}]}>
                      <TextInput
                        style={{width: 30, alignItems: 'center'}}
                        inputMode="numeric"
                        value={data.every}
                        onChangeText={t => {
                          setData({...data, every: t});
                          const d = '01' + data.from.replaceAll(/(:|\s|AM)/g, '') + data.to.replaceAll(/(:|\s|AM)/g, '') + t;
                          ble.sendBleData(Command.TX_SET_PRAY_TIME, d, d.length / 2);
                        }}
                      />
                      <ThemedText type="small">Minutes</ThemedText>
                    </ThemedView>
                  </View>
                </View>
              )}
              <GreenLine width={width - 32} style={styles.line} />
            </View>

            <Pressable style={[styles.item, opacity]} onPress={() => ble.sendBleData(Command.TX_FIND, '03', 1)}>
              <ThemedText style={{flex: 1}}>Find My Tasbih Ring</ThemedText>
              <Image source={require('@/assets/images/signal.png')} />
              <GreenLine width={width - 32} style={styles.line} />
            </Pressable>
          </ThemedView>
        </ScrollView>

        {data.show > 0 && (
          <DateTimePicker
            mode="time"
            is24Hour={false}
            value={new Date()}
            onChange={(event, date) => {
              console.log('date', event.nativeEvent, date, data.show);
              console.log(moment(event.nativeEvent.timestamp).format('hh:mm A'));
              if (data.show === 1) {
                const from = moment(event.nativeEvent.timestamp).format('hh:mm A');
                const d = '01' + from.replaceAll(/(:|\s|AM)/g, '') + data.to.replaceAll(/(:|\s|AM)/g, '') + data.every;
                ble.sendBleData(Command.TX_SET_PRAY_TIME, d, d.length / 2);
                setData({...data, from, show: 0});
              } else if (data.show === 2) {
                const to = moment(event.nativeEvent.timestamp).format('hh:mm A');
                const d = '01' + data.from.replaceAll(/(:|\s|AM)/g, '') + to.replaceAll(/(:|\s|AM)/g, '') + data.every;
                ble.sendBleData(Command.TX_SET_PRAY_TIME, d, d.length / 2);
                setData({...data, to, show: 0});
              }
            }}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
});

export default WorkScreen;

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  topView: {
    paddingVertical: 16,
    gap: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusView: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yellowView: {
    marginHorizontal: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  shadow: {
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: 'red',
    shadowRadius: 10,
    borderRadius: 20,
  },
  item: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 8,
    height: 48,
    gap: 16,
    paddingHorizontal: 8,
  },
  line: {
    position: 'absolute',
    bottom: 0,
  },
  itemRightText: {
    width: 64,
    textAlign: 'center',
  },
  gray: {
    backgroundColor: '#F5F5F3',
    borderRadius: 12,
    padding: 10,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});
