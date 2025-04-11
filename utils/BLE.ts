import {observable, runInAction} from 'mobx';
import {useCallback, useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {BleError, BleManager, Characteristic, Device, Subscription} from 'react-native-ble-plx';
import {Buffer} from '@craftzdog/react-native-buffer';
import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ConnectedDevice} from '@/app/(tabs)/home/devices';
import {Command} from '@/constants/Commands';

const serviceUUID = '0000fff0-0000-1000-8000-00805f9b34fb';
const readCharacteristic = '0000fff1-0000-1000-8000-00805f9b34fb';
const writeCharacteristic = '0000fff2-0000-1000-8000-00805f9b34fb';

type DataType = {
  allDevices: Device[];
  error?: BleError | null;
  device?: Device;
  connected: boolean;
};

export default class BLE {
  data = observable.object<DataType>({
    allDevices: [],
    connected: false,
  });
  uuid = {
    service: '',
    read: '',
    write: '',
  };
  subscription: Subscription | null = null;
  bleManager = new BleManager();

  commandArr: Array<string[]> = [];
  receiveBleData?: (command: string, data: string) => void;

  async requestPermissions() {
    if (Platform.OS === 'android') {
      if (Platform.OS === 'android' && PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
        const apiLevel = parseInt(Platform.Version.toString(), 10);

        if (apiLevel < 31) {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN && PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
          const result = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);

          return (
            result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
            result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
            result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
          );
        }
      }
    } else {
      return true;
    }
  }

  async connectToDevice(deviceId: string) {
    try {
      const deviceConnection = await this.bleManager.connectToDevice(deviceId);
      runInAction(() => {
        this.data.device = deviceConnection;
        this.data.connected = true;
      });

      const connectedDeviceArr = JSON.parse((await AsyncStorage.getItem('connectedDevices')) ?? '[]') as ConnectedDevice[];
      const i = _.findIndex(connectedDeviceArr, {id: deviceId});
      if (i !== -1) {
        connectedDeviceArr.splice(i, 1);
      }
      connectedDeviceArr.unshift({id: deviceId, name: deviceConnection.name ?? ''});
      await AsyncStorage.setItem('connectedDevices', JSON.stringify(connectedDeviceArr));

      await deviceConnection.discoverAllServicesAndCharacteristics();
      const services = await deviceConnection.services();
      console.log('Services:', services, deviceConnection.serviceUUIDs);

      services
        .find(service => {
          if (service.uuid.includes(serviceUUID)) {
            console.log('Found service:', service, service.uuid);
            this.uuid.service = service.uuid;
            console.log('Found service:', this.uuid);
            return service;
          }
          return null;
        })
        ?.characteristics()
        .then(characteristics => {
          console.log('Found characteristics:', characteristics);
          const read = characteristics.find(c => c.uuid.includes(readCharacteristic));
          if (read) {
            console.log('Found characteristic:', read);
            this.uuid.read = read.uuid;
          }
          const write = characteristics.find(c => c.uuid.includes(writeCharacteristic));
          if (write) {
            console.log('Found characteristic:', write);
            this.uuid.write = write.uuid;
          }
          this.startStreamingData(deviceConnection);
        });
      this.bleManager.stopDeviceScan();
    } catch (e) {
      console.log('FAILED TO CONNECT', e);
    }
  }

  async disconnectFromDevice() {
    console.log('Disconnecting from device', this.data.device);
    if (this.data.device) {
      this.subscription?.remove();
      await this.data.device.cancelConnection();
      runInAction(() => {
        this.data.device = undefined;
        this.data.connected = false;
      });
    }
  }

  scanForPeripherals = () =>
    this.bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device && device.name) {
        runInAction(() => {
          const i = _.findIndex(this.data.allDevices, {id: device.id});
          if (i !== -1) {
            this.data.allDevices.splice(i, 1);
          }
          this.data.allDevices = [...this.data.allDevices, device];
        });
      }
    });

  onDataUpdate = (error: BleError | null, characteristic: Characteristic | null) => {
    if (error) {
      console.log(error);
      return;
    } else if (!characteristic?.value) {
      console.log('No Data was received');
      return;
    }

    const buffer = Buffer.from(characteristic.value, 'base64');
    const value = buffer.toString('hex').toUpperCase();
    const len = (buffer.readInt8(1) << 8) | buffer.readInt8(2);
    const data = buffer.toString('hex', 6, len + 6);
    const command = value.substring(8, 12);
    if (this.commandArr.length === 0) {
      this.commandArr = Object.keys(Command).map(key => [key, Command[key]]);
    }
    const commandItem = _.find(this.commandArr, item => item[1] === command);
    console.log('Command:', commandItem);
    if (commandItem?.[0].startsWith('RX')) {
      this.sendBleData(command, '', 0);
    }
    this.receiveBleData?.(command, data);
    console.log('Received Data1: ', value, command, len, data);
  };

  startStreamingData = async (device: Device) => {
    if (device) {
      this.subscription?.remove();
      this.subscription = device.monitorCharacteristicForService(this.uuid.service, this.uuid.read, this.onDataUpdate);
    } else {
      console.log('not connected');
    }
  };

  sendBleData = (cmd: string, data: string, len: number) => {
    const buffer = new Buffer(len + 8);
    buffer.write('DC', 0, 1, 'hex');
    buffer.writeInt8(len >> 8 && 0xff, 1);
    buffer.writeInt8(len & 0xff, 2);
    buffer.writeInt8(0x01, 3);
    buffer.write(cmd, 4, 2, 'hex');
    buffer.write(data, 6, len, 'hex');
    buffer.writeInt8(0x0a, len + 6);
    buffer.writeInt8(0x0d, len + 7);
    console.log('sendBleData:', buffer.toString('hex'));
    this.data.device?.writeCharacteristicWithResponseForService(this.uuid.service, this.uuid.write, buffer.toString('base64'));
  };

  sendMessage = async (message: string) => {
    if (this.data.connected) {
      const arr = new Uint8Array([0x02]);

      const buffer = new Buffer(arr);
      // device?.writeCharacteristicWithoutResponseForService(uuid.service, uuid.write, buffer.toString());
      this.data.device?.writeCharacteristicWithoutResponseForService(this.uuid.service, this.uuid.write, buffer.toString('base64'));
      this.data.device
        ?.writeCharacteristicWithResponseForService(this.uuid.service, this.uuid.write, buffer.toString('base64'))
        .then(characteristic => {
          const value3 = Buffer.from(characteristic.value ?? '', 'base64');
          console.log('Received Data2: ', value3);
        });
    }
  };
}
