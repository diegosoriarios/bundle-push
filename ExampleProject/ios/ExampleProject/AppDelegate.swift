import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    let jsCodeLocation = getBundleURL();

    self.moduleName = "ExampleProject"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]
    
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

    //return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

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

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }

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
}
