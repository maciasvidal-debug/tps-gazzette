import React from 'react';
import type { GazzetteState, PollState } from '../../types/gazzette';
import { FormInput } from '../FormElements';

interface PollConfigPanelProps {
  state: GazzetteState;
  updateState: (updater: (draft: GazzetteState) => void) => void;
}

export const PollConfigPanel: React.FC<PollConfigPanelProps> = ({ state, updateState }) => {
  const poll = state.poll || { question: '', options: [], endpoint: '' };

  const handleUpdate = (updater: (draftPoll: PollState) => void) => {
    updateState(draft => {
      if (!draft.poll) {
        draft.poll = { question: '', options: [], endpoint: '' };
      }
      updater(draft.poll);
    });
  };

  const addOption = () => {
    handleUpdate(draftPoll => {
      draftPoll.options.push({ id: Date.now().toString(), label: 'New Option' });
    });
  };

  const removeOption = (index: number) => {
    handleUpdate(draftPoll => {
      draftPoll.options.splice(index, 1);
    });
  };

  const updateOption = (index: number, label: string) => {
    handleUpdate(draftPoll => {
      if (draftPoll.options[index]) {
        draftPoll.options[index].label = label;
      }
    });
  };

  return (
    <div className="space-y-4">
      <FormInput
        label="Poll Question"
        value={poll.question}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdate(p => { p.question = e.target.value; })}
      />
      <FormInput
        label="Webhook / Endpoint URL"
        placeholder="https://example.com/vote"
        value={poll.endpoint || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdate(p => { p.endpoint = e.target.value; })}
      />

      <div className="space-y-4">
        <div className="text-sm font-bold text-[#D0D1D8] uppercase tracking-wider mb-2">Options</div>
        {poll.options.map((option: {id: string, label: string}, index: number) => (
          <div key={option.id} className="flex gap-2 items-end">
            <FormInput
              label={`Option ${index + 1}`}
              containerClassName="flex-1"
              value={option.label}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOption(index, e.target.value)}
            />
            <button
              onClick={() => removeOption(index)}
              className="text-[#8B8D98] hover:text-[#ED6A5E] bg-[#1A1A1E] border border-[#343541] rounded px-3 py-2 mb-[2px]"
            >
              ×
            </button>
          </div>
        ))}

        <button
          className="w-full py-2 bg-[#343541] hover:bg-[#4B4C56] text-[#D0D1D8] text-sm font-medium rounded transition-colors"
          onClick={addOption}
        >
          + Add Option
        </button>
      </div>

      {(!state.poll || poll.options.length === 0) && (
        <p className="text-xs text-gray-500 text-center italic mt-4">
          Add a question and options to enable the Interactive Poll module.
        </p>
      )}
    </div>
  );
};
