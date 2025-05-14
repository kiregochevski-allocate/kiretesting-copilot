import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import config from '../config';

/**
 * Retry a function with exponential backoff
 * @param fn Function to retry
 * @param retriesLeft Number of retries left
 * @param interval Initial interval between retries in ms
 * @param exponential Whether to use exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retriesLeft = config.maxRetries,
  interval = 1000,
  exponential = true
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retriesLeft === 0) {
      throw error;
    }

    console.log(`Retrying after ${interval}ms, ${retriesLeft} retries left`);
    
    // Wait for the specified interval
    await new Promise(resolve => setTimeout(resolve, interval));
    
    // Increase the interval for the next attempt if using exponential backoff
    const nextInterval = exponential ? interval * 2 : interval;
    
    // Retry again with one less retry attempt and increased interval
    return retry(fn, retriesLeft - 1, nextInterval, exponential);
  }
}

/**
 * Makes an API request with automatic retries for network failures
 * @param requestFn The API request function
 */
export async function apiRequestWithRetry<T>(
  requestFn: () => Promise<AxiosResponse<T>>
): Promise<T> {
  if (!config.enableRetries) {
    // If retries are disabled, just make the request
    const response = await requestFn();
    return response.data;
  }

  try {
    // Try the request with retries
    const response = await retry(() => requestFn());
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      // Check if it's a network error
      if (!axiosError.response) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      
      // Handle specific HTTP errors
      if (axiosError.response?.status === 404) {
        throw new Error('The requested resource was not found.');
      } else if (axiosError.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
    }
    
    // Re-throw any other error
    throw error;
  }
}
