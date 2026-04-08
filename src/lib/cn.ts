import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge conditional class names with Tailwind conflict resolution.
 * Usage: cn('p-2', isActive && 'bg-brand-600', 'p-4')  // -> 'bg-brand-600 p-4'
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))
