/*
* @flow
*/
import axios from "axios";
import axiosRetry from "axios-retry";
import isRetryAllowed from 'is-retry-allowed';


const isRetryableError = (error): boolean => {
  console.error(`isRetryableError: ${error.code}`)
  return (
    // !error.response &&
    Boolean(error.code) && // Prevents retrying cancelled requests
    error.code !== 'ECONNABORTED' && // Prevents retrying timed out requests
    isRetryAllowed(error)
  )
}

export const createHttpClient = (): axios => {
  const result = axios.create()
  // Exponential back-off retry delay between requests
  axiosRetry(result, {
    retries: 10,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: isRetryableError,
    onRetry: (retryCount, error, requestConfig) => {
      console.warn(`[SlideLoader] fetching slides failed for the ${retryCount}nd time: ${error}`)
    }
  });

  return result
}
