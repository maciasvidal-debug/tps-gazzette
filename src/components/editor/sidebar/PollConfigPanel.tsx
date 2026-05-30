import React from 'react';
import type { GazzetteState } from '../../../types/gazzette';
import { FormInput, AccordionSection } from '../../FormElements';

interface PollConfigPanelProps {
  state: GazzetteState;
  updateState: (updater: (draft: GazzetteState) => void) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const PollConfigPanel: React.FC<PollConfigPanelProps> = ({
  state,
  updateState,
  isOpen,
  onToggle
}) => {
  return (
    <AccordionSection
      title="Interactive Poll"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <FormInput
          label="Question"
          value={state.poll?.question || ''}
          onChange={e => updateState(draft => {
            if (!draft.poll) draft.poll = { question: '', options: [] };
            draft.poll.question = e.target.value;
          })}
        />

        <div className="space-y-4">
          <div className="text-sm font-bold text-[#D0D1D8] uppercase tracking-wider mb-2">Options</div>
          {(state.poll?.options || []).map((opt, index) => (
            <div key={opt.id} className="p-3 bg-[#1A1A1E] rounded-md border border-[#343541] relative">
              <button
                className="absolute top-2 right-2 text-[#8B8D98] hover:text-[#ED6A5E]"
                onClick={() => updateState(draft => {
                  if (draft.poll?.options) {
                    draft.poll.options.splice(index, 1);
                  }
                })}
              >
                ×
              </button>
              <div className="space-y-3 mt-4">
                <FormInput
                  label="Label"
                  value={opt.label}
                  onChange={e => updateState(draft => {
                    if (draft.poll?.options?.[index]) {
                      draft.poll.options[index].label = e.target.value;
                    }
                  })}
                />
                <FormInput
                  label="Vote Link (Endpoint URL with parameters)"
                  value={opt.link}
                  onChange={e => updateState(draft => {
                    if (draft.poll?.options?.[index]) {
                      draft.poll.options[index].link = e.target.value;
                    }
                  })}
                />
              </div>
            </div>
          ))}

          <button
            className="w-full py-2 bg-[#343541] hover:bg-[#4B4C56] text-[#D0D1D8] text-sm font-medium rounded transition-colors"
            onClick={() => updateState(draft => {
              if (!draft.poll) draft.poll = { question: 'What is your opinion?', options: [] };
              draft.poll.options.push({
                id: Date.now().toString(),
                label: 'New Option',
                link: 'https://'
              });
            })}
          >
            + Add Poll Option
          </button>
        </div>

        <FormInput
          label="Global Endpoint Base URL (Optional)"
          value={state.poll?.endpoint || ''}
          onChange={e => updateState(draft => {
            if (!draft.poll) draft.poll = { question: '', options: [] };
            draft.poll.endpoint = e.target.value;
          })}
        />
      </div>
    </AccordionSection>
  );
};
