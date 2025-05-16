# react-native-bundle-push

A React Native Higher-Order Component for handling bundle updates over-the-air.

## Installation

```bash
npm install react-native-bundle-push
# or
yarn add react-native-bundle-push
```
## Usage

Make sure to install the peer dependencies on your react-native app:
```bash
npm install axios react-native-fs react-native-device-info
```

Export your app with the component
```
import { withBundlePush } from 'react-native-bundle-push';

const App = () => {
  return (
    <View>
      <Text>Your App Content</Text>
    </View>
  );
};

const config = {
  serverURL: 'http://your-server.com'
};

export default withBundlePush(App, config);
```

## iOS Setup

On your AppDelegate.swift add a new method
```
private func getBundleURL() -> URL {
    let fileManager = FileManager.default
    
    if let documentsDir = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first {
        let bundlePath = documentsDir.appendingPathComponent("index.bundle")
        
        if fileManager.fileExists(atPath: bundlePath.path) {
            print("[OTA] Loading bundle from local filesystem: \(bundlePath.path)")
            return bundlePath
        } else {
            print("[OTA] Loading default bundle from app package.")
          return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackExtension: "jsbundle")!
        }
    }
    
    print("[OTA] Fallback: Loading default bundle (documents dir not found).")
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackExtension: "jsbundle")!
}
```

Change the sourceURL method, if your app finds a bundle in the filesystem, it loads it. Otherwise, it loads the built-in bundle
```
override func sourceURL(for bridge: RCTBridge) -> URL? {
  #if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackExtension: "jsbundle")
  #else
    let documentDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    let otaBundleURL = documentDirectory.appendingPathComponent("index.ios.bundle")

    if FileManager.default.fileExists(atPath: otaBundleURL.path) {
      return otaBundleURL
    } else {
      return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    }
  #endif
}
```

On your application method get the bundle location
```
let jsCodeLocation = getBundleURL();
```

And create a new rootView
```
let rootView = RCTRootView(
    bundleURL: jsCodeLocation,
    moduleName: "ExampleProject",
    initialProperties: nil
)

self.window = UIWindow(frame: UIScreen.main.bounds)
let rootViewController = UIViewController()
rootViewController.view = rootView
self.window.rootViewController = rootViewController
self.window.makeKeyAndVisible()

return true
```

## Android setup

Find your getJSBundleFile() function and override it

```
@Override
protected String getJSBundleFile() {
  var bundleFile: File = new File(getApplicationContext().getFilesDir(), "index.bundle");

  if (bundleFile.exists()) {
    return bundleFile.getAbsolutePath();
  } else {
    return super.getJSBundleFile();
  }
}
```