import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getMoodEmoji = (score: number) => {
  // Round the score to the nearest integer
  const roundedScore = Math.round(score)

  switch (roundedScore) {
    case -10: return '😡'
    case -9: return '😠'
    case -8: return '😖'
    case -7: return '😞'
    case -6: return '😢'
    case -5: return '😟'
    case -4: return '😔'
    case -3: return '🙁'
    case -2: return '😐'
    case -1: return '😕'
    case 0: return '😶'
    case 1: return '🙂'
    case 2: return '😊'
    case 3: return '😀'
    case 4: return '😄'
    case 5: return '😁'
    case 6: return '😃'
    case 7: return '🤩'
    case 8: return '🥰'
    case 9: return '😍'
    case 10: return '🤗'
    default: return '😶'
  }
}
