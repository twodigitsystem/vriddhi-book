"use client";

import * as React from "react";
import { Info } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CustomTooltipProps {
  title: string;
  content: string;
}

export function CustomTooltip({
  title,
  content,
}: CustomTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="size-3 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent className="bg-slate-800 py-4 w-64">
          <p className="text-sm text-slate-300 font-bold mb-1">{title}</p>
          <p className="text-sm text-slate-300 tracking-normal">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
