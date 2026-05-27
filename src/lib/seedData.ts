import type { Group, Person } from './types'

// ── Groups ────────────────────────────────────────────────────────────────────
//   target_days: gold ≈ 14d (biweekly), green ≈ 60d (every 2mo), white ≈ 90d (quarterly)

export const SEED_GROUPS: Group[] = [
  // 💛 Lots ──────────────────────────────────────────────
  { id: 'g-fab-five',       user_id: 'local', name: 'Scooby Gang',          tier: 'gold',  target_days: 14, sort_order: 0 },
  { id: 'g-jerad-friends',  user_id: 'local', name: 'Peach Pit Crew',       tier: 'gold',  target_days: 14, sort_order: 1 },
  { id: 'g-family-gold',    user_id: 'local', name: 'Tanner Family',         tier: 'gold',  target_days: 14, sort_order: 2 },
  { id: 'g-naomi-adam',     user_id: 'local', name: 'Topanga & Cory',        tier: 'gold',  target_days: 30, sort_order: 3 },
  { id: 'g-eugene-paige',   user_id: 'local', name: 'Cher & Murray',         tier: 'gold',  target_days: 30, sort_order: 4 },
  // 💚 Medium ────────────────────────────────────────────
  { id: 'g-abilene-green',  user_id: 'local', name: 'The Max Crew',          tier: 'green', target_days: 56, sort_order: 5 },
  { id: 'g-jerad-fam-g',    user_id: 'local', name: 'Matthews Fam',          tier: 'green', target_days: 60, sort_order: 6 },
  { id: 'g-kohaus',         user_id: 'local', name: 'Winslow Clan',          tier: 'green', target_days: 60, sort_order: 7 },
  { id: 'g-sam',            user_id: 'local', name: 'Skeeter',               tier: 'green', target_days: 60, sort_order: 8 },
  { id: 'g-scurvy',         user_id: 'local', name: 'Spice Force',           tier: 'green', target_days: 60, sort_order: 9 },
  // 🤍 Whenever ──────────────────────────────────────────
  { id: 'g-old-school',     user_id: 'local', name: 'OG Peeps',              tier: 'white', target_days: 90, sort_order: 10 },
  { id: 'g-dst',            user_id: 'local', name: 'Valley High Alumni',    tier: 'white', target_days: 90, sort_order: 11 },
  { id: 'g-mail-center',    user_id: 'local', name: 'Capeside Crew',         tier: 'white', target_days: 90, sort_order: 12 },
  { id: 'g-abilene-white',  user_id: 'local', name: 'Sunnydale Whenevs',     tier: 'white', target_days: 90, sort_order: 13 },
  { id: 'g-facebook',       user_id: 'local', name: 'AOL Buddies',           tier: 'white', target_days: 90, sort_order: 14 },
  { id: 'g-family-white',   user_id: 'local', name: 'Banks Family',          tier: 'white', target_days: 90, sort_order: 15 },
  { id: 'g-jerad-fam-w',    user_id: 'local', name: 'Winslow Extended',      tier: 'white', target_days: 90, sort_order: 16 },
  { id: 'g-others',         user_id: 'local', name: 'Miscellaneous Peeps',   tier: 'white', target_days: 90, sort_order: 17 },
]

// ── People ────────────────────────────────────────────────────────────────────
// Couples are stored as single entries (e.g. "Dylan & Brenda") — one ☎ tap covers both.

