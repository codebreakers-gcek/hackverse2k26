"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminAccommodationPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/squads");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 font-sans text-white p-6">
      <div className="p-4 border-2 border-amber-400 bg-amber-400/10 text-amber-400 font-mono text-sm font-black uppercase">
        Accommodation module has been removed
      </div>
      <p className="text-neutral-400 font-mono text-xs max-w-md">
        Hostel accommodation is no longer required for this tournament edition.
        Redirecting you to the Squads & Rosters directory...
      </p>
      <Link
        href="/admin/squads"
        className="px-4 py-2 border-2 border-amber-400 bg-amber-400 text-black font-mono text-xs font-black uppercase flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000]"
      >
        <Users className="w-4 h-4" />
        <span>GO TO SQUADS &amp; ROSTERS</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
