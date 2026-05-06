import React, { useState } from 'react';

interface Props {
  onClick: () => Promise<void>;
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const AICopilotButton: React.FC<Props> = ({ onClick, label, icon, variant = 'secondary', className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  const baseClass = "text-xs font-bold py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[#ED6A5E] hover:bg-[#F2555A] text-white",
    secondary: "bg-[#343541] hover:bg-[#4B4C56] text-[#E5E7EB] border border-[#4B4C56]"
  };

  const defaultIcon = (
    <svg className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {isLoading ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      )}
    </svg>
  );

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${baseClass} ${variants[variant]} ${className}`}
      title="AI Copilot Action"
    >
      {icon || defaultIcon}
      {isLoading ? 'Processing...' : label}
    </button>
  );
};
