import { useState } from 'react'
import type { PersonWithStatus } from '../lib/types'
import { formatDaysAgo } from '../lib/utils'

interface PersonCardProps {
  person: PersonWithStatus
  targetDays: number  // shown in tooltip / future use
  onReachedOut: (id: string) => void
}

// Nokia LCD-style status glyphs
const STATUS_GLYPH: Record<string, string> = {
  good: '●',
  due:  '◐',
  overdue: '○',
}

export default function PersonCard({ person, targetDays, onReachedOut }: PersonCardProps) {
  const [justLogged, setJustLogged] = useState(false)
  const [flashing, setFlashing] = useState(false)

  const handleClick = () => {
    onReachedOut(person.id)
    setFlashing(true)
    setTimeout(() => setFlashing(false), 100)
    setJustLogged(true)
    setTimeout(() => setJustLogged(false), 2000)
  }

  const daysText = person.daysSince !== null
    ? formatDaysAgo(person.daysSince)
    : 'NEVER'

  return (
    <div
      className="flex items-center justify-between px-2 py-1 border-b"
      style={{
        borderColor: '#8fa370',
        background: flashing ? '#1d2b00' : 'transparent',
        color: flashing ? '#c2cf9c' : '#1d2b00',
        transition: 'background 50ms',
      }}
    >
      {/* Status glyph + name + days */}
      <div className="flex items-baseline gap-1.5 min-w-0 text-base leading-tight">
        <span className="shrink-0 text-sm">{STATUS_GLYPH[person.status]}</span>
        <span className="truncate">{person.name}</span>
        <span className="shrink-0 text-xs opacity-60">{daysText}</span>
      </div>

      {/* Call button — styled like a Nokia key */}
      <button
        onClick={handleClick}
        className="shrink-0 ml-2 phone-key rounded flex items-center justify-center text-base leading-none"
        style={{
          width: 32,
          height: 26,
          background: justLogged ? '#1d2b00' : '#2a4810',
          color: justLogged ? '#c2cf9c' : '#7de89a',
          border: '1px solid #1d2b00',
          fontFamily: 'inherit',
        }}
        title={`Reached out to ${person.name} (target: ${targetDays}d)`}
      >
        {justLogged ? '✓' : '☎'}
      </button>
    </div>
  )
}
