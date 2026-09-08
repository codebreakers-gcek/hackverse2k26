"use client";

import React, { useState, useEffect } from "react";
import { guidelineService } from "@/services/guidelineService";
import { GuidelineCategory } from "@/types/guideline";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { AlertTriangle, CheckCircle, ShieldCheck, Users, FileText, Code2, Scale, Award } from "lucide-react";

export function GuidelinesAccordion() {
  const [categories, setCategories] = useState<GuidelineCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const iconMap: Record<string, React.ReactNode> = {
    ShieldCheck: <ShieldCheck className="w-6 h-6 stroke-[3px]" />,
    Users: <Users className="w-6 h-6 stroke-[3px]" />,
    FileText: <FileText className="w-6 h-6 stroke-[3px]" />,
    Code2: <Code2 className="w-6 h-6 stroke-[3px]" />,
    Scale: <Scale className="w-6 h-6 stroke-[3px]" />,
    Award: <Award className="w-6 h-6 stroke-[3px]" />,
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await guidelineService.getCategories();
      setCategories(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-neutral-200 border-4 border-black animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {categories.map((category, catIdx) => (
        <div key={category.id} className="border-4 border-black bg-white shadow-neo p-6 sm:p-8">
          {/* Section Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-neo-secondary text-black border-3 border-black flex items-center justify-center shadow-neo-sm">
                {iconMap[category.icon] || <FileText className="w-6 h-6 stroke-[3px]" />}
              </div>
              <div>
                <span className="font-mono text-xs font-black uppercase text-black/60">
                  SECTION 0{catIdx + 1}
                </span>
                <h3 className="font-black text-2xl text-black uppercase tracking-tight">
                  {category.title}
                </h3>
              </div>
            </div>
            <p className="font-mono text-xs font-bold text-black/70 max-w-sm text-right hidden sm:block">
              {category.shortDescription}
            </p>
          </div>

          {/* Accordion of Rules */}
          <Accordion>
            {category.rules.map((rule, rIdx) => (
              <AccordionItem
                key={rule.id}
                id={rule.id}
                number={rule.number}
                title={rule.heading}
                defaultOpen={catIdx === 0 && rIdx === 0}
              >
                <div className="space-y-3">
                  <p className="text-sm sm:text-base font-bold text-black/85 leading-relaxed">
                    {rule.content}
                  </p>

                  {rule.importantNotes && rule.importantNotes.length > 0 && (
                    <div className="bg-amber-50 border-2 border-black p-3.5 mt-3 space-y-1">
                      <div className="font-mono text-[11px] font-black uppercase text-amber-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 stroke-[3px]" />
                        <span>IMPORTANT CLAUSE:</span>
                      </div>
                      <ul className="space-y-1 text-xs font-bold text-black/85">
                        {rule.importantNotes.map((note, nIdx) => (
                          <li key={nIdx} className="flex items-start gap-1.5">
                            <span className="text-black font-black">▸</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
}
