import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Group, Person, Tier } from '../lib/types'
import { DIAL_NUMS } from '../lib/constants'
import {
  addGroup, updateGroup, deleteGroup, reorderGroups,
  addPerson, updatePerson, deletePerson,
  loadSortedGroups, loadSortedPeople,
} from '../lib/localData'

const LCD = '#c2cf9c'
const LCD_DARK = '#1d2b00'

const TIERS: { value: Tier; label: string }[] = [
  { value: 'gold',  label: '💛LOTS' },
  { value: 'green', label: '💚MED' },
  { value: 'white', label: '🤍WNV' },
]

export default function ManagePage() {
  const [groups, setGroups] = useState<Group[]>(loadSortedGroups)
  const [people, setPeople] = useState<Person[]>(loadSortedPeople)
  const [tab, setTab] = useState<'groups' | 'people'>('groups')

  const refresh = useCallback(() => {
    setGroups(loadSortedGroups())
    setPeople(loadSortedPeople())
  }, [])

  return (
    <div style={{ background: LCD, color: LCD_DARK, minHeight: '100%' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-2 py-1 border-b-2 text-base"
        style={{ borderColor: LCD_DARK }}
      >
        <Link to="/" style={{ color: LCD_DARK }}>◄ BACK</Link>
        <span className="tracking-widest font-bold">MANAGE</span>
      </div>

      {/* Tab bar */}
      <div className="flex border-b-2" style={{ borderColor: LCD_DARK }}>
        {(['groups', 'people'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-1 text-sm tracking-widest border-r-2 last:border-r-0"
            style={{
              borderColor: LCD_DARK,
              background: tab === t ? LCD_DARK : LCD,
              color: tab === t ? LCD : LCD_DARK,
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="p-2">
        {tab === 'groups'
          ? <GroupsTab groups={groups} onRefresh={refresh} />
          : <PeopleTab people={people} groups={groups} onRefresh={refresh} />
        }
      </div>
    </div>
  )
}

const inputStyle = {
  background: LCD, color: LCD_DARK,
  border: `2px solid ${LCD_DARK}`,
  fontFamily: 'inherit', fontSize: 'inherit',
  width: '100%', padding: '2px 6px',
  outline: 'none',
} as const

// ─── Groups ───────────────────────────────────────────────────────────────────

function GroupsTab({ groups, onRefresh }: { groups: Group[]; onRefresh: () => void }) {
  const [editId, setEditId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const handleDelete = (id: string) => {
    if (!confirm('Delete group + all its people?')) return
    deleteGroup(id)
    onRefresh()
  }

  const handleMove = (index: number, dir: -1 | 1) => {
    const ni = index + dir
    if (ni < 0 || ni >= groups.length) return
    const reordered = [...groups]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(ni, 0, moved)
    reorderGroups(reordered.map(g => g.id))
    onRefresh()
  }

  return (
    <div className="space-y-1">
      <div className="text-xs opacity-60 pb-1">DIAL# = speed dial order. ↑↓ to reorder.</div>
      {groups.map((g, i) =>
        editId === g.id ? (
          <GroupForm
            key={g.id}
            initial={g}
            onSave={() => { setEditId(null); onRefresh() }}
            onCancel={() => setEditId(null)}
          />
        ) : (
          <div key={g.id} className="border-2 mb-1" style={{ borderColor: LCD_DARK }}>
            <div
              className="flex items-center justify-between px-1.5 py-0.5"
              style={{ background: LCD_DARK, color: LCD }}
            >
              <div className="flex items-center gap-1 text-base">
                <span>{DIAL_NUMS[i] ?? `${i+1}.`}</span>
                <span className="tracking-wide">{g.name.toUpperCase()}</span>
                <span className="text-xs opacity-60">{TIERS.find(t => t.value === g.tier)?.label}</span>
              </div>
              <div className="flex gap-1 text-sm">
                <button onClick={() => handleMove(i, -1)} disabled={i === 0} style={{ opacity: i === 0 ? 0.3 : 1 }}>↑</button>
                <button onClick={() => handleMove(i, 1)} disabled={i === groups.length - 1} style={{ opacity: i === groups.length - 1 ? 0.3 : 1 }}>↓</button>
              </div>
            </div>
            <div className="flex items-center justify-between px-1.5 py-0.5 text-sm">
              <span className="opacity-60">EVERY {g.target_days}D</span>
              <div className="flex gap-3">
                <button onClick={() => setEditId(g.id)} style={{ color: LCD_DARK }}>EDIT</button>
                <button onClick={() => handleDelete(g.id)} style={{ color: '#5a1010' }}>DEL</button>
              </div>
            </div>
          </div>
        )
      )}

      {showAdd ? (
        <GroupForm onSave={() => { setShowAdd(false); onRefresh() }} onCancel={() => setShowAdd(false)} />
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full py-1.5 text-sm border-2 tracking-widest"
          style={{ borderColor: LCD_DARK, color: LCD_DARK, borderStyle: 'dashed' }}
        >
          + ADD GROUP
        </button>
      )}
    </div>
  )
}

function GroupForm({ initial, onSave, onCancel }: { initial?: Group; onSave: () => void; onCancel: () => void }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [tier, setTier] = useState<Tier>(initial?.tier ?? 'green')
  const [days, setDays] = useState(initial?.target_days ?? 30)

  const handleSave = () => {
    if (!name.trim()) return
    if (initial) {
      updateGroup(initial.id, { name, tier, target_days: days })
    } else {
      addGroup({ name, tier, target_days: days })
    }
    onSave()
  }

  return (
    <div className="border-2 p-2 space-y-2 mb-1" style={{ borderColor: LCD_DARK }}>
      <input
        autoFocus
        type="text"
        placeholder="GROUP NAME"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSave()}
        style={inputStyle}
      />
      <div className="flex gap-1">
        {TIERS.map(t => (
          <button
            key={t.value}
            onClick={() => setTier(t.value)}
            className="flex-1 py-0.5 text-sm border-2"
            style={{
              borderColor: LCD_DARK,
              background: tier === t.value ? LCD_DARK : LCD,
              color: tier === t.value ? LCD : LCD_DARK,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span>EVERY</span>
        <input
          type="number"
          min={1} max={365}
          value={days}
          onChange={e => setDays(Number(e.target.value))}
          style={{ ...inputStyle, width: 56, textAlign: 'center' }}
        />
        <span>DAYS</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="flex-1 py-1 border-2 text-sm tracking-widest"
          style={{ background: LCD_DARK, color: LCD, borderColor: LCD_DARK, opacity: name.trim() ? 1 : 0.4 }}
        >
          SAVE
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1 border-2 text-sm"
          style={{ borderColor: LCD_DARK, color: LCD_DARK }}
        >
          CXL
        </button>
      </div>
    </div>
  )
}

// ─── People ───────────────────────────────────────────────────────────────────

function PeopleTab({ people, groups, onRefresh }: { people: Person[]; groups: Group[]; onRefresh: () => void }) {
  const [editId, setEditId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const handleDelete = (id: string) => {
    if (!confirm('Remove this person?')) return
    deletePerson(id)
    onRefresh()
  }

  const byGroup = groups
    .map(g => ({ group: g, members: people.filter(p => p.group_id === g.id) }))
    .filter(({ members }) => members.length > 0)

  return (
    <div className="space-y-1">
      {groups.length === 0 && (
        <div className="text-sm py-2 border-2 text-center" style={{ borderColor: '#5a3000', color: '#5a3000' }}>
          ADD A GROUP FIRST
        </div>
      )}

      {byGroup.map(({ group, members }) => (
        <div key={group.id}>
          <div
            className="text-xs px-1 py-0.5 tracking-widest"
            style={{ background: '#8fa370', color: LCD_DARK }}
          >
            — {group.name.toUpperCase()} —
          </div>
          {members.map(person =>
            editId === person.id ? (
              <PersonForm
                key={person.id}
                initial={person}
                groups={groups}
                onSave={() => { setEditId(null); onRefresh() }}
                onCancel={() => setEditId(null)}
              />
            ) : (
              <div
                key={person.id}
                className="flex items-center justify-between px-1.5 py-0.5 border-b text-sm"
                style={{ borderColor: '#8fa370' }}
              >
                <div className="min-w-0">
                  <div className="truncate">{person.name}</div>
                  {person.notes && <div className="text-xs opacity-50 truncate">{person.notes}</div>}
                </div>
                <div className="flex gap-3 ml-2 shrink-0">
                  <button onClick={() => setEditId(person.id)}>EDIT</button>
                  <button onClick={() => handleDelete(person.id)} style={{ color: '#5a1010' }}>DEL</button>
                </div>
              </div>
            )
          )}
        </div>
      ))}

      {showAdd ? (
        <PersonForm
          groups={groups}
          onSave={() => { setShowAdd(false); onRefresh() }}
          onCancel={() => setShowAdd(false)}
        />
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          disabled={groups.length === 0}
          className="w-full py-1.5 text-sm border-2 tracking-widest mt-1"
          style={{ borderColor: LCD_DARK, color: LCD_DARK, borderStyle: 'dashed', opacity: groups.length === 0 ? 0.4 : 1 }}
        >
          + ADD PERSON
        </button>
      )}
    </div>
  )
}

function PersonForm({ initial, groups, onSave, onCancel }: { initial?: Person; groups: Group[]; onSave: () => void; onCancel: () => void }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [groupId, setGroupId] = useState(initial?.group_id ?? groups[0]?.id ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [lastContact, setLastContact] = useState(initial?.last_contact ?? '')

  const handleSave = () => {
    if (!name.trim() || !groupId) return
    const data = { name, group_id: groupId, notes: notes || null, last_contact: lastContact || null }
    if (initial) {
      updatePerson(initial.id, data)
    } else {
      addPerson(data)
    }
    onSave()
  }

  return (
    <div className="border-2 p-2 space-y-1.5 my-1" style={{ borderColor: LCD_DARK }}>
      <input
        autoFocus
        type="text"
        placeholder="NAME"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSave()}
        style={inputStyle}
      />
      <select
        value={groupId}
        onChange={e => setGroupId(e.target.value)}
        style={{ ...inputStyle }}
      >
        {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>
      <div className="flex items-center gap-1 text-sm">
        <span className="shrink-0">LAST:</span>
        <input
          type="date"
          value={lastContact}
          onChange={e => setLastContact(e.target.value)}
          style={{ ...inputStyle }}
        />
      </div>
      <textarea
        placeholder="NOTES"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        rows={2}
        style={{ ...inputStyle, resize: 'none' }}
      />
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleSave}
          disabled={!name.trim() || !groupId}
          className="flex-1 py-1 border-2 text-sm tracking-widest"
          style={{ background: LCD_DARK, color: LCD, borderColor: LCD_DARK, opacity: name.trim() && groupId ? 1 : 0.4 }}
        >
          SAVE
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1 border-2 text-sm"
          style={{ borderColor: LCD_DARK, color: LCD_DARK }}
        >
          CXL
        </button>
      </div>
    </div>
  )
}
