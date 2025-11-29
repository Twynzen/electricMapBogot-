import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.electricmap.bogota',
  appName: 'ElectricMap Bogotá',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Geolocation: {
      // Request precise location for better station finding
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1a73e8'
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true
    }
  },
  android: {
    allowMixedContent: true,
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined
    }
  }
};

export default config;
