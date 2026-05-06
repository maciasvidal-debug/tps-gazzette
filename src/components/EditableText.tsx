import React, { useState, useEffect, useRef } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  tagName?: 'h2' | 'h3' | 'p' | 'span' | 'div';
  multiline?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  className = '',
  tagName: Tag = 'span',
  multiline = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (isEditing) {
      if (multiline && textareaRef.current) {
        textareaRef.current.focus();
        // Auto-resize
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      } else if (!multiline && inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isEditing, multiline]);

  const handleBlur = () => {
    setIsEditing(false);
    if (currentValue !== value) {
      onChange(currentValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setCurrentValue(value);
    }
  };

  const commonClasses = `w-full bg-transparent border border-dashed border-[#ED6A5E] focus:outline-none focus:border-solid focus:border-[#ED6A5E] ${className}`;

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={textareaRef}
          value={currentValue}
          onChange={(e) => {
             setCurrentValue(e.target.value);
             e.target.style.height = 'auto';
             e.target.style.height = e.target.scrollHeight + 'px';
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`${commonClasses} resize-none overflow-hidden`}
          rows={1}
        />
      );
    }
    return (
      <input
        ref={inputRef}
        type="text"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={commonClasses}
      />
    );
  }

  return (
    <Tag
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-text hover:outline hover:outline-1 hover:outline-dashed hover:outline-gray-400 transition-all`}
      title="Click to edit"
    >
      {value || (
        <span className="text-gray-400 italic">Click to enter text...</span>
      )}
    </Tag>
  );
};
