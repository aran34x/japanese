import type { Grade, ReviewState } from './types';

const DAY = 24 * 60 * 60 * 1000;

/** Fresh review state for a brand new card. */
export function newReviewState(cardId: string): ReviewState {
  return {
    cardId,
    ease: 2.5,
    interval: 0,
    reps: 0,
    due: Date.now(),
    lastReviewed: 0,
    totalReviews: 0,
    totalCorrect: 0,
    phase: 'new'
  };
}

/**
 * SM-2 inspired scheduler with Anki-style learning steps.
 * - "again" resets the card to learning (due in ~1 min).
 * - "hard"/"good"/"easy" graduate and grow the interval by ease.
 */
export function schedule(state: ReviewState, grade: Grade, now = Date.now()): ReviewState {
  const next: ReviewState = { ...state };
  next.totalReviews += 1;
  next.lastReviewed = now;

  const correct = grade !== 'again';
  if (correct) next.totalCorrect += 1;

  // Learning / new phase uses short minute-based steps.
  if (state.phase === 'new' || state.phase === 'learning') {
    switch (grade) {
      case 'again':
        next.phase = 'learning';
        next.reps = 0;
        next.interval = 0;
        next.due = now + 1 * 60 * 1000; // 1 min
        break;
      case 'hard':
        next.phase = 'learning';
        next.due = now + 6 * 60 * 1000; // 6 min
        break;
      case 'good':
        // graduate to review with 1 day interval
        next.phase = 'review';
        next.reps = 1;
        next.interval = 1;
        next.due = now + 1 * DAY;
        break;
      case 'easy':
        next.phase = 'review';
        next.reps = 1;
        next.interval = 4;
        next.due = now + 4 * DAY;
        break;
    }
    return next;
  }

  // Review phase: classic SM-2 interval growth.
  let ease = state.ease;
  let interval = state.interval || 1;

  switch (grade) {
    case 'again':
      ease = Math.max(1.3, ease - 0.2);
      next.phase = 'learning';
      next.reps = 0;
      next.interval = 0;
      next.ease = ease;
      next.due = now + 10 * 60 * 1000; // relapse: 10 min
      return next;
    case 'hard':
      ease = Math.max(1.3, ease - 0.15);
      interval = Math.max(1, Math.round(interval * 1.2));
      break;
    case 'good':
      interval = Math.max(1, Math.round(interval * ease));
      break;
    case 'easy':
      ease = ease + 0.15;
      interval = Math.max(1, Math.round(interval * ease * 1.3));
      break;
  }

  next.ease = ease;
  next.interval = interval;
  next.reps = state.reps + 1;
  next.due = now + interval * DAY;
  return next;
}

/** Human-friendly preview of the next interval for a given grade. */
export function previewInterval(state: ReviewState, grade: Grade): string {
  const projected = schedule(state, grade);
  const ms = projected.due - Date.now();
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo`;
  return `${(days / 365).toFixed(1)}y`;
}

export function isDue(state: ReviewState, now = Date.now()): boolean {
  return state.due <= now;
}
