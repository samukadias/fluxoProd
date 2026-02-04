import React from 'react';
import { cn } from "@/lib/utils";

export function calculatePriority(weight, complexity) {
    const complexityMultiplier = {
        'Baixa': 1,
        'Média': 2,
        'Alta': 3
    };
    return (weight || 0) * (complexityMultiplier[complexity] || 1);
}

export default function PriorityBadge({ weight, complexity }) {
    const priority = calculatePriority(weight, complexity);

    let style = "bg-slate-100 text-slate-600";
    let label = "Baixa";

    if (priority >= 9) {
        style = "bg-red-100 text-red-700";
        label = "Crítica";
    } else if (priority >= 6) {
        style = "bg-orange-100 text-orange-700";
        label = "Alta";
    } else if (priority >= 3) {
        style = "bg-amber-100 text-amber-700";
        label = "Média";
    }

    return (
        <span className={cn(
            "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full",
            style
        )}>
            {priority} - {label}
        </span>
    );
}
