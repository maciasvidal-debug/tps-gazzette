import { useState, useMemo } from 'react';
import type { GazzetteState } from '../../types/gazzette';
import { FormSelect, FormTextArea } from '../FormElements';
import { validateGazzette } from '../../utils/qualityMetrics';
import { analyzeCopyedit, type CopyeditSuggestion } from '../../utils/aiCopilot';

interface WorkflowPanelProps {
  state: GazzetteState;
  updateState: (updater: (draft: GazzetteState) => void) => void;
}

export function WorkflowPanel({ state, updateState }: WorkflowPanelProps) {
  const [newNote, setNewNote] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<CopyeditSuggestion[] | null>(null);

  const qualityIssues = useMemo(() => validateGazzette(state), [state]);
  const hasCriticalErrors = qualityIssues.some(issue => issue.type === 'error');

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    updateState((draft) => {
      if (!draft.editorialNotes) draft.editorialNotes = [];
      draft.editorialNotes.push({
        id: crypto.randomUUID(),
        text: newNote.trim(),
        timestamp: new Date().toISOString(),
      });
    });
    setNewNote('');
  };

  const handleDeleteNote = (id: string) => {
    updateState((draft) => {
      if (draft.editorialNotes) {
        draft.editorialNotes = draft.editorialNotes.filter((note) => note.id !== id);
      }
    });
  };

  const handleRunAiReview = async () => {
    setIsAiLoading(true);
    setAiSuggestions(null);
    try {
      const suggestions = await analyzeCopyedit(state);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error(error);
      alert('Failed to run AI Copyedit.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Pre-Flight Checklist */}
      <div className="space-y-3">
        <h4 className="font-bold text-[#E5E7EB] text-sm uppercase tracking-wider">Pre-Flight Checklist</h4>

        {qualityIssues.length === 0 ? (
          <div className="p-3 bg-[#1e293b] border border-[#334155] rounded flex items-center gap-2 text-sm text-[#61C554]">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
             <span>All quality gates passed. Ready for approval.</span>
          </div>
        ) : (
           <div className="space-y-2">
            {qualityIssues.map((issue, idx) => (
              <div key={idx} className={`p-3 rounded border flex items-start gap-2 text-sm ${
                issue.type === 'error'
                  ? 'bg-[#3f1d1d] border-[#7f1d1d] text-[#fca5a5]'
                  : 'bg-[#422006] border-[#78350f] text-[#fcd34d]'
              }`}>
                {issue.type === 'error' ? (
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                ) : (
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
                <span>{issue.message}</span>
              </div>
            ))}
           </div>
        )}
      </div>

      <div className="p-4 bg-[#2C2D35] rounded border border-[#1A1A1E]">
        <FormSelect
          label="Current Status"
          value={state.workflowStatus || 'draft'}
          onChange={(e) => updateState((draft) => {
            draft.workflowStatus = e.target.value as GazzetteState['workflowStatus'];
          })}
        >
          <option value="draft">Drafting</option>
          <option value="copyedit">Copyediting</option>
          <option value="layout">Layout & Design</option>
          <option value="approved" disabled={hasCriticalErrors}>Final Approved</option>
        </FormSelect>
        {hasCriticalErrors && (
          <p className="text-xs text-[#ED6A5E] mt-2 italic">
            Fix critical errors in the Pre-Flight Checklist to enable approval.
          </p>
        )}
      </div>

      {/* AI Proofreader */}
      <div className="bg-[#212126] p-4 rounded border border-[#343541]">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold text-[#E5E7EB] text-sm uppercase tracking-wider">AI Proofreader</h4>
          <button
            onClick={handleRunAiReview}
            disabled={isAiLoading}
            className="bg-[#3c2065] hover:bg-[#5e3898] disabled:opacity-50 text-white font-bold py-1 px-3 rounded text-xs transition-colors"
          >
            {isAiLoading ? 'Analyzing...' : 'Run Review'}
          </button>
        </div>

        {aiSuggestions && aiSuggestions.length === 0 && (
          <p className="text-xs text-[#61C554]">No major issues found! The text looks great.</p>
        )}

        {aiSuggestions && aiSuggestions.length > 0 && (
          <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
            {aiSuggestions.map((suggestion, idx) => (
              <div key={idx} className="p-3 bg-[#2A2A35] rounded border border-[#4B4C56] text-sm">
                <div className="font-bold text-[#F5BF4F] mb-1">{suggestion.location}</div>
                <div className="text-[#E5E7EB] mb-2">{suggestion.issue}</div>
                <div className="text-[#8B8D98] italic">Suggestion: {suggestion.suggestion}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h4 className="font-bold text-[#E5E7EB] text-sm uppercase tracking-wider">Editorial Notes</h4>

        <div className="flex flex-col gap-2">
          <FormTextArea
            placeholder="Add a new note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={2}
          />
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="self-end bg-[#ED6A5E] hover:bg-[#d95c52] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-1.5 px-4 rounded text-xs uppercase tracking-wider transition-colors"
          >
            Add Note
          </button>
        </div>

        <div className="space-y-2 mt-4 max-h-64 overflow-y-auto custom-scrollbar pr-2">
          {(!state.editorialNotes || state.editorialNotes.length === 0) ? (
            <p className="text-xs text-[#8B8D98] italic text-center py-4">No editorial notes yet.</p>
          ) : (
            state.editorialNotes.map((note) => (
              <div key={note.id} className="p-3 bg-[#2A2A35] rounded border border-[#343541] relative group">
                <p className="text-sm text-[#E5E7EB] mb-2">{note.text}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-[#8B8D98]">
                    {new Date(note.timestamp).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-[#E5484D] hover:text-[#F2555A] text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Note"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
