import {DeviceContext} from '@/contexts/DeviceProvider';
import {useContext} from 'react';

export const useDevice = () => useContext(DeviceContext);
