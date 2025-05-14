// This file registers the service worker for offline capabilities

// Check if service workers are supported
const isServiceWorkerSupported = 'serviceWorker' in navigator;

// Service worker registration options
const SW_OPTIONS = {
  scope: '/'
};

/**
 * Register the service worker
 * @returns Promise that resolves when registration is successful
 */
export const registerServiceWorker = async () => {
  if (!isServiceWorkerSupported) {
    console.warn('Service workers are not supported in this browser.');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', SW_OPTIONS);
    console.log('Service worker registered successfully:', registration.scope);
    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return null;
  }
};

/**
 * Unregister all service workers
 * @returns Promise that resolves when unregistration is complete
 */
export const unregisterServiceWorkers = async () => {
  if (!isServiceWorkerSupported) return;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
      console.log('Service worker unregistered successfully');
    }
  } catch (error) {
    console.error('Service worker unregistration failed:', error);
  }
};

/**
 * Send a message to the active service worker
 * @param message Message to send to the service worker
 * @returns Promise that resolves when the message is sent
 */
export const sendMessageToServiceWorker = async (message: any) => {
  if (!isServiceWorkerSupported) return;

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration || !registration.active) {
    console.warn('No active service worker found');
    return;
  }

  registration.active.postMessage(message);
};

/**
 * Check if the app is running in offline mode through service worker
 * @returns Promise that resolves with offline status
 */
export const checkOfflineStatus = async (): Promise<boolean> => {
  if (!isServiceWorkerSupported) return !navigator.onLine;

  try {
    const cache = await caches.open('kire-runtime-cache');
    const cachedResponse = await cache.match('/offline-status');
    
    if (cachedResponse) {
      const data = await cachedResponse.json();
      return data.isOffline;
    }
    
    return !navigator.onLine;
  } catch (error) {
    console.error('Error checking offline status:', error);
    return !navigator.onLine;
  }
};

// Register the service worker immediately when this module is imported
if (import.meta.env.PROD) {
  // Only register in production to avoid development issues
  registerServiceWorker();
}
