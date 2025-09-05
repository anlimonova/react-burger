import {
  connectProfileOrders,
  disconnectProfileOrders,
  onConnectingProfileOrders,
  onOpenProfileOrders,
  onCloseProfileOrders,
  onErrorProfileOrders,
  onMessageProfileOrders,
} from '../slices/profileOrdersSlice';
import { socketMiddleware } from './socket-middleware';

export const profileOrdersMiddleware = socketMiddleware({
  connect: connectProfileOrders,
  disconnect: disconnectProfileOrders,
  onConnecting: onConnectingProfileOrders,
  onOpen: onOpenProfileOrders,
  onClose: onCloseProfileOrders,
  onError: onErrorProfileOrders,
  onMessage: onMessageProfileOrders,
});
