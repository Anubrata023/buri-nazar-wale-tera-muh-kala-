import React from 'react';

export function Card({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const hasBg = className.includes('bg-');
  const hasBorder = className.includes('border-');
  return (
    <div
      className={`rounded-2xl ${hasBorder ? '' : 'border border-zinc-200'} ${hasBg ? '' : 'bg-white'} shadow-sm transition-all ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />;
}

export function CardTitle({ className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-lg font-bold leading-none tracking-tight text-slate-800 ${className}`}
      {...props}
    />
  );
}

export function CardContent({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />;
}
