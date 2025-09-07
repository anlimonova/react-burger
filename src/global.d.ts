import type { store } from '@/services/store';

export type WindowWithStore = Window & {
  __APP_STORE__?: typeof store;
};
