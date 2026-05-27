import { useState } from 'react'
import type { Group, PersonWithStatus, Tier } from '../lib/types'
import PersonCard from './PersonCard'

interface GroupSectionProps {
  group: Group
  dialNumber: number
  people: PersonWithStatus[]
  onReachedOut: (personId: string) => void
  onGroupReachedOut: (groupId: string) => void
}

const TIER_LABEL: Record<Tier, string> = {
  gold: '💛LOTS',
  green: '💚MED',
  white: '🤍WNV',
}

const DIAL_NUMS = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫']

export default function GroupSection({ group, dialNumber, people, onReachedOut, onGroupReachedOut }: GroupSectionProps) {
  const [justLogged, setJustLogged] = useState(false)

  const handleDialAll = () => {
    onGroupReachedOut(group.id)
    setJustLogged(true)
    setTimeout(() => setJustLogged(false), 2000)
  }

  const sorted = [...people].sort((a, b) => {
    const order = { overdue: 0, due: 1, good: 2 }
    return order[a.status] - order[b.status]
  })

  const dialLabel = DIAL_NUMS[dialNumber - 1] ?? `${dialNumber}.`

  return (
    <div className="border-b-2" style={{ borderColor: '#1d2b00' }}>
      {/* Inverted Nokia-style header */}
      <div
        className="flex items-center justify-between px-2 py-1"
        style={{ background: '#1d2b00', color: '#c2cf9c' }}
      >
        <div className="flex items-center gap-1.5 text-base leading-none">
          <span className="text-lg">{dialLabel}</span>
          <span className="tracking-wide">{group.name.toUpperCase()}</span>
          <span className="text-xs opacity-60 ml-1">{TIER_LABEL[group.tier]}</span>
        </div>
        <button
          onClick={handleDialAll}
          className="text-xs px-1.5 py-0.5 border leading-none"
          style={
            justLogged
              ? { background: '#c2cf9c', color: '#1d2b00', borderColor: '#c2cf9c' }
              : { background: 'transparent', color: '#c2cf9c', borderColor: '#c2cf9c' }
          }
        >
          {justLogged ? '✓ALL' : '☎ALL'}
        </button>
      </div>

      {/* Person rows */}
      {sorted.map(person => (
        <PersonCard
          key={person.id}
          person={person}
          targetDays={group.target_days}
          onReachedOut={onReachedOut}
        />
      ))}
    </div>
  )
}
