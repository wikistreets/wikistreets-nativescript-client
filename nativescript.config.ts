import { NativeScriptConfig } from "@nativescript/core";

export default {
  id: "io.wikistreets.sveltenativescriptclient",
  appPath: "app",
  appResourcesPath: "App_Resources",
  android: {
    v8Flags: "--expose_gc",
    markingMode: "none",
    // discardUncaughtJsExceptions: true, // prevent throwing javascript errors to the native side
  },
  ios: {
    // discardUncaughtJsExceptions: true, // prevent throwing javascript errors to the native side
  },
} as NativeScriptConfig;
