import React, { useEffect, useState } from 'react';
import { Platform, View, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import { BundlePushProps, UpdateResponse } from './types';

const withBundlePush = (
  WrappedComponent: React.ComponentType<any>,
  config: BundlePushProps['config']
) => {
  return function WithBundlePush(props: any) {
    const [loading, setLoading] = useState(true);

    async function checkForUpdate(currentVersion: string): Promise<UpdateResponse | null> {
      try {
        const { data } = await axios.get(
          `${config.serverURL}/update?platform=${Platform.OS}&version=${currentVersion}`
        );

        if (data.status === 200) {
          return data;
        }

        return null;
      } catch (error) {
        console.error('Error checking for updates:', error);
        return null;
      }
    }

    async function downloadBundle(bundleUrl: string): Promise<string> {
      const path = `${RNFS.DocumentDirectoryPath}/index.bundle`;
      try {
        const download = RNFS.downloadFile({
          fromUrl: bundleUrl,
          toFile: path,
        });

        const result = await download.promise;

        if (result.statusCode === 200) {
          return path;
        } else {
          throw new Error('Download failed');
        }
      } catch (error) {
        console.error('Error downloading bundle:', error);
        throw error;
      }
    }

    useEffect(() => {
      async function initialize() {
        setLoading(true);
        try {
          const currentVersion = DeviceInfo.getVersion();
          const data = await checkForUpdate(currentVersion);

          if (data?.url) {
            await downloadBundle(data.url);
          }
        } catch (error) {
          console.error('Initialization error:', error);
        } finally {
          setLoading(false);
        }
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

    return <WrappedComponent {...props} />;
  };
};

const styles = StyleSheet.create({
  view: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default withBundlePush;