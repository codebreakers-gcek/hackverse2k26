import { ENV } from "@/config/env";
import { EVENT_DATA } from "@/data/event";
import { EventInfo } from "@/types/event";
import { apiClient } from "./api";

/**
 * Event Data Service
 * Swappable between mock data and future REST API: GET /api/event
 */
export const eventService = {
  async getEventInfo(): Promise<EventInfo> {
    if (ENV.USE_MOCK_API) {
      // Simulate micro-latency for realistic UX state transitions
      await new Promise((resolve) => setTimeout(resolve, 80));
      return EVENT_DATA;
    }

    const response = await apiClient<EventInfo>("/event");
    if (response.data) {
      return response.data;
    }
    console.warn("API returned error, falling back to cached event data:", response.error);
    return EVENT_DATA;
  },
};
