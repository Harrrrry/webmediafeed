import { useState, useCallback } from 'react';

export const useErrorHandling = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleError = useCallback((error: Error | string) => {
    const message = error instanceof Error ? error.message : error;
    setError(message);
    setSuccess(null);
  }, []);

  const handleSuccess = useCallback((message: string) => {
    setSuccess(message);
    setError(null);
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    successMessage?: string
  ): Promise<T | null> => {
    try {
      clearMessages();
      const result = await operation();
      if (successMessage) {
        handleSuccess(successMessage);
      }
      return result;
    } catch (err: any) {
      handleError(err.message || 'Operation failed');
      return null;
    }
  }, [clearMessages, handleError, handleSuccess]);

  return {
    error,
    success,
    handleError,
    handleSuccess,
    clearMessages,
    executeWithErrorHandling,
  };
}; 