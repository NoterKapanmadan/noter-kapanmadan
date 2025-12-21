"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scale } from "lucide-react";
import { useCompare } from "@/components/layout/CompareContext";
import { Badge } from "@/components/ui/badge";

export default function CompareBadge() {
  const { compareList } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <Link href="/compare">
      <Button variant="link" className="text-white flex items-center gap-1">
        <Scale size={20} />
        <span className="hidden md:inline">Compare</span>
        <Badge variant="secondary" className="px-1 py-0 h-5 min-w-[1.25rem] flex items-center justify-center text-xs ml-1">
            {compareList.length}
        </Badge>
      </Button>
    </Link>
  );
}
