import { verifyToken } from '@utils/verifyToken.ts';

import type {
  Middleware,
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from '@reduxjs/toolkit';

export type TWsActions<R, S> = {
  connect: ActionCreatorWithPayload<string>;
  disconnect: ActionCreatorWithoutPayload;
  onConnecting?: ActionCreatorWithoutPayload;
  onOpen?: ActionCreatorWithoutPayload;
  onClose?: ActionCreatorWithoutPayload;
  onError: ActionCreatorWithPayload<string>;
  sendMessage?: ActionCreatorWithPayload<S>;
  onMessage: ActionCreatorWithPayload<R>;
};

const RECONNECT_PERIOD = 3000;

export const socketMiddleware = <R, S>(
  wsActions: TWsActions<R, S>,
  withTokenRefresh = false
): Middleware<object, unknown> => {
  return (store) => {
    let socket: WebSocket | null = null;
    const {
      connect,
      sendMessage,
      onOpen,
      onClose,
      onError,
      onMessage,
      onConnecting,
      disconnect,
    } = wsActions;
    const { dispatch } = store;
    let isConnected = false;
    let url = '';
    let reconnectId = 0;

    return (next) => (action) => {
      if (connect.match(action)) {
        if (socket && isConnected) {
          return;
        }

        socket = new WebSocket(action.payload);
        url = action.payload;
        isConnected = true;
        onConnecting && dispatch(onConnecting());

        socket.onopen = (): void => {
          onOpen && dispatch(onOpen());
        };

        socket.onerror = (): void => {
          dispatch(onError('Ошибка WebSocket'));
        };

        socket.onclose = (): void => {
          onClose && dispatch(onClose());

          if (isConnected) {
            reconnectId = window.setTimeout(() => {
              dispatch(connect(url));
            }, RECONNECT_PERIOD);
          }
        };

        socket.onmessage = async (event: MessageEvent<string>): Promise<void> => {
          const { data } = event;
          try {
            const parsedData: unknown = JSON.parse(data);

            // Проверка на протухший токен
            if (
              withTokenRefresh &&
              typeof parsedData === 'object' &&
              parsedData !== null &&
              'message' in parsedData &&
              (parsedData as { message: string }).message === 'Invalid or missing token'
            ) {
              try {
                const accessToken = localStorage.getItem('accessToken') ?? '';
                const refreshToken = localStorage.getItem('refreshToken') ?? '';

                const result = await verifyToken(accessToken, refreshToken);

                if (result?.accessToken) {
                  const wssUrl = new URL(url);
                  wssUrl.searchParams.set(
                    'token',
                    result.accessToken.replace('Bearer ', '')
                  );

                  dispatch(disconnect());
                  dispatch(connect(wssUrl.toString()));
                } else {
                  dispatch(onError('Не удалось обновить токен'));
                  dispatch(disconnect());
                }
              } catch (err) {
                dispatch(onError((err as Error).message));
                dispatch(disconnect());
              }
              return;
            }

            dispatch(onMessage(parsedData as R));
          } catch (error) {
            dispatch(onError((error as Error).message));
          }
        };

        return;
      }

      if (sendMessage?.match(action) && socket) {
        try {
          socket.send(JSON.stringify(action.payload));
        } catch (error) {
          dispatch(onError((error as Error).message));
        }
        return;
      }

      if (disconnect.match(action)) {
        clearTimeout(reconnectId);
        reconnectId = 0;
        isConnected = false;
        socket?.close();
        socket = null;
        return;
      }

      next(action);
    };
  };
};
