import React from 'react';
import type { PollState } from '../../../types/gazzette';
import { EditableText } from '../../EditableText';

interface PollBlockProps {
  poll: PollState;
  isEditable?: boolean;
  onUpdate?: (updater: (draft: PollState) => void) => void;
}

export const PollBlock: React.FC<PollBlockProps> = ({ poll, isEditable = false, onUpdate }) => {
  if (!poll || (!poll.question && poll.options.length === 0)) return null;

  return (
    <div className="mt-8 mb-8 p-6 bg-[#f8f9fa] border-2 border-[#3c2065] text-center flex flex-col items-center">
      {isEditable && onUpdate ? (
        <EditableText
          tagName="h4"
          className="font-sans text-xl font-bold text-[#1f2937] mb-6 tracking-wide"
          value={poll.question}
          onChange={(val) => onUpdate(draft => { draft.question = val; })}
        />
      ) : (
        <h4
          className="font-sans text-xl font-bold text-[#1f2937] mb-6 tracking-wide"
          dangerouslySetInnerHTML={{ __html: poll.question }}
        />
      )}

      <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border={0} style={{ margin: '0 auto', maxWidth: '500px' }}>
        <tbody>
          <tr>
            <td align="center" style={{ padding: '0' }}>
              <table role="presentation" cellSpacing="0" cellPadding="0" border={0} width="100%">
                <tbody>
                  {poll.options.map((opt, index) => (
                    <tr key={opt.id || index}>
                      <td align="center" style={{ paddingBottom: '12px' }}>
                        <a
                          href={opt.link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-block',
                            backgroundColor: '#ffffff',
                            border: '2px solid #3c2065',
                            color: '#3c2065',
                            fontWeight: 'bold',
                            fontFamily: 'sans-serif',
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            padding: '12px 24px',
                            textDecoration: 'none',
                            width: '80%',
                            maxWidth: '300px',
                            textAlign: 'center',
                            borderRadius: '4px'
                          }}
                        >
                          {isEditable && onUpdate ? (
                            <EditableText
                              tagName="span"
                              value={opt.label}
                              onChange={(val) => onUpdate(draft => {
                                if(draft.options?.[index]) draft.options[index].label = val;
                              })}
                            />
                          ) : (
                            <span dangerouslySetInnerHTML={{ __html: opt.label }} />
                          )}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
