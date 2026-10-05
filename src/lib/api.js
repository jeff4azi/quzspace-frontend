import axios from "axios";
import { getCurrentSession, signOut } from "./supabaseClient";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

api.interceptors.request.use(async (config) => {
  const session = await getCurrentSession();
  const token = session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.idempotencyKey) {
    config.headers["Idempotency-Key"] = config.idempotencyKey;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === "object" && "data" in body) {
      return body.data;
    }
    return body;
  },
  async (err) => {
    const status = err.response?.status;
    const body = err.response?.data;
    const errorPayload = body?.error;

    if (status === 401) {
      try {
        await signOut();
      } catch {
        /* ignore */
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("quzspace:pending-email");
        window.location.href = "/login?expired=1";
      }
    }

    if (errorPayload) {
      const e = new Error(errorPayload.message || "Request failed");
      e.code = errorPayload.code || `HTTP_${status}`;
      e.details = errorPayload.details || null;
      e.status = status;
      return Promise.reject(e);
    }

    return Promise.reject(err);
  },
);

export class ApiError extends Error {
  constructor(payload) {
    super(payload?.message || "API error");
    this.code = payload?.code;
    this.details = payload?.details || null;
    this.status = payload?.status;
  }
}

export async function fetchWithIdempotency(url, data = {}, config = {}) {
  const key = config.idempotencyKey || crypto.randomUUID();
  return api.post(url, data, { ...config, idempotencyKey: key });
}

export async function getSpaceTopics(spaceId) {
  return api.get(`/spaces/${spaceId}/topics`);
}

export default api;