export const SEED_PEOPLE: Person[] = [
  // 💛 Scooby Gang
  { id: 'p-aarti',          user_id: 'local', group_id: 'g-fab-five',      name: 'Buffy',                   last_contact: null, notes: null },
  { id: 'p-allisa',         user_id: 'local', group_id: 'g-fab-five',      name: 'Willow',                  last_contact: null, notes: null },
  { id: 'p-iris',           user_id: 'local', group_id: 'g-fab-five',      name: 'Xander',                  last_contact: null, notes: null },
  { id: 'p-yochi',          user_id: 'local', group_id: 'g-fab-five',      name: 'Cordelia',                last_contact: null, notes: null },

  // 💛 Peach Pit Crew
  { id: 'p-aaron-debbie',   user_id: 'local', group_id: 'g-jerad-friends', name: 'Dylan & Brenda',          last_contact: null, notes: null },
  { id: 'p-dave-erika',     user_id: 'local', group_id: 'g-jerad-friends', name: 'Brandon & Kelly',         last_contact: null, notes: null },
  { id: 'p-jason-ranee',    user_id: 'local', group_id: 'g-jerad-friends', name: 'Steve & Andrea',          last_contact: null, notes: null },
  { id: 'p-kendal-robin',   user_id: 'local', group_id: 'g-jerad-friends', name: 'Donna & David',           last_contact: null, notes: null },
  { id: 'p-wade-robin',     user_id: 'local', group_id: 'g-jerad-friends', name: 'Jackie & Hyde',           last_contact: null, notes: null },

  // 💛 Tanner Family
  { id: 'p-liz',            user_id: 'local', group_id: 'g-family-gold',   name: 'DJ',                      last_contact: null, notes: null },
  { id: 'p-lydia',          user_id: 'local', group_id: 'g-family-gold',   name: 'Stephanie',               last_contact: null, notes: null },
  { id: 'p-violet',         user_id: 'local', group_id: 'g-family-gold',   name: 'Michelle',                last_contact: null, notes: null },
  { id: 'p-lucas',          user_id: 'local', group_id: 'g-family-gold',   name: 'Kimmy',                   last_contact: null, notes: null },

  // 💛 Topanga & Cory
  { id: 'p-naomi-adam',     user_id: 'local', group_id: 'g-naomi-adam',    name: 'Topanga & Cory',          last_contact: null, notes: 'Monthly pizza and game night' },

  // 💛 Cher & Murray
  { id: 'p-eugene-paige',   user_id: 'local', group_id: 'g-eugene-paige',  name: 'Cher & Murray',           last_contact: null, notes: null },

  // 💚 The Max Crew
  { id: 'p-lee-kim',        user_id: 'local', group_id: 'g-abilene-green', name: 'Zack & Kelly',            last_contact: null, notes: null },
  { id: 'p-nicole-ab',      user_id: 'local', group_id: 'g-abilene-green', name: 'Screech',                 last_contact: null, notes: 'Sometimes just Zack & Kelly, sometimes the whole gang' },

  // 💚 Matthews Fam
  { id: 'p-abby-fam',       user_id: 'local', group_id: 'g-jerad-fam-g',   name: 'Shawn & Fam',             last_contact: null, notes: null },
  { id: 'p-justina-fam',    user_id: 'local', group_id: 'g-jerad-fam-g',   name: 'Angela & Fam',            last_contact: null, notes: null },
  { id: 'p-raeleigh',       user_id: 'local', group_id: 'g-jerad-fam-g',   name: 'Minkus',                  last_contact: null, notes: null },
  { id: 'p-marilyn-larry',  user_id: 'local', group_id: 'g-jerad-fam-g',   name: 'Mr & Mrs Feeny',          last_contact: null, notes: null },

  // 💚 Winslow Clan
  { id: 'p-mimi-dale',      user_id: 'local', group_id: 'g-kohaus',        name: 'Aunt Harriette & Uncle Carl', last_contact: null, notes: null },
  { id: 'p-jamie-clyde',    user_id: 'local', group_id: 'g-kohaus',        name: 'Laura & Steve',           last_contact: null, notes: null },
  { id: 'p-jim',            user_id: 'local', group_id: 'g-kohaus',        name: 'Eddie',                   last_contact: null, notes: null },

  // 💚 Skeeter
  { id: 'p-sam',            user_id: 'local', group_id: 'g-sam',           name: 'Skeeter',                 last_contact: null, notes: null },

  // 💚 Spice Force — no individual names listed; add them in Manage
  // (group exists, members TBD)

  // 🤍 OG Peeps
  { id: 'p-kyle-natalie',   user_id: 'local', group_id: 'g-old-school',    name: 'Kevin & Winnie',          last_contact: null, notes: null },
  { id: 'p-shawn',          user_id: 'local', group_id: 'g-old-school',    name: 'Paul',                    last_contact: null, notes: null },

  // 🤍 Valley High Alumni
  { id: 'p-becky-group',    user_id: 'local', group_id: 'g-dst',           name: 'Phoebe & Monica',         last_contact: null, notes: null },
  { id: 'p-jane-sheila',    user_id: 'local', group_id: 'g-dst',           name: 'Rachel & Ross',           last_contact: null, notes: null },
  { id: 'p-linda',          user_id: 'local', group_id: 'g-dst',           name: 'Chandler',                last_contact: null, notes: null },

  // 🤍 Capeside Crew
  { id: 'p-michelle-josh',  user_id: 'local', group_id: 'g-mail-center',   name: 'Dawson & Joey',           last_contact: null, notes: null },
  { id: 'p-peter',          user_id: 'local', group_id: 'g-mail-center',   name: 'Pacey',                   last_contact: null, notes: null },

  // 🤍 Sunnydale Whenevs
  { id: 'p-angie',          user_id: 'local', group_id: 'g-abilene-white', name: 'Spinelli',                last_contact: null, notes: null },
  { id: 'p-mary-jane',      user_id: 'local', group_id: 'g-abilene-white', name: 'Gretchen',               last_contact: null, notes: null },
  { id: 'p-kristen',        user_id: 'local', group_id: 'g-abilene-white', name: 'TJ',                      last_contact: null, notes: null },
  { id: 'p-mandy',          user_id: 'local', group_id: 'g-abilene-white', name: 'Vince',                   last_contact: null, notes: null },
  { id: 'p-shawna',         user_id: 'local', group_id: 'g-abilene-white', name: 'Mikey',                   last_contact: null, notes: null },

  // 🤍 AOL Buddies
  { id: 'p-kat-fb',         user_id: 'local', group_id: 'g-facebook',      name: 'Daria',                   last_contact: null, notes: null },
  { id: 'p-stephanie',      user_id: 'local', group_id: 'g-facebook',      name: 'Jane',                    last_contact: null, notes: null },

  // 🤍 Banks Family
  { id: 'p-aedin',          user_id: 'local', group_id: 'g-family-white',  name: 'Carlton',                 last_contact: null, notes: null },
  { id: 'p-paige-fam',      user_id: 'local', group_id: 'g-family-white',  name: 'Hilary & Fam',            last_contact: null, notes: 'Ashley, Nicky, Alex' },
  { id: 'p-scott-fw',       user_id: 'local', group_id: 'g-family-white',  name: 'Will',                    last_contact: null, notes: null },
  { id: 'p-zaynah',         user_id: 'local', group_id: 'g-family-white',  name: 'Geoffrey',                last_contact: null, notes: null },
  { id: 'p-falaena',        user_id: 'local', group_id: 'g-family-white',  name: 'Jazz',                    last_contact: null, notes: null },
  { id: 'p-jackie',         user_id: 'local', group_id: 'g-family-white',  name: 'Lisa',                    last_contact: null, notes: null },

  // 🤍 Winslow Extended
  { id: 'p-dave-jfw',       user_id: 'local', group_id: 'g-jerad-fam-w',   name: 'Waldo',                   last_contact: null, notes: null },
  { id: 'p-jalinda-fam',    user_id: 'local', group_id: 'g-jerad-fam-w',   name: 'Judy & Fam',              last_contact: null, notes: null },
  { id: 'p-jason-tabitha',  user_id: 'local', group_id: 'g-jerad-fam-w',   name: 'Urkel & Myra',            last_contact: null, notes: null },
  { id: 'p-justin-tanya',   user_id: 'local', group_id: 'g-jerad-fam-w',   name: 'Maxine & Bobby',          last_contact: null, notes: null },
  { id: 'p-kat-haskett',    user_id: 'local', group_id: 'g-jerad-fam-w',   name: 'Rachel',                  last_contact: null, notes: null },
  { id: 'p-scott-julie',    user_id: 'local', group_id: 'g-jerad-fam-w',   name: 'Steve & Barb',            last_contact: null, notes: null },

  // 🤍 Miscellaneous Peeps
  { id: 'p-aaron-christyle',user_id: 'local', group_id: 'g-others',        name: 'Blossom & Six',           last_contact: null, notes: null },
  { id: 'p-casey-o',        user_id: 'local', group_id: 'g-others',        name: 'Clarissa',                last_contact: null, notes: null },
  { id: 'p-jan',            user_id: 'local', group_id: 'g-others',        name: 'Sabrina',                 last_contact: null, notes: null },
  { id: 'p-kevin-casey',    user_id: 'local', group_id: 'g-others',        name: 'Zack & AC',               last_contact: null, notes: null },
  { id: 'p-meg-dan',        user_id: 'local', group_id: 'g-others',        name: 'Felicity & Noel',         last_contact: null, notes: null },
  { id: 'p-nathan-sarah',   user_id: 'local', group_id: 'g-others',        name: 'Dawson & Jen',            last_contact: null, notes: null },
  { id: 'p-uplight',        user_id: 'local', group_id: 'g-others',        name: 'Bayside Peeps',           last_contact: null, notes: null },
]

export function seedIfEmpty() {
  const existing = localStorage.getItem('peeps:groups')
  const isEmpty = !existing || (JSON.parse(existing) as unknown[]).length === 0
  if (isEmpty) {
    localStorage.setItem('peeps:groups', JSON.stringify(SEED_GROUPS))
    localStorage.setItem('peeps:people', JSON.stringify(SEED_PEOPLE))
  }
}

export function forceSeed() {
  localStorage.setItem('peeps:groups', JSON.stringify(SEED_GROUPS))
  localStorage.setItem('peeps:people', JSON.stringify(SEED_PEOPLE))
}
