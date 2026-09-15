/**
 * API Service for SM Data Delivery & VTU Backend
 * Base URL: https://api.smdata.com.ng/api
 */

export const API_BASE_URL = 'https://api.smdata.com.ng/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  PROFILE: {
    GET: '/user/profile',
    UPDATE: '/profile/update',
    SHIPPING: '/profile/shipping',
  },
  WALLET: {
    BALANCE: '/wallet/',
    HISTORY: '/wallet/',
  },
  TRANSACTIONS: {
    PRICES: '/transactions/prices',
    HISTORY: '/transactions/history/',
  },
  NOTIFICATIONS: {
    GET: '/notifications/',
  },
};

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const text = await response.text();
      let data: any;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { raw: text };
      }

      if (!response.ok) {
        return {
          success: false,
          error: data?.message || `HTTP ${response.status}`,
          data,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Network error',
      };
    }
  }

  async checkHealth(): Promise<{ isOnline: boolean; statusText: string }> {
    try {
      const res = await this.request(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ ping: true }),
      });
      return {
        isOnline: true,
        statusText: res.error || 'Connected',
      };
    } catch {
      return {
        isOnline: false,
        statusText: 'Offline',
      };
    }
  }

  async login(email: string, password: string) {
    return this.request(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getPrices() {
    return this.request(API_ENDPOINTS.TRANSACTIONS.PRICES);
  }

  async getShippingHistory() {
    return this.request(API_ENDPOINTS.PROFILE.SHIPPING);
  }

  async getWalletBalance() {
    return this.request(API_ENDPOINTS.WALLET.BALANCE);
  }
}

export const api = new ApiClient();
