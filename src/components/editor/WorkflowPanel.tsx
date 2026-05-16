import { useState } from 'react';
import type { GazzetteState } from '../../types/gazzette';
import { FormSelect, FormTextArea } from '../FormElements';

interface WorkflowPanelProps {
  state: GazzetteState;
  updateState: (updater: (draft: GazzetteState) => void) => void;
}

export function WorkflowPanel({ state, updateState }: WorkflowPanelProps) {
  const [newNote, setNewNote] = useState('');

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

  return (
    <div className="space-y-6">
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
          <option value="approved">Final Approved</option>
        </FormSelect>
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
