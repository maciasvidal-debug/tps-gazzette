import React, { useState } from 'react';
import type { GazzetteState } from '../types/gazzette';
import { executeAiCommand } from '../utils/aiCopilot';

interface AiAssistantProps {
  currentState: GazzetteState;
  updateState: (updater: (draft: GazzetteState) => void) => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ currentState, updateState }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      const partialState = await executeAiCommand(prompt, currentState);

      updateState((draft: GazzetteState) => {
         // Deep merge the incoming modifications from the AI
         (Object.keys(partialState) as Array<keyof GazzetteState>).forEach(key => {
             if (partialState[key] !== undefined) {
                 // @ts-expect-error - Typescript cannot infer union assignment on Draft types dynamically
                 draft[key] = partialState[key];
             }
         });
      });
      setPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="bg-[#1A1A1E] border border-[#2C2D35] rounded-lg shadow-2xl w-80 mb-4 overflow-hidden flex flex-col">
          <div className="bg-[#2C2D35] p-3 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-tps-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9.5 4a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm2 10a1 1 0 11-2 0v-4a1 1 0 112 0v4z"></path></svg>
              <span className="font-bold font-sans text-sm tracking-wider uppercase">AI Copilot</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="p-4 flex-1">
            <p className="text-xs text-gray-400 mb-4">
              I can help you rewrite articles, fix tone, summarize text, or add quotes. Tell me what you'd like to do!
            </p>

            {error && (
               <div className="bg-red-900/50 border border-red-500 text-red-200 text-xs p-2 rounded mb-4">
                 {error}
               </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Make the Feature Story sound more professional..."
                className="w-full bg-[#212126] border border-[#343541] rounded text-[#E5E7EB] p-2 text-sm focus:border-tps-primary focus:outline-none resize-none"
                rows={4}
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={isProcessing || !prompt.trim()}
                className={`w-full py-2 rounded text-sm font-bold transition-colors ${
                  isProcessing || !prompt.trim()
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-tps-primary hover:bg-tps-accent1 text-white'
                }`}
              >
                {isProcessing ? 'Generating...' : 'Apply Magic'}
              </button>
            </form>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-tps-primary hover:bg-tps-accent1 text-white p-4 rounded-full shadow-lg shadow-tps-primary/30 transition-transform hover:scale-105"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9.5 4a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm2 10a1 1 0 11-2 0v-4a1 1 0 112 0v4z"></path></svg>
        </button>
      )}
    </div>
  );
};
