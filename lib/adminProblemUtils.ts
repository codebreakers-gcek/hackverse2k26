import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";
import { ProblemStatement } from "@/types/problemStatement";
import { RegistrationRecord } from "@/types/admin";

/**
 * Resolves a problem statement object by either its ID (e.g. "ps-hw-01")
 * or its Code (e.g. "CB-HW-01") case-insensitively.
 */
export function resolveProblemStatement(idOrCode?: string | null): ProblemStatement | null {
  if (!idOrCode) return null;
  const key = String(idOrCode).trim().toLowerCase();
  return (
    PROBLEM_STATEMENTS_DATA.find(
      (p) => p.id.toLowerCase() === key || p.code.toLowerCase() === key
    ) || null
  );
}

export interface SquadProblemSelections {
  primary: ProblemStatement | null;
  secondary: ProblemStatement | null;
  hasSelection: boolean;
  selectedIds: string[];
}

/**
 * Extracts and resolves both Primary (Choice 1) and Secondary (Choice 2)
 * problem statements from a squad registration record.
 */
export function getSquadProblemStatements(
  squad: RegistrationRecord | any
): SquadProblemSelections {
  if (!squad) {
    return { primary: null, secondary: null, hasSelection: false, selectedIds: [] };
  }

  const docs = (squad.documents as Record<string, any>) || {};
  const selectedList: any[] = Array.isArray(docs.selectedProblemStatements)
    ? docs.selectedProblemStatements
    : [];

  const rawP1 = squad.problemStatementId || docs.problemStatement1 || selectedList[0] || null;
  const rawP2 =
    docs.problemStatement2 ||
    (selectedList.length > 1 ? selectedList[1] : null);

  const primary = resolveProblemStatement(rawP1);
  const secondaryResolved = resolveProblemStatement(rawP2);
  const secondary =
    secondaryResolved && (!primary || secondaryResolved.id !== primary.id)
      ? secondaryResolved
      : null;

  const selectedIds: string[] = [];
  if (primary) selectedIds.push(primary.id);
  if (secondary) selectedIds.push(secondary.id);

  return {
    primary,
    secondary,
    hasSelection: Boolean(primary || secondary),
    selectedIds,
  };
}
