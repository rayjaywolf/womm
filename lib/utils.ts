import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getMoodEmoji = (score: number) => {
  if (score >= 8) return '😄'
  if (score >= 6) return '🙂'
  if (score >= 4) return '😐'
  if (score >= 2) return '🙁'
  return '😢'
}
