import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// -------------------------------------------------------------------------------------------------
// MINIMALIST BLADE UI PRIMITIVES
// Extremely dense (p-4) to satisfy rigid structural limits.
// -------------------------------------------------------------------------------------------------

export interface BaseBladeProps extends React.HTMLAttributes<HTMLDivElement> {
    widthClass?: string;
    children: React.ReactNode;
}

export function BaseBlade({ children, widthClass = 'w-full md:w-[65%] 2xl:w-[70%]', className, ...props }: BaseBladeProps) {
    return (
        <div className={cn("flex flex-col h-full bg-[var(--th-panel-bg)] text-[var(--th-text-primary)] shadow-2xl border-l border-[var(--th-border)] ml-auto overflow-hidden", widthClass, className)} {...props}>
            {children}
        </div>
    );
}

export interface BladeHeaderProps {
    title: string;
    subtitle?: string;
    onClose?: () => void;
    icon?: React.ReactNode;
    children?: React.ReactNode;
}

export function BladeHeader({ title, subtitle, icon, onClose, children }: BladeHeaderProps) {
    return (
        <div className="sticky top-0 bg-[var(--th-panel-bg)]/90 backdrop-blur z-10 border-b border-[var(--th-border)] p-4 shrink-0 flex items-start justify-between">
            <div className="flex items-center gap-3">
                {icon && <div className="text-[var(--th-text-secondary)]">{icon}</div>}
                <div className="flex flex-col">
                    <h2 className="text-lg font-bold tracking-tight text-[var(--th-text-primary)] leading-tight">{title}</h2>
                    {subtitle && <p className="text-xs text-[var(--th-text-secondary)] mt-0.5">{subtitle}</p>}
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                {children}
                {onClose && (
                    <button 
                        onClick={onClose}
                        className="p-1.5 rounded-md hover:bg-[var(--th-element-bg)] text-[var(--th-text-secondary)] hover:text-[var(--th-text-primary)] transition-colors cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                )}
            </div>
        </div>
    );
}

export function BladeContent({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-4", className)}>
            {children}
        </div>
    );
}

export function BladeFooter({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex-shrink-0 bg-[var(--th-panel-bg)] border-t border-[var(--th-border)] p-4 flex items-center justify-end z-10 w-full shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
            {children}
        </div>
    );
}
