export type Tier = 'gold' | 'green' | 'white'
export type ContactStatus = 'good' | 'due' | 'overdue'

export interface Group {
  id: string
  user_id: string
  name: string
  tier: Tier
  target_days: number
  sort_order: number
}

export interface Person {
  id: string
  user_id: string
  group_id: string
  name: string
  last_contact: string | null
  notes: string | null
}

export interface PersonWithStatus extends Person {
  status: ContactStatus
  daysSince: number | null
}
