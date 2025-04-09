import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';

type Props = {
  children: React.ReactNode;
};

const serverURL = 'http://localhost:3000';

export const OTAUpdater: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  async function checkForUpdate(currentVersion: string) {
    const { data } = await axios.get(`${serverURL}/update?platform=${Platform.OS}&version=${currentVersion}`);

    if (data.status === 200) {
      return data;
    }

    return null;
  }

  async function downloadBundle(bundleUrl: string) {
    const path = `${RNFS.DocumentDirectoryPath}/index.bundle`;
    const download = RNFS.downloadFile({
      fromUrl: bundleUrl,
      toFile: path,
    });

    const result = await download.promise;

    if (result.statusCode === 200) {
      return path;
    } else {
      throw new Error('Download file');
    }
  }

  useEffect(() => {
    async function initialize() {
      setLoading(true);
      const currentVersion = DeviceInfo.getVersion();
      const data = await checkForUpdate(currentVersion);

      if (data) {
        downloadBundle(data.url);
      }
      setLoading(false);
    }

    initialize();
  }, []);

  if (loading) {
    return (
      <View style={styles.view}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  view: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
