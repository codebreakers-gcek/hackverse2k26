import { ENV } from "@/config/env";

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  token?: string;
}

/**
 * Generic, security-conscious API client abstraction.
 * Prepared for clean integration with REST backend APIs via VITE_API_BASE_URL / NEXT_PUBLIC_API_BASE_URL.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { timeoutMs = 12000, token, headers = {}, ...restOptions } = options;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${ENV.API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: {
        ...defaultHeaders,
        ...(headers as Record<string, string>),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson?.message) {
          errorMessage = errorJson.message;
        }
      } catch {
        // Non-JSON response
      }

      return {
        data: null,
        error: errorMessage,
        status: response.status,
      };
    }

    const data: T = await response.json();
    return {
      data,
      error: null,
      status: response.status,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    let message = "Network communication error";
    if (err instanceof DOMException && err.name === "AbortError") {
      message = "Request timed out after " + timeoutMs / 1000 + "s";
    } else if (err instanceof Error) {
      message = err.message;
    }

    return {
      data: null,
      error: message,
      status: 0,
    };
  }
}
