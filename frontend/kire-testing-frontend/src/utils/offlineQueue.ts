import { v4 as uuidv4 } from 'uuid';
import { saveToStorage, getFromStorage, removeFromStorage, getStorageKeysByPrefix } from './storageUtils';
import { useConnection } from '../contexts/ConnectionContext';

// Storage key prefixes
const QUEUE_PREFIX = 'kire_queue_';

// Types for our queuing system
interface QueueItem {
  id: string;
  url: string;
  method: string;
  data: any;
  headers: Record<string, string>;
  timestamp: number;
  retries: number;
}

/**
 * Queue a request for later processing when offline
 * @param url API endpoint
 * @param method HTTP method
 * @param data Request data
 * @param headers Request headers
 * @returns The queue item ID
 */
export const queueRequest = (
  url: string, 
  method: string, 
  data: any, 
  headers: Record<string, string> = {}
): string => {
  const id = uuidv4();
  const queueItem: QueueItem = {
    id,
    url,
    method,
    data,
    headers,
    timestamp: Date.now(),
    retries: 0
  };
  
  saveToStorage(`${QUEUE_PREFIX}${id}`, queueItem);
  
  return id;
};

/**
 * Get all queued requests
 * @returns Array of queued request items
 */
export const getQueuedRequests = (): QueueItem[] => {
  const keys = getStorageKeysByPrefix(QUEUE_PREFIX);
  
  return keys
    .map(key => getFromStorage<QueueItem>(key))
    .filter((item): item is QueueItem => item !== null)
    .sort((a, b) => a.timestamp - b.timestamp);
};

/**
 * Remove a request from the queue
 * @param id Request ID
 */
export const removeFromQueue = (id: string): void => {
  removeFromStorage(`${QUEUE_PREFIX}${id}`);
};

/**
 * Increment the retry count for a queued request
 * @param id Request ID
 */
export const incrementRetryCount = (id: string): void => {
  const item = getFromStorage<QueueItem>(`${QUEUE_PREFIX}${id}`);
  if (item) {
    saveToStorage(`${QUEUE_PREFIX}${id}`, {
      ...item,
      retries: item.retries + 1
    });
  }
};

/**
 * Process all queued requests when back online
 * @param apiClient The API client to use for requests
 * @returns Promise that resolves when all requests are processed
 */
export const processQueue = async (apiClient: any): Promise<void> => {
  const items = getQueuedRequests();
  
  for (const item of items) {
    try {
      await apiClient({
        url: item.url,
        method: item.method,
        data: item.data,
        headers: item.headers
      });
      
      // If successful, remove from queue
      removeFromQueue(item.id);
    } catch (error) {
      console.error(`Failed to process queued request ${item.id}:`, error);
      
      // Increment retry count
      incrementRetryCount(item.id);
      
      // If too many retries, remove from queue
      if (item.retries >= 5) {
        console.warn(`Request ${item.id} failed too many times, removing from queue`);
        removeFromQueue(item.id);
      }
    }
  }
};

/**
 * React hook for offline form submission
 */
export const useOfflineForm = () => {
  const { isOnline, isServerConnected } = useConnection();

  const submitForm = async (
    apiFunction: (data: any) => Promise<any>,
    data: any,
    onSuccess: (result: any) => void,
    onError: (error: any) => void
  ) => {
    // If online and server is connected, submit normally
    if (isOnline && isServerConnected !== false) {
      try {
        const result = await apiFunction(data);
        onSuccess(result);
      } catch (error) {
        onError(error);
      }
    } else {
      // Queue the request for later
      // We would need more details to queue the actual API call,
      // but for now we'll just simulate the process
      const queueId = queueRequest('/api/form', 'POST', data, {});
      
      // Notify the user that the form was queued
      onSuccess({
        queued: true,
        queueId,
        message: 'Your submission has been queued and will be sent when you are back online.'
      });
    }
  };

  return {
    submitForm,
    isOffline: !isOnline || isServerConnected === false,
    queuedItems: getQueuedRequests().length
  };
};
