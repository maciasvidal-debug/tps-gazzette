import React from 'react';

export const AccordionSection: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode
}> = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="border-b border-[#2C2D35]">
      <button
        onClick={onToggle}
        className="w-full py-4 px-6 flex justify-between items-center text-[#E5E7EB] hover:bg-[#2C2D35] transition-colors"
      >
        <span className="font-sans text-xs font-bold tracking-widest uppercase">{title}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-6 bg-[#1A1A1E] space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

const inputClass = "w-full bg-[#212126] border border-[#343541] rounded text-[#E5E7EB] p-2 text-sm focus:border-[#ED6A5E] focus:outline-none focus:ring-1 focus:ring-[#ED6A5E] transition-colors placeholder-[#4B4C56]";
const labelClass = "block text-[#8B8D98] mb-1 text-xs font-bold uppercase tracking-wider font-sans";

interface FormElementProps {
  label?: string;
  containerClassName?: string;
}

export const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & FormElementProps> = ({
  label,
  containerClassName = "",
  ...props
}) => {
  return (
    <div className={containerClassName}>
      {label && <label className={labelClass}>{label}</label>}
      <input className={inputClass} {...props} />
    </div>
  );
};

export const FormTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & FormElementProps> = ({
  label,
  containerClassName = "",
  ...props
}) => {
  return (
    <div className={containerClassName}>
      {label && <label className={labelClass}>{label}</label>}
      <textarea className={inputClass} {...props} />
    </div>
  );
};

export const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & FormElementProps> = ({
  label,
  containerClassName = "",
  children,
  ...props
}) => {
  return (
    <div className={containerClassName}>
      {label && <label className={labelClass}>{label}</label>}
      <select className={inputClass} {...props}>
        {children}
      </select>
    </div>
  );
};
