import React, { useState, useEffect, useRef } from 'react';
import { FloatingToolbar } from './editor/FloatingToolbar';

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

  if (!isEditing && currentValue !== value) {
    setCurrentValue(value);
  }

  useEffect(() => {
    if (isEditing) {
      if (multiline && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      } else if (!multiline && inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isEditing, multiline]);

  const handleBlur = () => {
    // Delay blur slightly to allow toolbar button clicks to process
    setTimeout(() => {
      setIsEditing(false);
      if (currentValue !== value) {
        onChange(currentValue);
      }
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      setIsEditing(false);
      onChange(currentValue);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setCurrentValue(value);
    }
  };

  const handleInsertFormat = (formattedText: string, cursorOffset: number) => {
     const ref = multiline ? textareaRef : inputRef;
     const el = ref.current;
     if (!el) return;

     const start = el.selectionStart || 0;
     const end = el.selectionEnd || 0;

     const newValue = currentValue.substring(0, start) + formattedText + currentValue.substring(end);
     setCurrentValue(newValue);

     // Set cursor after the newly formatted block
     setTimeout(() => {
        el.focus();
        el.setSelectionRange(cursorOffset, cursorOffset);
     }, 0);
  };

  const commonClasses = `w-full bg-transparent border border-dashed border-[#ED6A5E] focus:outline-none focus:border-solid focus:border-[#ED6A5E] ${className}`;

  if (isEditing) {
    if (multiline) {
      return (
        <>
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
          <FloatingToolbar textareaRef={textareaRef} onInsertFormat={handleInsertFormat} />
        </>
      );
    }
    return (
      <>
        <input
          ref={inputRef}
          type="text"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={commonClasses}
        />
        <FloatingToolbar textareaRef={inputRef} onInsertFormat={handleInsertFormat} />
      </>
    );
  }

  return (
    <Tag
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-text hover:outline hover:outline-1 hover:outline-dashed hover:outline-gray-400 transition-all`}
      title="Click to edit"
      dangerouslySetInnerHTML={Tag === 'span' || Tag === 'div' ? { __html: value || '<span class="text-gray-400 italic">Click to enter text...</span>' } : undefined}
    >
      {Tag !== 'span' && Tag !== 'div' ? (value || <span className="text-gray-400 italic">Click to enter text...</span>) : undefined}
    </Tag>
  );
};
