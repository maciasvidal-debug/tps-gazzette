import React, { useState } from 'react';
import type { Snapshot } from '../../types/gazzette';

interface SnapshotsPanelProps {
  snapshots: Snapshot[];
  onSaveSnapshot: (name: string) => void;
  onLoadSnapshot: (id: string) => void;
  onDeleteSnapshot: (id: string) => void;
}

export function SnapshotsPanel({ snapshots, onSaveSnapshot, onLoadSnapshot, onDeleteSnapshot }: SnapshotsPanelProps) {
  const [newSnapshotName, setNewSnapshotName] = useState('');

  const handleSave = () => {
    if (newSnapshotName.trim()) {
      onSaveSnapshot(newSnapshotName.trim());
      setNewSnapshotName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="space-y-4 text-sm text-[#8B8D98]">
      <div className="flex gap-2">
        <input
          type="text"
          value={newSnapshotName}
          onChange={(e) => setNewSnapshotName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Initial Draft"
          className="flex-1 bg-[#212126] text-white text-xs px-3 py-2 rounded border border-[#2C2D35] focus:border-[#4B4C56] focus:outline-none placeholder-[#4B4C56]"
        />
        <button
          onClick={handleSave}
          disabled={!newSnapshotName.trim()}
          className="px-3 py-2 bg-[#4B4C56] hover:bg-[#6C6D77] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded transition-colors"
        >
          Save
        </button>
      </div>

      <div className="space-y-2 mt-4 max-h-48 overflow-y-auto custom-scrollbar pr-1">
        {snapshots.length === 0 ? (
          <div className="text-center text-xs italic text-[#4B4C56] py-4">
            No snapshots saved yet.
          </div>
        ) : (
          snapshots.map((snapshot) => (
            <div key={snapshot.id} className="bg-[#212126] p-2 rounded border border-[#2C2D35] flex items-center justify-between group">
              <div className="flex-1 min-w-0 mr-2">
                <div className="text-white text-xs font-medium truncate" title={snapshot.name}>
                  {snapshot.name}
                </div>
                <div className="text-[10px] text-[#4B4C56]">
                  {new Date(snapshot.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onLoadSnapshot(snapshot.id)}
                  className="p-1.5 text-[#61C554] hover:bg-[#343541] rounded transition-colors"
                  title="Load Snapshot"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </button>
                <button
                  onClick={() => onDeleteSnapshot(snapshot.id)}
                  className="p-1.5 text-[#ED6A5E] hover:bg-[#343541] rounded transition-colors"
                  title="Delete Snapshot"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
