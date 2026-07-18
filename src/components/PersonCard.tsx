import { useRef, useState } from 'react'
import { format, parseISO } from 'date-fns'
import type { PersonWithStatus } from '../lib/types'
import { formatDaysAgo } from '../lib/utils'

interface PersonCardProps {
  person: PersonWithStatus
  targetDays: number
  hangoutDate: string | null
  onReachedOut: (id: string) => void
  onUndoReachedOut: (id: string, prevLastContact: string | null, prevHangout: string | null, prevSkipped?: boolean) => void
  onPlanHangout: (id: string, date: string) => void
  onCancelHangout: (id: string) => void
  onSkipHangout: (id: string) => void
}

const STATUS_GLYPH: Record<string, string> = {
  good: '●',
  due:  '◐',
  overdue: '○',
}

const LCD = '#c2cf9c'
const LCD_DARK = '#1d2b00'
const LCD_MID = '#8fa370'

export default function PersonCard({ person, targetDays, hangoutDate, onReachedOut, onUndoReachedOut, onPlanHangout, onCancelHangout, onSkipHangout }: PersonCardProps) {
  const [justLogged, setJustLogged] = useState(false)
  const [flashing, setFlashing] = useState(false)
  const [showPlanner, setShowPlanner] = useState(false)
  const [draftDate, setDraftDate] = useState('')
  const prevLastContactRef = useRef<string | null>(null)
  const prevHangoutRef = useRef<string | null>(null)
  const prevSkippedRef = useRef<boolean | undefined>(false)
  const loggedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCall = () => {
    prevLastContactRef.current = person.last_contact
    prevHangoutRef.current = hangoutDate
    prevSkippedRef.current = person.skipped
    onReachedOut(person.id)
    setFlashing(true)
    setTimeout(() => setFlashing(false), 100)
    setJustLogged(true)
    if (loggedTimerRef.current) clearTimeout(loggedTimerRef.current)
    loggedTimerRef.current = setTimeout(() => setJustLogged(false), 3000)
    setShowPlanner(false)
  }

  const handleSkip = () => {
    prevLastContactRef.current = person.last_contact
    prevHangoutRef.current = hangoutDate
    prevSkippedRef.current = person.skipped
    onSkipHangout(person.id)
    setJustLogged(true)
    if (loggedTimerRef.current) clearTimeout(loggedTimerRef.current)
    loggedTimerRef.current = setTimeout(() => setJustLogged(false), 3000)
    setShowPlanner(false)
  }

  const handleUndo = () => {
    if (loggedTimerRef.current) clearTimeout(loggedTimerRef.current)
    setJustLogged(false)
    onUndoReachedOut(person.id, prevLastContactRef.current, prevHangoutRef.current, prevSkippedRef.current)
  }

  const handleOpenPlanner = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setDraftDate(format(tomorrow, 'yyyy-MM-dd'))
    setShowPlanner(true)
  }

  const handleSavePlan = () => {
    if (draftDate) {
      onPlanHangout(person.id, draftDate)
      setShowPlanner(false)
    }
  }

  const today = format(new Date(), 'yyyy-MM-dd')
  const hangoutOverdue = hangoutDate !== null && hangoutDate <= today

  const daysText = person.daysSince !== null
    ? `${formatDaysAgo(person.daysSince)}/${targetDays}d`
    : `NEVER/${targetDays}d`
  const showSkippedMark = person.skipped && !hangoutDate

  return (
    <div
      className="border-b"
      style={{
        borderColor: LCD_MID,
        background: flashing ? LCD_DARK : 'transparent',
        color: flashing ? LCD : LCD_DARK,
        transition: 'background 50ms',
      }}
    >
      {/* Main row */}
      <div className="flex items-center justify-between px-2 py-1">
        <div className="flex items-baseline gap-1.5 min-w-0 text-base leading-tight">
          <span className="shrink-0 text-sm">{STATUS_GLYPH[person.status]}</span>
          <span className="truncate">{person.name}</span>
          {hangoutDate ? (
            <span
              className="shrink-0 text-xs font-bold"
              style={{ color: hangoutOverdue ? '#5a1010' : LCD_DARK }}
            >
              {hangoutOverdue ? `!! ${format(parseISO(hangoutDate), 'MMM d')}` : `📅 ${format(parseISO(hangoutDate), 'MMM d')}`}
            </span>
          ) : (
            <span className="shrink-0 text-xs opacity-60">
              {daysText}
              {showSkippedMark && <span title="Last hangout was skipped, not an actual contact"> ⤼skip</span>}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Skip button — always available, independent of a planned hangout */}
          {!showPlanner && (
            <button
              onClick={handleSkip}
              className="shrink-0 phone-key flex items-center justify-center text-xs leading-none"
              style={{ width: 24, height: 20, background: 'transparent', color: LCD_DARK, border: `1px solid ${LCD_MID}` }}
              title="Skip (resets the timeline, marked as skipped)"
            >
              ⤼
            </button>
          )}

          {/* Cancel / Plan hangout button */}
          {hangoutDate && !showPlanner ? (
            <button
              onClick={() => onCancelHangout(person.id)}
              className="shrink-0 phone-key flex items-center justify-center text-xs leading-none"
              style={{ width: 24, height: 20, background: 'transparent', color: LCD_DARK, border: `1px solid ${LCD_MID}` }}
              title="Cancel planned hangout"
            >
              ✕
            </button>
          ) : !showPlanner ? (
            <button
              onClick={handleOpenPlanner}
              className="shrink-0 phone-key flex items-center justify-center leading-none"
              style={{ width: 24, height: 20, background: 'transparent', color: LCD_DARK, border: `1px solid ${LCD_MID}`, fontSize: 14 }}
              title="Plan a hangout"
            >
              📅
            </button>
          ) : null}

          {/* Call button — doubles as undo for 3s after logging */}
          <button
            onClick={justLogged ? handleUndo : handleCall}
            className="shrink-0 ml-0.5 phone-key rounded flex items-center justify-center text-base leading-none"
            style={{
              width: 32, height: 26,
              background: justLogged ? LCD_DARK : '#2a4810',
              color: justLogged ? LCD : '#7de89a',
              border: '1px solid #1d2b00',
              fontFamily: 'inherit',
            }}
            title={justLogged ? 'Tap to undo' : `Reached out to ${person.name} (target: ${targetDays}d)`}
          >
            {justLogged ? '✓' : '☎'}
          </button>
        </div>
      </div>

      {/* Inline date planner */}
      {showPlanner && (
        <div
          className="flex items-center gap-1 px-2 py-1 border-t"
          style={{ borderColor: LCD_MID }}
        >
          <span className="text-xs opacity-50">►</span>
          <input
            type="date"
            value={draftDate}
            onChange={e => setDraftDate(e.target.value)}
            className="flex-1 text-xs px-1 py-0.5 min-w-0"
            style={{
              background: 'transparent',
              color: LCD_DARK,
              border: `1px solid ${LCD_DARK}`,
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          <button
            onClick={handleSavePlan}
            disabled={!draftDate}
            className="text-xs px-1.5 py-0.5 border leading-none"
            style={{ borderColor: LCD_DARK, color: LCD_DARK, background: 'transparent', opacity: draftDate ? 1 : 0.4 }}
          >
            OK
          </button>
          <button
            onClick={() => setShowPlanner(false)}
            className="text-xs px-1 py-0.5 border leading-none"
            style={{ borderColor: LCD_MID, color: LCD_DARK, background: 'transparent' }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
