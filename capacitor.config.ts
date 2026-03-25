import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.feng.tomatotravel',
  appName: '旅游番茄钟',
  webDir: 'dist/build/h5',
  backgroundColor: '#1A1A2E',
  server: {
    allowNavigation: [
      'unpkg.com',
      '*.basemaps.cartocdn.com',
      '*.tile.openstreetmap.org',
    ],
  },
  ios: {
    contentInset: 'always',
    allowsLinkPreview: false,
    backgroundColor: '#1A1A2E',
  },
  android: {
    backgroundColor: '#1A1A2E',
  },
};

export default config;
