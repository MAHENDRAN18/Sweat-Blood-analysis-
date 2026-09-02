import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  icon: Icon,
  actions
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[#E5DDCE] mb-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3.5">
          {Icon && (
            <div className="p-3 rounded-2xl bg-[#FAF7F0] text-[#1B2430] border border-[#E5DDCE] shadow-2xs">
              <Icon className="w-6 h-6 text-[#8C3B3B]" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1B2430] font-serif-heading">
                {title}
              </h1>
              {badge && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#EAE2D5] text-[#1B2430] border border-[#DDD1BE] font-mono-tabular">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#5A6577] max-w-3xl mt-1 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};
