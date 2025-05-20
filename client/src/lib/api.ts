import axios from 'axios';

const API_BASE_URL = typeof window === 'undefined' 
  ? process.env.NEXT_PUBLIC_API_URL 
  : window.location.origin + '/api';

export const apiRequest = async <T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  headers?: Record<string, string>
): Promise<T> => {
  try {
    const response = await axios({
      url: `${API_BASE_URL}${path}`,
      method,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(`API Error: ${error.response.data?.message || error.message}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Request error: ${error.message}`);
    }
  }
};
