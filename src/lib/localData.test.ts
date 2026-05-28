import { describe, it, expect, beforeEach } from 'vitest'
import {
  getGroups, addGroup, updateGroup, deleteGroup, reorderGroups, loadSortedGroups,
  getPeople, addPerson, updatePerson, deletePerson, loadSortedPeople,
} from './localData'

beforeEach(() => localStorage.clear())

// ─── Groups ───────────────────────────────────────────────────────────────────

describe('getGroups', () => {
  it('returns empty array when storage is empty', () => {
    expect(getGroups()).toEqual([])
  })

  it('returns empty array when storage is corrupt', () => {
    localStorage.setItem('peeps:groups', 'not-json')
    expect(getGroups()).toEqual([])
  })
})

describe('addGroup', () => {
  it('creates a group with a generated id', () => {
    const g = addGroup({ name: 'Close Friends', tier: 'gold', target_days: 14 })
    expect(g.id).toBeTruthy()
    expect(g.name).toBe('Close Friends')
    expect(g.tier).toBe('gold')
    expect(g.target_days).toBe(14)
    expect(g.sort_order).toBe(0)
    expect(g.user_id).toBe('local')
  })

  it('increments sort_order for each new group', () => {
    const g1 = addGroup({ name: 'A', tier: 'gold', target_days: 14 })
    const g2 = addGroup({ name: 'B', tier: 'green', target_days: 30 })
    const g3 = addGroup({ name: 'C', tier: 'white', target_days: 90 })
    expect(g1.sort_order).toBe(0)
    expect(g2.sort_order).toBe(1)
    expect(g3.sort_order).toBe(2)
  })

  it('persists to storage', () => {
    addGroup({ name: 'Test', tier: 'green', target_days: 30 })
    expect(getGroups()).toHaveLength(1)
  })
})

describe('updateGroup', () => {
  it('updates specified fields only', () => {
    const g = addGroup({ name: 'Test', tier: 'gold', target_days: 14 })
    updateGroup(g.id, { name: 'Updated', target_days: 21 })
    const updated = getGroups()[0]
    expect(updated.name).toBe('Updated')
    expect(updated.target_days).toBe(21)
    expect(updated.tier).toBe('gold')
  })

  it('ignores unknown ids', () => {
    addGroup({ name: 'Test', tier: 'gold', target_days: 14 })
    updateGroup('nonexistent', { name: 'X' })
    expect(getGroups()[0].name).toBe('Test')
  })
})

describe('deleteGroup', () => {
  it('removes the group', () => {
    const g = addGroup({ name: 'Test', tier: 'gold', target_days: 14 })
    deleteGroup(g.id)
    expect(getGroups()).toEqual([])
  })

  it('cascades to delete all people in that group', () => {
    const g = addGroup({ name: 'Test', tier: 'gold', target_days: 14 })
    addPerson({ name: 'Alice', group_id: g.id, notes: null, last_contact: null })
    addPerson({ name: 'Bob', group_id: g.id, notes: null, last_contact: null })
    deleteGroup(g.id)
    expect(getPeople()).toEqual([])
  })

  it('does not delete people from other groups', () => {
    const g1 = addGroup({ name: 'A', tier: 'gold', target_days: 14 })
    const g2 = addGroup({ name: 'B', tier: 'green', target_days: 30 })
    addPerson({ name: 'Alice', group_id: g1.id, notes: null, last_contact: null })
    addPerson({ name: 'Bob',   group_id: g2.id, notes: null, last_contact: null })
    deleteGroup(g1.id)
    const remaining = getPeople()
    expect(remaining).toHaveLength(1)
    expect(remaining[0].name).toBe('Bob')
  })
})

describe('reorderGroups', () => {
  it('reassigns sort_order based on provided order', () => {
    const g1 = addGroup({ name: 'A', tier: 'gold', target_days: 14 })
    const g2 = addGroup({ name: 'B', tier: 'green', target_days: 30 })
    reorderGroups([g2.id, g1.id])
    const groups = getGroups()
    expect(groups.find(g => g.name === 'B')!.sort_order).toBe(0)
    expect(groups.find(g => g.name === 'A')!.sort_order).toBe(1)
  })
})

describe('loadSortedGroups', () => {
  it('returns groups sorted by sort_order', () => {
    const g1 = addGroup({ name: 'Z First', tier: 'gold', target_days: 14 })
    const g2 = addGroup({ name: 'A Second', tier: 'green', target_days: 30 })
    reorderGroups([g2.id, g1.id])
    const sorted = loadSortedGroups()
    expect(sorted[0].name).toBe('A Second')
    expect(sorted[1].name).toBe('Z First')
  })

  it('breaks sort_order ties by name', () => {
    // Manually force same sort_order by corrupting storage
    const g1 = addGroup({ name: 'Beta', tier: 'gold', target_days: 14 })
    const g2 = addGroup({ name: 'Alpha', tier: 'gold', target_days: 14 })
    updateGroup(g1.id, { sort_order: 0 })
    updateGroup(g2.id, { sort_order: 0 })
    const sorted = loadSortedGroups()
    expect(sorted[0].name).toBe('Alpha')
  })
})

// ─── People ───────────────────────────────────────────────────────────────────

describe('getPeople', () => {
  it('returns empty array when storage is empty', () => {
    expect(getPeople()).toEqual([])
  })
})

describe('addPerson', () => {
  it('creates a person with a generated id', () => {
    const g = addGroup({ name: 'Test', tier: 'gold', target_days: 14 })
    const p = addPerson({ name: 'Alice', group_id: g.id, notes: 'note', last_contact: '2025-01-01' })
    expect(p.id).toBeTruthy()
    expect(p.name).toBe('Alice')
    expect(p.group_id).toBe(g.id)
    expect(p.notes).toBe('note')
    expect(p.last_contact).toBe('2025-01-01')
    expect(p.user_id).toBe('local')
  })
})

describe('updatePerson', () => {
  it('updates specified fields only', () => {
    const g = addGroup({ name: 'Test', tier: 'gold', target_days: 14 })
    const p = addPerson({ name: 'Alice', group_id: g.id, notes: null, last_contact: null })
    updatePerson(p.id, { last_contact: '2025-06-01' })
    const updated = getPeople()[0]
    expect(updated.last_contact).toBe('2025-06-01')
    expect(updated.name).toBe('Alice')
  })
})

describe('deletePerson', () => {
  it('removes only the specified person', () => {
    const g = addGroup({ name: 'Test', tier: 'gold', target_days: 14 })
    const p1 = addPerson({ name: 'Alice', group_id: g.id, notes: null, last_contact: null })
    addPerson({ name: 'Bob', group_id: g.id, notes: null, last_contact: null })
    deletePerson(p1.id)
    const remaining = getPeople()
    expect(remaining).toHaveLength(1)
    expect(remaining[0].name).toBe('Bob')
  })
})

describe('loadSortedPeople', () => {
  it('returns people sorted alphabetically by name', () => {
    const g = addGroup({ name: 'Test', tier: 'gold', target_days: 14 })
    addPerson({ name: 'Zara', group_id: g.id, notes: null, last_contact: null })
    addPerson({ name: 'Alice', group_id: g.id, notes: null, last_contact: null })
    addPerson({ name: 'Mike', group_id: g.id, notes: null, last_contact: null })
    const sorted = loadSortedPeople()
    expect(sorted.map(p => p.name)).toEqual(['Alice', 'Mike', 'Zara'])
  })
})
