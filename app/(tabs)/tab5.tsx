import {ThemedView} from '@/components/ThemedView';
import {StyleSheet, Text} from 'react-native';

export default function Tab5() {
  return (
    <ThemedView style={styles.container}>
      <Text>{'Tab5'}</Text>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
