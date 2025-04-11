import BLE from '@/utils/BLE';
import React, {createContext, PropsWithChildren, useMemo, useState} from 'react';

type DeviceContextType = {
  ble: BLE;
};

export const DeviceContext = createContext<DeviceContextType>(null as any);

export const DeviceProvider = ({children}: PropsWithChildren) => {
  const ble = useMemo(() => new BLE(), []);

  return <DeviceContext.Provider value={{ble}}>{children}</DeviceContext.Provider>;
};
