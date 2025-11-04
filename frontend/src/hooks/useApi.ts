import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useApi = <T>(url: string, options = {}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(url, options);
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export const usePostApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postData = async (url: string, data: any, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(url, data, options);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error };
};
