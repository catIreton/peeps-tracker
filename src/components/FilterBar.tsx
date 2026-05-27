export type Filter = 'all' | 'gold' | 'green' | 'white' | 'overdue'

interface FilterBarProps {
  active: Filter
  onChange: (f: Filter) => void
}

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all',     label: 'ALL' },
  { id: 'gold',    label: '💛LOTS' },
  { id: 'green',   label: '💚MED' },
  { id: 'white',   label: '🤍WNV' },
  { id: 'overdue', label: '!!OVR' },
]

export default function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div
      className="flex gap-1 px-1 py-1.5 overflow-x-auto border-b-2"
      style={{ borderColor: '#1d2b00' }}
    >
      {FILTERS.map(f => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className="shrink-0 px-2 py-0.5 text-sm border-2 transition-none"
          style={
            active === f.id
              ? { background: '#1d2b00', color: '#c2cf9c', borderColor: '#1d2b00' }
              : { background: 'transparent', color: '#1d2b00', borderColor: '#1d2b00' }
          }
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
