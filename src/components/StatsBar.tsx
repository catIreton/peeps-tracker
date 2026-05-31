import type { PersonWithStatus } from '../lib/types'

interface StatsBarProps { people: PersonWithStatus[] }

export default function StatsBar({ people }: StatsBarProps) {
  const good    = people.filter(p => p.status === 'good').length
  const due     = people.filter(p => p.status === 'due').length
  const overdue = people.filter(p => p.status === 'overdue').length

  return (
    <div
      className="flex items-center justify-around py-1 text-base border-b-2"
      style={{ borderColor: '#1d2b00', color: '#1d2b00' }}
    >
      <span title="Contacted within target">● {good} CURRENT</span>
      <span style={{ color: '#3d4d00' }}>│</span>
      <span title="Contact due soon">◐ {due} DUE</span>
      <span style={{ color: '#3d4d00' }}>│</span>
      <span title="Contact overdue" style={{ fontWeight: 'bold' }}>○ {overdue} OVERDUE</span>
    </div>
  )
}
