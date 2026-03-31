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

export type BladeSize = 'menu' | 'small' | 'medium' | 'large' | 'xlarge' | 'full' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'custom';

const bladeSizeMaxWidths: Record<BladeSize, string> = {
  menu: 'var(--sdui-blade-w-menu, 265px)',
  small: 'var(--sdui-blade-w-small, 315px)',
  medium: 'var(--sdui-blade-w-medium, 585px)',
  large: 'var(--sdui-blade-w-large, 855px)',
  xlarge: 'var(--sdui-blade-w-xlarge, 1125px)',
  xl: 'var(--sdui-blade-w-xl, 1125px)',
  '2xl': 'var(--sdui-blade-w-2xl, 1395px)',
  '3xl': 'var(--sdui-blade-w-3xl, 1665px)',
  '4xl': 'var(--sdui-blade-w-4xl, 1935px)',
  '5xl': 'var(--sdui-blade-w-5xl, 2205px)',
  '6xl': 'var(--sdui-blade-w-6xl, 2475px)',
  '7xl': 'var(--sdui-blade-w-7xl, 2745px)',
  custom: 'var(--sdui-blade-custom-w, 100%)',
  full: 'none',
};

export interface BaseBladeProps extends React.HTMLAttributes<HTMLDivElement> {
  widthClass?: string;
  size?: BladeSize;
  children: React.ReactNode;
}

export function BaseBlade({ children, widthClass, size = 'large', className, style, ...props }: BaseBladeProps) {
  // If legacy widthClass is provided, use it. Otherwise, use strict Aztec size constraints.
  const isFull = size === 'full';
  
  // We use inline styles for width constraints to bypass Tailwind JIT compiler omissions in consumer repos
  const resolvedStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: widthClass ? undefined : bladeSizeMaxWidths[size] || bladeSizeMaxWidths['large'],
    flex: isFull ? '1 1 0%' : undefined,
    ...style,
  };

  return (
    <div
      className={cn(
        'sdui-base-blade-container flex flex-col h-full bg-[var(--th-panel-bg)] text-[var(--th-text-primary)] shadow-2xl border-l border-[var(--th-border)] ml-auto overflow-hidden shrink-0',
        widthClass,
        className,
      )}
      style={resolvedStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export interface BladeHeaderProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  icon?: React.ReactNode;
  commands?: React.ReactNode;
  children?: React.ReactNode;
}

export function BladeHeader({ title, subtitle, icon, commands, onClose, children }: BladeHeaderProps) {
  return (
    <div className="sdui-blade-header sticky top-0 bg-[var(--th-panel-bg)]/90 backdrop-blur z-10 border-b border-[var(--th-border)] min-h-16 px-5 shrink-0 flex items-center justify-between">
      <div className="sdui-blade-title flex items-center gap-3">
        {icon && <div className="sdui-blade-icon text-[var(--th-text-secondary)]">{icon}</div>}
        <div className="sdui-blade-title-text-group flex flex-col">
          <h2 className="sdui-blade-title-text text-lg font-bold tracking-tight text-[var(--th-text-primary)] leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="sdui-blade-subtitle-text text-xs text-[var(--th-text-secondary)] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="sdui-blade-actions flex items-center gap-3">
        {commands && (
          <div className="sdui-blade-commands flex items-center gap-2 border-r border-[var(--th-border)] pr-3 mr-1">
            {commands}
          </div>
        )}

        {children}

        {onClose && (
          <button
            onClick={onClose}
            className="sdui-blade-close p-1.5 rounded-md hover:bg-[var(--th-element-bg)] text-[var(--th-text-secondary)] hover:text-[var(--th-text-primary)] transition-colors cursor-pointer"
            aria-label="Close Blade"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export function BladeContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex-1 overflow-y-auto no-scrollbar pt-2.5 px-5 pb-5 flex flex-col gap-4', className)}>
      {children}
    </div>
  );
}

export function BladeFooter({ children }: { children?: React.ReactNode }) {
  if (!children) return null;

  return (
    <div className="flex-shrink-0 bg-[var(--th-panel-bg)] border-t border-[var(--th-border)] px-5 py-4 flex items-center justify-end z-10 w-full shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
      {children}
    </div>
  );
}

// -------------------------------------------------------------------------------------------------
// SDUI SUB-COMPONENT ARSENAL (AZURE-STYLE)
// -------------------------------------------------------------------------------------------------

export function BladeLoadingOverlay({ isLoading, text }: { isLoading: boolean; text?: string }) {
  if (!isLoading) return null;
  return (
    <div className="sdui-blade-loading absolute inset-0 z-50 bg-[var(--th-panel-bg)]/60 backdrop-blur-sm flex flex-col items-center justify-center">
      <svg
        className="animate-spin h-8 w-8 text-[var(--th-text-primary)] mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {text && (
        <span className="sdui-blade-loading-text text-sm font-medium text-[var(--th-text-primary)]">{text}</span>
      )}
    </div>
  );
}

export interface BladeAlertProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: string | React.ReactNode;
}

export function BladeAlert({ type = 'info', title, message }: BladeAlertProps) {
  const bgClasses = {
    error: 'bg-red-500/10 border-red-500/20 text-red-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  };

  return (
    <div className={cn('sdui-blade-alert flex items-start p-3 mb-4 rounded-md border', bgClasses[type])}>
      <div className="flex flex-col">
        {title && <h4 className="font-semibold text-sm mb-0.5">{title}</h4>}
        <div className="text-sm opacity-90">{message}</div>
      </div>
    </div>
  );
}

export interface BladePivotProps {
  tabs: { id: string; label: string }[];
  activeId: string;
  onChange: (id: string) => void;
}

export function BladePivot({ tabs, activeId, onChange }: BladePivotProps) {
  return (
    <div className="sdui-blade-pivot flex items-center border-b border-[var(--th-border)] mb-4 w-full overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer',
              isActive
                ? 'border-[var(--th-text-primary)] text-[var(--th-text-primary)]'
                : 'border-transparent text-[var(--th-text-secondary)] hover:text-[var(--th-text-primary)] hover:border-[var(--th-text-secondary)]',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export interface BladePropertiesGridProps {
  properties: { label: string; value: React.ReactNode }[];
}

export function BladePropertiesGrid({ properties }: BladePropertiesGridProps) {
  return (
    <dl className="sdui-blade-summary grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
      {properties.map((prop, idx) => (
        <div key={idx} className="flex flex-col gap-1">
          <dt className="text-xs text-[var(--th-text-secondary)] tracking-tight uppercase font-medium">{prop.label}</dt>
          <dd className="text-sm text-[var(--th-text-primary)]">{prop.value}</dd>
        </div>
      ))}
    </dl>
  );
}
