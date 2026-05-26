import React from 'react';
import type { PollState } from '../types/gazzette';
import { sanitizePollEndpoint, sanitizePollText } from '../utils/pollSanitizer';

interface PollBlockProps {
  poll: PollState;
  className?: string;
}

export const PollBlock: React.FC<PollBlockProps> = ({ poll, className = '' }) => {
  if (!poll.question || poll.options.length === 0) {
    return null;
  }

  const sanitizedQuestion = sanitizePollText(poll.question);
  const endpointUrl = sanitizePollEndpoint(poll.endpoint);

  return (
    <div className={`mt-8 mb-8 ${className}`}>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0} style={{ border: '2px solid var(--color-tps-primary)', borderRadius: '8px', overflow: 'hidden' }}>
        <tbody>
          <tr>
            <td style={{ backgroundColor: 'var(--color-tps-primary)', padding: '16px', textAlign: 'center' }}>
              <h3 style={{ margin: 0, fontFamily: 'serif', fontSize: '20px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '0.05em' }}>
                {sanitizedQuestion}
              </h3>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '24px', backgroundColor: '#f9fafb' }}>
              <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0}>
                <tbody>
                  {poll.options.map((option, index) => {
                    const sanitizedOption = sanitizePollText(option.label);
                    // Generate response URL
                    let targetUrl = endpointUrl;
                    if (endpointUrl && sanitizedOption) {
                      try {
                        const urlObj = new URL(endpointUrl);
                        urlObj.searchParams.append('vote', sanitizedOption);
                        urlObj.searchParams.append('optionId', option.id);
                        targetUrl = urlObj.toString();
                      } catch {
                        // Fallback simple append if URL constructor fails (e.g., relative path)
                        const separator = endpointUrl.includes('?') ? '&' : '?';
                        targetUrl = `${endpointUrl}${separator}vote=${encodeURIComponent(sanitizedOption)}&optionId=${encodeURIComponent(option.id)}`;
                      }
                    }

                    return (
                      <tr key={option.id}>
                        <td style={{ paddingBottom: index === poll.options.length - 1 ? '0' : '12px' }}>
                          <a
                            href={targetUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'block',
                              padding: '12px 16px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              color: 'var(--color-tps-text)',
                              fontFamily: 'sans-serif',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              textDecoration: 'none',
                              textAlign: 'center'
                            }}
                            onMouseOver={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-tps-accent1)';
                              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#f3f4f6';
                            }}
                            onMouseOut={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.borderColor = '#d1d5db';
                              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#ffffff';
                            }}
                          >
                            {sanitizedOption}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
