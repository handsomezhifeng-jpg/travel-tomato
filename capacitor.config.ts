import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.feng.tomatotravel',
  appName: '旅游番茄钟',
  webDir: 'dist/build/h5',
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
  },
};

export default config;
