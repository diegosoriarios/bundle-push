import RNFS from 'react-native-fs';
import { Alert } from 'react-native';

const serverURL = 'https://yourserver.com';

export async function checkForUpdate(currentVersion) {
  const { data } = await axios.get(`${serverURL}/update?currentVersion=${currentVersion}`);

  if (data.status === 200) {
    return data;
  }

  return null;
}

export async function downloadBundle(bundleUrl) {
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
