import { validateUrl } from './url';
import type { PollState, PollOption } from '../types/gazzette';
import { sanitizeHtml } from './sanitize';

export const sanitizePollState = (poll?: Partial<PollState>): PollState | undefined => {
  if (!poll) return undefined;

  const sanitizedQuestion = poll.question ? sanitizeHtml(poll.question) : '';
  const sanitizedEndpoint = poll.endpoint ? validateUrl(poll.endpoint) : undefined;

  const sanitizedOptions: PollOption[] = (poll.options || []).map(opt => ({
    id: opt.id || crypto.randomUUID(),
    label: opt.label ? sanitizeHtml(opt.label) : '',
    link: validateUrl(opt.link || '')
  }));

  return {
    question: sanitizedQuestion,
    options: sanitizedOptions,
    ...(sanitizedEndpoint && { endpoint: sanitizedEndpoint })
  };
};
