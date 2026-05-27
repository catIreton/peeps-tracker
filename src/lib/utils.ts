import { differenceInDays, parseISO } from 'date-fns'
import type { ContactStatus } from './types'

export function getContactStatus(lastContact: string | null, targetDays: number): ContactStatus {
  if (!lastContact) return 'overdue'
  const days = differenceInDays(new Date(), parseISO(lastContact))
  if (days <= targetDays) return 'good'
  if (days <= Math.ceil(targetDays * 1.5)) return 'due'
  return 'overdue'
}

export function getDaysSince(lastContact: string | null): number | null {
  if (!lastContact) return null
  return differenceInDays(new Date(), parseISO(lastContact))
}

export function formatDaysAgo(days: number | null): string {
  if (days === null) return 'never contacted'
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  return `${days}d ago`
}
