import React from 'react';
import type { PollState } from '../../types/gazzette';
import { sanitizePoll } from '../../utils/pollSanitizer';

interface PollBlockProps {
  poll: PollState | undefined;
}

export const PollBlock: React.FC<PollBlockProps> = ({ poll }) => {
  const safePoll = sanitizePoll(poll);

  if (!safePoll || !safePoll.question || safePoll.options.length === 0) {
    return null;
  }

  return (
    <div className="my-8 p-6 bg-gray-100 border border-gray-200">
      <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border={0}>
        <tbody>
          <tr>
            <td align="center" style={{ paddingBottom: '20px' }}>
              <h4 className="font-sans text-lg font-bold text-tps-text m-0 tracking-wide">
                {safePoll.question}
              </h4>
            </td>
          </tr>
          <tr>
            <td align="center">
              <table role="presentation" cellSpacing="0" cellPadding="0" border={0} style={{ margin: '0 auto' }}>
                <tbody>
                  <tr>
                    {safePoll.options.map((option, index) => {
                      const linkUrl = safePoll.endpoint
                        ? `${safePoll.endpoint}${safePoll.endpoint.includes('?') ? '&' : '?'}option=${encodeURIComponent(option)}`
                        : '#';

                      return (
                        <td key={index} align="center" style={{ padding: '0 10px', paddingBottom: '10px' }}>
                          <a
                            href={linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-white border-2 border-tps-primary text-tps-primary font-bold font-sans text-xs uppercase tracking-wider py-2 px-6 hover:bg-tps-primary hover:text-white transition-colors"
                            style={{ textDecoration: 'none', display: 'inline-block' }}
                          >
                            {option}
                          </a>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
