import axios from 'axios';
import { io, Socket } from 'socket.io-client';

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Khởi tạo Axios client
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Socket.IO client
let socket: Socket | null = null;
let isConnected = false;

// API Dictionary
export const DictionaryAPI = {
  getCategories: async () => {
    const response = await apiClient.get('/dictionary/categories');
    return response.data;
  },

  getItems: async (params: {
    query?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }) => {
    const response = await apiClient.get('/dictionary/search', { params });
    return response.data;
  },

  getItemById: async (itemId: number) => {
    const response = await apiClient.get(`/dictionary/item/${itemId}`);
    return response.data;
  },

  searchItems: async (keyword: string, limit = 10) => {
    const response = await apiClient.get(`/dictionary/search`, {
      params: { q: keyword, limit },
    });
    return response.data;
  },

  getRandomItem: async () => {
    const response = await apiClient.get('/dictionary/random');
    return response.data;
  },
};

// API Translation
export const TranslateAPI = {
  translateVideo: async (data: {
    video_data?: string;
    video_url?: string;
    mode?: string;
  }) => {
    const response = await apiClient.post('/translate/video', data);
    return response.data;
  },

  uploadAndTranslate: async (file: File, mode = 'word') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);

    const response = await apiClient.post('/translate/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getTranslationModes: async () => {
    const response = await apiClient.get('/translate/modes');
    return response.data;
  },
};

// Socket.IO cho dịch real-time
export const TranslateSocketAPI = {
  connect: () => {
    if (!socket) {
      try {
        socket = io(`${API_URL}`, {
          path: '/socket.io',
          transports: ['websocket', 'polling'],
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 20000,
          autoConnect: true,
          withCredentials: false,
          forceNew: true,
        });

        socket.on('connect', () => {
          console.log('Connected to WebSocket server');
          isConnected = true;
          socket?.emit('start_session', {});
        });

        socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error.message);
          // Log more details for debugging
          console.warn('Connection attempt failed, switching to HTTP fallback');
          isConnected = false;
        });

        socket.on('disconnect', () => {
          console.log('Disconnected from WebSocket server');
          isConnected = false;
        });

        socket.on('error', (error) => {
          console.error('Socket error:', error);
        });

        socket.on('connection_success', (data) => {
          console.log('Connection success:', data);
        });
      } catch (e) {
        console.error('Failed to initialize Socket.IO:', e);
        isConnected = false;
      }
    }

    return socket;
  },

  disconnect: () => {
    if (socket) {
      try {
        if (isConnected) {
          socket.emit('end_session', {});
        }
        socket.disconnect();
      } catch (e) {
        console.error('Error disconnecting socket:', e);
      } finally {
        socket = null;
        isConnected = false;
      }
    }
  },

  isConnected: () => isConnected,

  // Updated to support HTTP fallback
  sendFrame: async (frame: string, timestamp: number, mode: string) => {
    if (socket && isConnected) {
      // Use WebSocket if connected
      socket.emit('video_frame', { frame, timestamp, mode });
    } else {
      // Fall back to HTTP if WebSocket not connected
      try {
        // Add 'data:image/jpeg;base64,' prefix back for HTTP API
        const videoData = `data:image/jpeg;base64,${frame}`;
        const result = await TranslateAPI.translateVideo({
          video_data: videoData,
          mode: mode,
        });

        // Manually emit a translation result event with the HTTP response
        if (result && result.results && result.results.length > 0) {
          const response = {
            text: result.results[0].text,
            confidence: result.results[0].confidence,
            timestamp: timestamp,
          };

          // Call any registered handlers
          if (socket) {
            socket.emit('translation_result', response);
          }
        }
      } catch (error) {
        console.error('HTTP fallback error:', error);
        if (socket) {
          socket.emit('error', { message: 'HTTP fallback error' });
        }
      }
    }
  },

  onTranslationResult: (callback: (result: any) => void) => {
    if (socket) {
      socket.on('translation_result', callback);
    }
  },

  offTranslationResult: (callback: (result: any) => void) => {
    if (socket) {
      socket.off('translation_result', callback);
    }
  },

  onError: (callback: (error: any) => void) => {
    if (socket) {
      socket.on('error', callback);
      socket.on('connect_error', (error) => {
        callback({ message: `Connection error: ${error.message}` });
      });
    }
  },

  offError: (callback: (error: any) => void) => {
    if (socket) {
      socket.off('error', callback);
      socket.off('connect_error', (e) => callback({ message: e.message }));
    }
  },
};

export default {
  Dictionary: DictionaryAPI,
  Translate: TranslateAPI,
  TranslateSocket: TranslateSocketAPI,
};
