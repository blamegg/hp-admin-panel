import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  reRenderCount: number;
  lastRenderTime: number;
}

export const usePerformance = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());
  const lastRenderTime = useRef(0);

  const logPerformance = useCallback(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    lastRenderTime.current = renderTime;
    renderCount.current++;

    // Log slow renders (over 16ms = 60fps threshold)
    if (renderTime > 16) {
      console.warn(`🚨 Slow render detected in ${componentName}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        renderCount: renderCount.current,
        timestamp: new Date().toISOString()
      });
    }

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${componentName} performance:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        renderCount: renderCount.current,
        timestamp: new Date().toISOString()
      });
    }

    startTime.current = performance.now();
  }, [componentName]);

  useEffect(() => {
    logPerformance();
  });

  return {
    renderCount: renderCount.current,
    lastRenderTime: lastRenderTime.current,
    logPerformance
  };
};

// Hook for measuring API call performance
export const useAPIPerformance = () => {
  const measureAPI = useCallback(async <T>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Log slow API calls (over 1 second)
      if (duration > 1000) {
        console.warn(`🐌 Slow API call detected:`, {
          endpoint,
          duration: `${duration.toFixed(2)}ms`,
          timestamp: new Date().toISOString()
        });
      }

      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.error(`❌ API call failed:`, {
        endpoint,
        duration: `${duration.toFixed(2)}ms`,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  }, []);

  return { measureAPI };
}; 