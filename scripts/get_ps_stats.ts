import { prisma } from "../lib/prisma";
import { PROBLEM_STATEMENTS_DATA } from "../data/problemStatements";

async function run() {
  try {
    const allRegistrations = await prisma.teamRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    console.log(`TOTAL_REGISTRATIONS=${allRegistrations.length}`);

    const psMap: Record<string, { code: string; title: string; category?: string; count: number; primaryCount: number; secondaryCount: number; teams: Array<{ name: string; regNo: string; status: string; isPrimary: boolean }> }> = {};

    PROBLEM_STATEMENTS_DATA.forEach((p) => {
      psMap[p.id] = {
        code: p.code,
        title: p.title,
        category: p.category,
        count: 0,
        primaryCount: 0,
        secondaryCount: 0,
        teams: [],
      };
    });

    psMap["UNSELECTED"] = {
      code: "NOT_SELECTED",
      title: "No Problem Statement Selected Yet",
      count: 0,
      primaryCount: 0,
      secondaryCount: 0,
      teams: [],
    };

    allRegistrations.forEach((r) => {
      const docs = (r.documents as any) || {};
      const ps1 = r.problemStatementId || docs.problemStatement1 || (Array.isArray(docs.selectedProblemStatements) ? docs.selectedProblemStatements[0] : null);
      const ps2 = docs.problemStatement2 || (Array.isArray(docs.selectedProblemStatements) && docs.selectedProblemStatements.length > 1 ? docs.selectedProblemStatements[1] : null);

      if (!ps1 && !ps2) {
        psMap["UNSELECTED"].count++;
        psMap["UNSELECTED"].teams.push({
          name: r.teamName,
          regNo: r.registrationNumber,
          status: r.status,
          isPrimary: false,
        });
      }

      if (ps1) {
        // Resolve either ID or code
        const targetId = Object.keys(psMap).find(
          (k) => k === ps1 || psMap[k].code.toLowerCase() === String(ps1).toLowerCase()
        ) || ps1;

        if (!psMap[targetId]) {
          psMap[targetId] = {
            code: ps1,
            title: ps1,
            count: 0,
            primaryCount: 0,
            secondaryCount: 0,
            teams: [],
          };
        }
        psMap[targetId].count++;
        psMap[targetId].primaryCount++;
        psMap[targetId].teams.push({
          name: r.teamName,
          regNo: r.registrationNumber,
          status: r.status,
          isPrimary: true,
        });
      }

      if (ps2) {
        const targetId = Object.keys(psMap).find(
          (k) => k === ps2 || psMap[k].code.toLowerCase() === String(ps2).toLowerCase()
        ) || ps2;

        if (!psMap[targetId]) {
          psMap[targetId] = {
            code: ps2,
            title: ps2,
            count: 0,
            primaryCount: 0,
            secondaryCount: 0,
            teams: [],
          };
        }
        psMap[targetId].count++;
        psMap[targetId].secondaryCount++;
      }
    });

    console.log(JSON.stringify(psMap, null, 2));
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
