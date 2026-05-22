import React from 'react';
import type { FlashAlertState } from '../types/gazzette';

interface FlashAlertPreviewProps {
  state: FlashAlertState | undefined;
}

export const FlashAlertPreview: React.FC<FlashAlertPreviewProps> = ({ state }) => {
  if (!state || !state.visible || !state.message) return null;

  let bgColor = '#e5edff'; // info
  let textColor = '#1e40af';
  if (state.level === 'warning') {
    bgColor = '#fef3c7';
    textColor = '#92400e';
  } else if (state.level === 'urgent') {
    bgColor = '#fee2e2';
    textColor = '#b91c1c';
  }

  const content = state.link ? (
    <a href={state.link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
      {state.message}
    </a>
  ) : (
    state.message
  );

  return (
    <div style={{
      width: '100%',
      backgroundColor: bgColor,
      color: textColor,
      padding: '12px 24px',
      textAlign: 'center',
      fontFamily: 'sans-serif',
      fontSize: '14px',
      fontWeight: 'bold',
      boxSizing: 'border-box'
    }}>
      {content}
    </div>
  );
};
