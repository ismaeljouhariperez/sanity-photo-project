'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseImageLoaderOptions {
  priority?: boolean
  maxRetries?: number
  timeoutMs?: number
  onLoad?: () => void
  onError?: () => void
}

interface UseImageLoaderReturn {
  isLoading: boolean
  isLoaded: boolean
  hasError: boolean
  retryCount: number
  showPlaceholder: boolean
  handleLoad: () => void
  handleError: () => void
  resetLoader: () => void
}

export function useImageLoader({
  priority = false,
  maxRetries = 2,
  timeoutMs,
  onLoad,
  onError
}: UseImageLoaderOptions = {}): UseImageLoaderReturn {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Calculate timeout based on priority and retry count - less aggressive timeouts
  const getTimeoutDuration = useCallback(() => {
    if (timeoutMs) return timeoutMs
    return priority ? 3000 : 5000 + (retryCount * 1000)
  }, [priority, retryCount, timeoutMs])

  const clearImageTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
  }, [])

  const handleLoad = useCallback(() => {
    clearImageTimeout()
    setIsLoading(false)
    setShowPlaceholder(false)
    setHasError(false)
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad, clearImageTimeout])

  const handleError = useCallback(() => {
    clearImageTimeout()
    
    // Only log errors in development to reduce console noise
    if (process.env.NODE_ENV === 'development' && retryCount === maxRetries) {
      console.warn(`Image loading failed after ${maxRetries + 1} attempts`)
    }
    
    if (retryCount < maxRetries) {
      // Retry with progressive delay
      const delay = Math.min(500 * (retryCount + 1), 2000)
      setTimeout(() => {
        setRetryCount(prev => prev + 1)
        setIsLoading(true)
        setShowPlaceholder(true)
        setIsLoaded(false)
      }, delay)
    } else {
      console.error('Image loading failed after all retries')
      setHasError(true)
      setIsLoading(false)
      setShowPlaceholder(false)
      onError?.()
    }
  }, [retryCount, maxRetries, onError, clearImageTimeout])

  const resetLoader = useCallback(() => {
    clearImageTimeout()
    setRetryCount(0)
    setIsLoading(true)
    setHasError(false)
    setShowPlaceholder(true)
    setIsLoaded(false)
  }, [clearImageTimeout])

  // Set timeout for current loading attempt
  useEffect(() => {
    if (isLoading && !isLoaded && !hasError) {
      clearImageTimeout()
      
      const timeoutDuration = getTimeoutDuration()
      timeoutRef.current = setTimeout(() => {
        if (isLoading && !isLoaded && !hasError) {
          handleError()
        }
      }, timeoutDuration)
    }

    return clearImageTimeout
  }, [isLoading, isLoaded, hasError, getTimeoutDuration, handleError, clearImageTimeout])

  // Cleanup on unmount
  useEffect(() => {
    return clearImageTimeout
  }, [clearImageTimeout])

  return {
    isLoading,
    isLoaded,
    hasError,
    retryCount,
    showPlaceholder: showPlaceholder && isLoading && !isLoaded,
    handleLoad,
    handleError,
    resetLoader
  }
}