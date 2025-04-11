import {Tabs} from 'expo-router';
import React from 'react';
import {Image, Platform, StyleSheet} from 'react-native';

import {HapticTab} from '@/components/HapticTab';
import {IconSymbol} from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            borderTopColor: 'rgba(0,0,0,0)',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({color}) => <Image style={styles.icon} source={require('@/assets/images/tab1.png')} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({color}) => <Image style={styles.icon} source={require('@/assets/images/tab2.png')} />,
        }}
      />
      <Tabs.Screen
        name="tab3"
        options={{
          tabBarIcon: ({color}) => (
            <Image style={[{width: 48, height: 48, marginBottom: 44}]} source={require('@/assets/images/tab0.png')} />
          ),
        }}
      />
      <Tabs.Screen
        name="tab4"
        options={{
          tabBarIcon: ({color}) => <Image style={styles.icon} source={require('@/assets/images/tab3.png')} />,
        }}
      />
      <Tabs.Screen
        name="tab5"
        options={{
          tabBarIcon: ({color}) => <Image style={styles.icon} source={require('@/assets/images/tab4.png')} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
});
