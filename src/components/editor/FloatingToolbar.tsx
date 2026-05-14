import React, { useState, useEffect, useRef } from 'react';

interface FloatingToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  onInsertFormat: (formattedText: string, cursorOffset: number) => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ textareaRef, onInsertFormat }) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelection = () => {
      const el = textareaRef.current;
      if (!el || typeof el.selectionStart !== 'number' || typeof el.selectionEnd !== 'number') {
         setPosition(null);
         return;
      }

      const hasSelection = el.selectionStart !== el.selectionEnd;
      if (!hasSelection) {
        setPosition(null);
        return;
      }

      // Simple heuristic for position: just below the element
      const rect = el.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 10,
        left: rect.left + window.scrollX,
      });
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => {
      document.removeEventListener('selectionchange', handleSelection);
    };
  }, [textareaRef]);

  if (!position) return null;

  const handleFormat = (tagStart: string, tagEnd: string) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start === null || end === null) return;

    const selectedText = el.value.substring(start, end);
    const newText = `${tagStart}${selectedText}${tagEnd}`;

    onInsertFormat(newText, start + tagStart.length + selectedText.length + tagEnd.length);
  };

  return (

    <div
      ref={toolbarRef}
      style={{ top: position.top, left: position.left, position: 'absolute', zIndex: 1000 }}
      className="bg-white border border-gray-300 shadow-xl rounded-md px-2 py-1 flex items-center space-x-1 flex-wrap max-w-sm gap-y-1"
      onMouseDown={(e) => e.preventDefault()} // Prevent stealing focus
    >
      <button onClick={() => handleFormat('<strong>', '</strong>')} className="px-2 py-1 hover:bg-gray-100 rounded font-bold" title="Bold">B</button>
      <button onClick={() => handleFormat('<em>', '</em>')} className="px-2 py-1 hover:bg-gray-100 rounded italic" title="Italic">I</button>

      <div className="w-px h-4 bg-gray-300 mx-1"></div>

      <button onClick={() => handleFormat('<div style="text-align: left;">', '</div>')} className="px-2 py-1 hover:bg-gray-100 rounded" title="Align Left">⫷</button>
      <button onClick={() => handleFormat('<div style="text-align: center;">', '</div>')} className="px-2 py-1 hover:bg-gray-100 rounded" title="Align Center">☰</button>
      <button onClick={() => handleFormat('<div style="text-align: right;">', '</div>')} className="px-2 py-1 hover:bg-gray-100 rounded" title="Align Right">⫸</button>
      <button onClick={() => handleFormat('<div style="text-align: justify;">', '</div>')} className="px-2 py-1 hover:bg-gray-100 rounded" title="Justify">≡</button>

      <div className="w-px h-4 bg-gray-300 mx-1"></div>

      <button onClick={() => handleFormat('<span style="font-size: 0.8em;">', '</span>')} className="px-2 py-1 hover:bg-gray-100 rounded text-sm" title="Smaller">A-</button>
      <button onClick={() => handleFormat('<span style="font-size: 1.2em;">', '</span>')} className="px-2 py-1 hover:bg-gray-100 rounded text-lg" title="Larger">A+</button>

      <div className="w-px h-4 bg-gray-300 mx-1"></div>

      <input
        type="color"
        className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
        title="Text Color"
        onChange={(e) => handleFormat(`<span style="color: ${e.target.value};">`, '</span>')}
      />

      <select
        className="text-xs bg-transparent border-none cursor-pointer focus:outline-none"
        onChange={(e) => handleFormat(`<span style="font-family: ${e.target.value};">`, '</span>')}
        title="Font Family"
      >
        <option value="">Font</option>
        <option value="'Lora', serif">Serif</option>
        <option value="'Open Sans', sans-serif">Sans</option>
        <option value="monospace">Mono</option>
      </select>

      <div className="w-px h-4 bg-gray-300 mx-1"></div>

      <button onClick={() => handleFormat('<ul style="list-style-type: disc; margin-left: 20px;"><li>', '</li></ul>')} className="px-2 py-1 hover:bg-gray-100 rounded text-xs font-bold" title="Bullet List">• List</button>
      <button onClick={() => handleFormat('<ol style="list-style-type: decimal; margin-left: 20px;"><li>', '</li></ol>')} className="px-2 py-1 hover:bg-gray-100 rounded text-xs font-bold" title="Numbered List">1. List</button>

      <div className="w-px h-4 bg-gray-300 mx-1"></div>

      <button onClick={() => handleFormat('<div style="line-height: 1.2;">', '</div>')} className="px-1 py-1 hover:bg-gray-100 rounded text-xs" title="Line Height Tight">↕-</button>
      <button onClick={() => handleFormat('<div style="line-height: 2.0;">', '</div>')} className="px-1 py-1 hover:bg-gray-100 rounded text-xs" title="Line Height Loose">↕+</button>

    </div>

  );
};
