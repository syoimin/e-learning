// lib/api-config.ts

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  users: `${API_BASE_URL}/users`,
  user: (userId: string) => `${API_BASE_URL}/users/${userId}`,
};