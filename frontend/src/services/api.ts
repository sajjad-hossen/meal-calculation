// import axios from 'axios';

// // Vercel ড্যাশবোর্ড থেকে Render-এর লিংকটি নেবে, আর লোকালহোস্টে থাকলে ডিফল্ট লিংকটি নেবে
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7082';

// const api = axios.create({
//   baseURL: API_BASE_URL,
// });
import axios from 'axios';
import toast from 'react-hot-toast';

// কোনো ভ্যারিয়েবল ছাড়া সরাসরি আপনার লাইভ রেন্ডার ব্যাকএন্ডের ইউআরএল বসিয়ে দিন
export const API_BASE_URL = 'https://meal-calculation-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const rToken = localStorage.getItem('refreshToken');
        if (!rToken) throw new Error("No refresh token");

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken: rToken
        });

        const { accessToken, refreshToken, user } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 402) {
      toast.error("Payment Required: " + (error.response?.data?.message || "Your mess has not paid for the current month. Operations are restricted."));
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.response?.data && typeof error.response.data === 'string') {
      toast.error(error.response.data);
    } else if (error.message && error.response?.status !== 401) {
      toast.error(error.message);
    }

    return Promise.reject(error);
  }
);

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const method = options?.method || 'GET';
  const data = options?.body ? JSON.parse(options.body as string) : undefined;
  
  try {
    const response = await api.request<T>({
      url,
      method,
      data,
      headers: options?.headers as any
    });
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message || 'API Error');
  }
}

export default api;
