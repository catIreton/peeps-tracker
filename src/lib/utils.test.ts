import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { format, subDays } from 'date-fns'
import { getContactStatus, getDaysSince, formatDaysAgo } from './utils'

// Local noon avoids UTC/local edge cases (midnight UTC can be yesterday locally)
const TODAY = new Date(2025, 5, 1, 12, 0, 0, 0) // June 1 2025, noon local
const dateStr = (daysAgo: number) => format(subDays(TODAY, daysAgo), 'yyyy-MM-dd')

describe('getContactStatus', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(TODAY) })
  afterEach(() => vi.useRealTimers())

  it('returns overdue when lastContact is null', () => {
    expect(getContactStatus(null, 30)).toBe('overdue')
  })

  it('returns good when contacted today', () => {
    expect(getContactStatus(dateStr(0), 30)).toBe('good')
  })

  it('returns good when within target_days', () => {
    expect(getContactStatus(dateStr(17), 30)).toBe('good')
  })

  it('returns good at exactly target_days', () => {
    expect(getContactStatus(dateStr(30), 30)).toBe('good')
  })

  it('returns due when between target and 1.5× target', () => {
    expect(getContactStatus(dateStr(35), 30)).toBe('due')
  })

  it('returns due at exactly ceil(1.5× target)', () => {
    // target=30 → ceil(30*1.5)=45 → day 45 is still due
    expect(getContactStatus(dateStr(45), 30)).toBe('due')
  })

  it('returns overdue beyond 1.5× target', () => {
    expect(getContactStatus(dateStr(46), 30)).toBe('overdue')
  })

  it('rounds up the due threshold (ceil)', () => {
    // target=7 → ceil(7*1.5)=ceil(10.5)=11 → day 11 is due, day 12 is overdue
    expect(getContactStatus(dateStr(11), 7)).toBe('due')
    expect(getContactStatus(dateStr(12), 7)).toBe('overdue')
  })
})

describe('getDaysSince', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(TODAY) })
  afterEach(() => vi.useRealTimers())

  it('returns null for null lastContact', () => {
    expect(getDaysSince(null)).toBeNull()
  })

  it('returns 0 for today', () => {
    expect(getDaysSince(dateStr(0))).toBe(0)
  })

  it('returns 1 for yesterday', () => {
    expect(getDaysSince(dateStr(1))).toBe(1)
  })

  it('returns correct count for older dates', () => {
    expect(getDaysSince(dateStr(30))).toBe(30)
  })
})

describe('formatDaysAgo', () => {
  it('returns "today" for 0', () => {
    expect(formatDaysAgo(0)).toBe('today')
  })

  it('returns "yesterday" for 1', () => {
    expect(formatDaysAgo(1)).toBe('yesterday')
  })

  it('returns "Nd ago" for larger values', () => {
    expect(formatDaysAgo(5)).toBe('5d ago')
    expect(formatDaysAgo(30)).toBe('30d ago')
  })

  it('handles null (defensive branch)', () => {
    expect(formatDaysAgo(null)).toBe('never contacted')
  })
})
