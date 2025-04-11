import {Text, type TextProps, StyleSheet} from 'react-native';

import {useThemeColor} from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'title2' | 'defaultSemiBold' | 'subtitle' | 'link' | 'small';
};

export function ThemedText({style, lightColor, darkColor, type = 'default', ...rest}: ThemedTextProps) {
  const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');

  return (
    <Text
      style={[
        {color},
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'title2' ? styles.title2 : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'small' ? styles.small : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  title2: {
    fontSize: 18,
    lineHeight: 24,
  },
  small: {
    fontSize: 14,
    lineHeight: 17,
  },
  subtitle: {
    fontSize: 12,
    color: '#7E7E7E',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
