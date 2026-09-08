import { ENV } from "@/config/env";
import { GUIDELINES_CATEGORIES, EVALUATION_CRITERIA_MATRIX } from "@/data/guidelines";
import { GuidelineCategory, EvaluationCriterion } from "@/types/guideline";
import { apiClient } from "./api";

/**
 * Guidelines & Evaluation Service
 * Future endpoint: GET /api/guidelines
 */
export const guidelineService = {
  async getCategories(): Promise<GuidelineCategory[]> {
    if (ENV.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      return GUIDELINES_CATEGORIES;
    }

    const response = await apiClient<GuidelineCategory[]>("/guidelines");
    return response.data || GUIDELINES_CATEGORIES;
  },

  async getEvaluationMatrix(): Promise<EvaluationCriterion[]> {
    if (ENV.USE_MOCK_API) {
      return EVALUATION_CRITERIA_MATRIX;
    }

    const response = await apiClient<EvaluationCriterion[]>("/guidelines/evaluation-matrix");
    return response.data || EVALUATION_CRITERIA_MATRIX;
  },
};
