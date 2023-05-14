import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import FieldScreen from './screens/FieldScreen';
import TestScreen from './screens/TestScreen';
import { colors } from './utils/colors';

export default function App() {
  return (
    <View style={styles.container}>
      <FieldScreen />
      {/* <TestScreen /> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    display: 'flex',
    alignItems: 'center'
  },
});
