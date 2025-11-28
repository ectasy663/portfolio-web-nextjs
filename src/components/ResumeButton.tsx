'use client';

import React, { useRef } from 'react';
import { FileText, Download } from 'lucide-react';

interface ResumeButtonProps {
  variant?: 'primary' | 'secondary' | 'icon';
  className?: string;
  showIcon?: boolean;
}

const ResumeButton: React.FC<ResumeButtonProps> = ({ 
  variant = 'primary', 
  className = '',
  showIcon = true 
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/resume/naman-res-18-7.pdf';
    link.download = 'Naman_Singh_Panwar_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const btn = btnRef.current;
    if (!btn) return;
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle-burst pointer-events-none';
    btn.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
  };

  const baseClasses = "group relative transition-all duration-300 will-change-transform focus:outline-none active:scale-95";

  const variantClasses = {
    primary: "px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-neon-emerald/50 hover:scale-105 focus:ring-2 focus:ring-emerald-400/50",
    secondary: "px-8 py-4 bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-200 dark:border-white/20 text-gray-800 dark:text-white font-semibold rounded-xl hover:border-gray-300 dark:hover:border-white/40 hover:shadow-glass hover:scale-105 focus:ring-2 focus:ring-gray-300/50 dark:focus:ring-white/30",
    icon: "p-3 bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-200 dark:border-white/20 rounded-xl text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/40 hover:scale-110"
  };

  return (
    <button
      ref={btnRef}
      onClick={handleDownload}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      title="Download Resume"
    >
      {variant === 'icon' ? (
        <FileText size={24} />
      ) : (
        <span className="relative z-10 flex items-center justify-center space-x-2">
          {showIcon && <Download size={20} />}
          <span>Download Resume</span>
        </span>
      )}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-xl"></div>
      )}
    </button>
  );
};

export default ResumeButton;
