import { NativeModules, Platform } from 'react-native';

const { RestartManager } = NativeModules;

export function restartApp() {
  if (Platform.OS === 'android') return;

  RestartManager.restartApp();
}
