import axios from 'axios';

const apiUrl =
  import.meta.env.VITE_API_URL ??
  'http://localhost:3000';

export const http = axios.create({
  baseURL: apiUrl,

  headers: {
    'Content-Type':
      'application/json',
  },
});

http.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        'accessToken',
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
);