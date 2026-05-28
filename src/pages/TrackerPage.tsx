import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import type { Group, Person, PersonWithStatus } from '../lib/types'
import { getContactStatus, getDaysSince } from '../lib/utils'
import { updatePerson, loadSortedGroups, loadSortedPeople } from '../lib/localData'
import StatsBar from '../components/StatsBar'
import FilterBar from '../components/FilterBar'
import type { Filter } from '../components/FilterBar'
import GroupSection from '../components/GroupSection'

const LCD = '#c2cf9c'
const LCD_DARK = '#1d2b00'

export default function TrackerPage() {
  const [groups, setGroups] = useState<Group[]>(loadSortedGroups)
  const [people, setPeople] = useState<Person[]>(loadSortedPeople)
  const [filter, setFilter] = useState<Filter>('all')

  const refresh = useCallback(() => {
    setGroups(loadSortedGroups())
    setPeople(loadSortedPeople())
  }, [])

  const handleReachedOut = (personId: string) => {
    updatePerson(personId, { last_contact: format(new Date(), 'yyyy-MM-dd') })
    refresh()
  }

  const handleGroupReachedOut = (groupId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    people.filter(p => p.group_id === groupId).forEach(p => updatePerson(p.id, { last_contact: today }))
    refresh()
  }

  const peopleWithStatus: PersonWithStatus[] = people.map(p => {
    const group = groups.find(g => g.id === p.group_id)
    return {
      ...p,
      status: getContactStatus(p.last_contact, group?.target_days ?? 30),
      daysSince: getDaysSince(p.last_contact),
    }
  })

  const visiblePeople = peopleWithStatus.filter(p => {
    if (filter === 'all') return true
    if (filter === 'overdue') return p.status === 'overdue'
    const group = groups.find(g => g.id === p.group_id)
    return group?.tier === filter
  })

  const visibleGroups = groups.filter(g => visiblePeople.some(p => p.group_id === g.id))

  return (
    <div style={{ background: LCD, color: LCD_DARK, minHeight: '100%' }}>
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-2 py-1 border-b-2 text-base"
        style={{ borderColor: LCD_DARK }}
      >
        <span className="tracking-widest font-bold">SPEED DIAL</span>
        <Link
          to="/manage"
          className="px-2 py-0.5 text-sm border-2"
          style={{ borderColor: LCD_DARK, color: LCD_DARK }}
        >
          MANAGE
        </Link>
      </div>

      <StatsBar people={peopleWithStatus} />
      <FilterBar active={filter} onChange={setFilter} />

      {/* Group list */}
      <div>
        {visibleGroups.length === 0 ? (
          <EmptyState filter={filter} hasPeople={people.length > 0} />
        ) : (
          visibleGroups.map((group, i) => (
            <GroupSection
              key={group.id}
              group={group}
              dialNumber={i + 1}
              people={visiblePeople.filter(p => p.group_id === group.id)}
              onReachedOut={handleReachedOut}
              onGroupReachedOut={handleGroupReachedOut}
            />
          ))
        )}
      </div>
    </div>
  )
}

function EmptyState({ filter, hasPeople }: { filter: Filter; hasPeople: boolean }) {
  const isAllClear = filter === 'overdue' && hasPeople
  return (
    <div
      className="flex flex-col items-center justify-center py-12 text-center"
      style={{ color: '#1d2b00' }}
    >
      <div className="text-4xl mb-2">{isAllClear ? '■' : '□'}</div>
      <div className="text-base tracking-widest">
        {isAllClear ? 'ALL CLEAR!' : !hasPeople ? 'NO CONTACTS' : 'NO MATCH'}
      </div>
      {!hasPeople && (
        <Link
          to="/manage"
          className="mt-3 px-3 py-1 text-sm border-2"
          style={{ borderColor: '#1d2b00', color: '#1d2b00' }}
        >
          → ADD PEEPS
        </Link>
      )}
    </div>
  )
}
