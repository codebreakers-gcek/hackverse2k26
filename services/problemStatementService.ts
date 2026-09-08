import { ENV } from "@/config/env";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";
import { ProblemStatement, ProblemCategory, ProblemFilterOptions } from "@/types/problemStatement";
import { apiClient } from "./api";

/**
 * Problem Statements Service
 * Prepares the frontend for future backend: GET /api/problem-statements
 */
export const problemStatementService = {
  async getAll(options?: ProblemFilterOptions): Promise<ProblemStatement[]> {
    let list: ProblemStatement[];

    if (ENV.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      list = [...PROBLEM_STATEMENTS_DATA];
    } else {
      const response = await apiClient<ProblemStatement[]>("/problem-statements");
      list = response.data || PROBLEM_STATEMENTS_DATA;
    }

    // Apply filtering logic
    if (options) {
      const { category, searchQuery, difficulty } = options;

      if (category && category !== "All") {
        list = list.filter((p) => p.category === category);
      }

      if (difficulty && difficulty !== "All") {
        list = list.filter((p) => p.difficulty === difficulty);
      }

      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.domain.toLowerCase().includes(query) ||
            p.shortDescription.toLowerCase().includes(query) ||
            p.code.toLowerCase().includes(query) ||
            p.suggestedStack.some((tech) => tech.toLowerCase().includes(query))
        );
      }
    }

    return list;
  },

  async getById(id: string): Promise<ProblemStatement | null> {
    if (ENV.USE_MOCK_API) {
      const found = PROBLEM_STATEMENTS_DATA.find((p) => p.id === id || p.code.toLowerCase() === id.toLowerCase());
      return found || null;
    }

    const response = await apiClient<ProblemStatement>(`/problem-statements/${id}`);
    return response.data || null;
  },

  getCategories(): ProblemCategory[] {
    return ["All", "AI / ML", "Web Development", "Cybersecurity", "IoT", "Open Innovation"];
  },
};
