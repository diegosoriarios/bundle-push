//
//  RestartManager.swift
//  ExampleProject
//
//  Created by Diego Rios on 10/04/2025.
//

import Foundation
import React

@objc(RestartManager)
class RestartManager: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc func restartApp() {
    DispatchQueue.main.async {
      if let bridge = (UIApplication.shared.delegate as? AppDelegate)?.bridge {
        RCTTriggerReloadCommandListeners("react-native-restart: Restart");
      }
    }
  }
}
