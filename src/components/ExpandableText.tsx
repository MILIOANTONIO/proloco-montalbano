"use client";

import { useState } from "react";
import { ChevronLeftIcon } from "./icons";

export default function ExpandableText({
  text,
  collapsedLines = 5,
  readMoreLabel = "Leggi tutto",
  readLessLabel = "Mostra meno",
}: {
  text: string;
  collapsedLines?: number;
  readMoreLabel?: string;
  readLessLabel?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p
        className="whitespace-pre-line text-[17px] leading-relaxed text-brand-900/90"
        style={
          expanded
            ? undefined
            : {
                display: "-webkit-box",
                WebkitLineClamp: collapsedLines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
        }
      >
        {text}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-900"
      >
        {expanded ? readLessLabel : readMoreLabel}
        <ChevronLeftIcon className={`h-4 w-4 transition-transform ${expanded ? "rotate-90" : "-rotate-90"}`} />
      </button>
    </div>
  );
}
