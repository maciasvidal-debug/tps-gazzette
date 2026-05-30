import React from 'react';
import type { GazzetteState } from '../../types/gazzette';
import { FormInput } from '../FormElements';

interface PollConfigPanelProps {
  state: GazzetteState;
  updateState: (updater: (draft: GazzetteState) => void) => void;
}

export const PollConfigPanel: React.FC<PollConfigPanelProps> = ({ state, updateState }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#8B8D98] uppercase tracking-wider">Enable Poll</label>
        <input
          type="checkbox"
          checked={!!state.poll}
          onChange={(e) => updateState(draft => {
            if (e.target.checked) {
              draft.poll = {
                question: 'What do you think about the new office layout?',
                options: ['Love it!', 'Needs improvement', 'No opinion'],
                endpoint: 'https://example.com/poll'
              };
            } else {
              delete draft.poll;
            }
          })}
          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-tps-primary focus:ring-tps-primary focus:ring-offset-gray-800"
        />
      </div>

      {state.poll && (
        <>
          <FormInput
            label="Question"
            value={state.poll.question}
            onChange={e => updateState(draft => { if (draft.poll) draft.poll.question = e.target.value; })}
          />
          <FormInput
            label="Endpoint URL (Webhook/API)"
            value={state.poll.endpoint}
            onChange={e => updateState(draft => { if (draft.poll) draft.poll.endpoint = e.target.value; })}
          />

          <div className="space-y-4">
            <div className="text-sm font-bold text-[#D0D1D8] uppercase tracking-wider mb-2">Options</div>
            {(state.poll.options || []).map((opt, index) => (
              <div key={index} className="flex gap-2 items-center">
                <FormInput
                  containerClassName="flex-1"
                  value={opt}
                  onChange={e => updateState(draft => {
                    if (draft.poll?.options) {
                      draft.poll.options[index] = e.target.value;
                    }
                  })}
                />
                <button
                  className="text-[#8B8D98] hover:text-[#ED6A5E] p-2"
                  onClick={() => updateState(draft => {
                    if (draft.poll?.options) {
                      draft.poll.options.splice(index, 1);
                    }
                  })}
                >
                  ×
                </button>
              </div>
            ))}

            <button
              className="w-full py-2 bg-[#343541] hover:bg-[#4B4C56] text-[#D0D1D8] text-sm font-medium rounded transition-colors"
              onClick={() => updateState(draft => {
                if (draft.poll) {
                  draft.poll.options.push('New Option');
                }
              })}
            >
              + Add Option
            </button>
          </div>
        </>
      )}
    </div>
  );
};
