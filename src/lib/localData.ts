import type { Group, Hangout, Person } from './types'

const GROUPS_KEY = 'peeps:groups'
const PEOPLE_KEY = 'peeps:people'
const HANGOUTS_KEY = 'peeps:hangouts'

export function getGroups(): Group[] {
  try {
    const raw = localStorage.getItem(GROUPS_KEY)
    return raw ? (JSON.parse(raw) as Group[]) : []
  } catch {
    return []
  }
}

export function getPeople(): Person[] {
  try {
    const raw = localStorage.getItem(PEOPLE_KEY)
    return raw ? (JSON.parse(raw) as Person[]) : []
  } catch {
    return []
  }
}

function saveGroups(groups: Group[]) {
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups))
}

function savePeopleList(people: Person[]) {
  localStorage.setItem(PEOPLE_KEY, JSON.stringify(people))
}

export function addGroup(data: Pick<Group, 'name' | 'tier' | 'target_days'>): Group {
  const groups = getGroups()
  const maxOrder = groups.reduce((m, g) => Math.max(m, g.sort_order), -1)
  const group: Group = { id: crypto.randomUUID(), user_id: 'local', sort_order: maxOrder + 1, ...data }
  saveGroups([...groups, group])
  return group
}

export function updateGroup(id: string, data: Partial<Pick<Group, 'name' | 'tier' | 'target_days' | 'sort_order'>>) {
  saveGroups(getGroups().map(g => (g.id === id ? { ...g, ...data } : g)))
}

export function deleteGroup(id: string) {
  saveGroups(getGroups().filter(g => g.id !== id))
  savePeopleList(getPeople().filter(p => p.group_id !== id))
}

export function reorderGroups(orderedIds: string[]) {
  const groups = getGroups()
  const byId = Object.fromEntries(groups.map(g => [g.id, g]))
  saveGroups(orderedIds.map((id, i) => ({ ...byId[id], sort_order: i })))
}

export function addPerson(data: Pick<Person, 'name' | 'group_id' | 'notes' | 'last_contact'>): Person {
  const person: Person = { id: crypto.randomUUID(), user_id: 'local', ...data }
  savePeopleList([...getPeople(), person])
  return person
}

export function updatePerson(id: string, data: Partial<Pick<Person, 'name' | 'group_id' | 'notes' | 'last_contact' | 'skipped'>>) {
  savePeopleList(getPeople().map(p => (p.id === id ? { ...p, ...data } : p)))
}

export function deletePerson(id: string) {
  savePeopleList(getPeople().filter(p => p.id !== id))
}

export function getHangouts(): Hangout[] {
  try {
    const raw = localStorage.getItem(HANGOUTS_KEY)
    return raw ? (JSON.parse(raw) as Hangout[]) : []
  } catch {
    return []
  }
}

function saveHangouts(hangouts: Hangout[]) {
  localStorage.setItem(HANGOUTS_KEY, JSON.stringify(hangouts))
}

// Upserts — one hangout per person
export function setHangout(personId: string, date: string): void {
  const rest = getHangouts().filter(h => h.person_id !== personId)
  saveHangouts([...rest, { id: crypto.randomUUID(), person_id: personId, date }])
}

export function clearHangout(personId: string): void {
  saveHangouts(getHangouts().filter(h => h.person_id !== personId))
}

// Pre-sorted views used by both TrackerPage and ManagePage
export function loadSortedGroups(): Group[] {
  return getGroups().sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
}

export function loadSortedPeople(): Person[] {
  return getPeople().sort((a, b) => a.name.localeCompare(b.name))
}
