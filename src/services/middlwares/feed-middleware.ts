import {
  connectFeed,
  disconnectFeed,
  onConnectingFeed,
  onOpenFeed,
  onCloseFeed,
  onErrorFeed,
  onMessageFeed,
} from '../slices/feedSlice';
import { socketMiddleware } from './socket-middleware';

export const feedMiddleware = socketMiddleware({
  connect: connectFeed,
  disconnect: disconnectFeed,
  onConnecting: onConnectingFeed,
  onOpen: onOpenFeed,
  onClose: onCloseFeed,
  onError: onErrorFeed,
  onMessage: onMessageFeed,
});
