import React from 'react';
import type { GazzetteState } from '../../types/gazzette';
import { FormInput, FormSelect, FormTextArea } from '../FormElements';

interface FlashAlertEditorProps {
  state: GazzetteState;
  updateState: (updater: (draft: GazzetteState) => void) => void;
}

export const FlashAlertEditor: React.FC<FlashAlertEditorProps> = ({ state, updateState }) => {
  const alertState = state.flashAlert || { visible: false, message: '', level: 'info' };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="flash-alert-visible"
          checked={alertState.visible}
          onChange={(e) => {
            updateState(draft => {
              if (!draft.flashAlert) draft.flashAlert = { visible: false, message: '', level: 'info' };
              draft.flashAlert.visible = e.target.checked;
            });
          }}
          className="w-4 h-4 rounded border-[#343541] bg-[#1A1A1E] text-[#ED6A5E] focus:ring-[#ED6A5E]"
        />
        <label htmlFor="flash-alert-visible" className="text-sm font-medium text-white cursor-pointer select-none">
          Enable Flash Alert Banner
        </label>
      </div>

      {alertState.visible && (
        <div className="space-y-4 pl-6 border-l-2 border-[#343541]">
          <div>
            <label className="block text-xs font-bold text-[#8B8D98] uppercase tracking-wider mb-2">Message</label>
            <FormTextArea
              value={alertState.message}
              onChange={(e) => updateState(draft => {
                if (!draft.flashAlert) draft.flashAlert = { visible: true, message: '', level: 'info' };
                draft.flashAlert.message = e.target.value;
              })}
              placeholder="e.g. System Maintenance Tomorrow at 2am"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8B8D98] uppercase tracking-wider mb-2">Alert Level</label>
            <FormSelect
              value={alertState.level}
              onChange={(e) => updateState(draft => {
                if (!draft.flashAlert) draft.flashAlert = { visible: true, message: '', level: 'info' };
                draft.flashAlert.level = e.target.value as any;
              })}
            >
              <option value="info">Info (Blue)</option>
              <option value="warning">Warning (Yellow)</option>
              <option value="urgent">Urgent (Red)</option>
            </FormSelect>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8B8D98] uppercase tracking-wider mb-2">Link (Optional)</label>
            <FormInput
              value={alertState.link || ''}
              onChange={(e) => updateState(draft => {
                if (!draft.flashAlert) draft.flashAlert = { visible: true, message: '', level: 'info' };
                draft.flashAlert.link = e.target.value;
              })}
              placeholder="https://..."
            />
          </div>
        </div>
      )}
    </div>
  );
};
