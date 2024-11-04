import { getHeaders } from '@/lib/utils/GetHeaders';
import { useState, useCallback } from 'react';

interface LogoutResult {
  status: number;
  status_message: string;
}

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async (): Promise<LogoutResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify({})
      });
      const data = await response.json();

      return data;
    } catch (err) {
      setError('An error occurred during logout');
      return { status: 500, status_message: 'An error occurred during logout' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { logout, isLoading, error };
}