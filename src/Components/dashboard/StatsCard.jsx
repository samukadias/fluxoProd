import React from 'react';
import { cn } from "@/lib/utils";

export default function StatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendUp,
    className,
    iconClassName
}) {
    return (
        <div className={cn(
            "bg-white rounded-2xl border border-slate-200 p-5 transition-all hover:shadow-lg hover:border-slate-300",
            className
        )}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
                    )}
                    {trend && (
                        <p className={cn(
                            "text-xs font-medium mt-2",
                            trendUp ? "text-emerald-600" : "text-red-600"
                        )}>
                            {trend}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className={cn(
                        "p-3 rounded-xl",
                        iconClassName || "bg-indigo-50"
                    )}>
                        <Icon className={cn(
                            "w-5 h-5",
                            iconClassName ? "text-white" : "text-indigo-600"
                        )} />
                    </div>
                )}
            </div>
        </div>
    );
}
