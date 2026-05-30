import { validateUrl } from './url';
import type { PollState } from '../types/gazzette';

export function sanitizePoll(poll: PollState | undefined): PollState | undefined {
  if (!poll) return undefined;

  const validEndpoint = validateUrl(poll.endpoint);

  // Return a new object ensuring idempotency and preventing mutation of the original input.
  return {
    question: poll.question.replace(/<[^>]*>?/gm, '').trim(),
    options: poll.options.map(opt => opt.replace(/<[^>]*>?/gm, '').trim()).filter(opt => opt.length > 0),
    endpoint: validEndpoint === '#' ? '' : validEndpoint
  };
}
