let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

const DTMF: Record<string, [number, number]> = {
  '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
  '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
  '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
  '*': [941, 1209], '0': [941, 1336], '#': [941, 1477],
}

export function playDTMF(key: string) {
  const freqs = DTMF[key]
  if (!freqs) return
  const ac = getCtx()
  const now = ac.currentTime
  const gain = ac.createGain()
  gain.gain.setValueAtTime(0.18, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
  gain.connect(ac.destination)
  freqs.forEach(f => {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = f
    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.12)
  })
}

export function playBeep(freq: number, dur: number, vol = 0.2) {
  const ac = getCtx()
  const now = ac.currentTime
  const gain = ac.createGain()
  gain.gain.setValueAtTime(vol, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + dur)
  gain.connect(ac.destination)
  const osc = ac.createOscillator()
  osc.type = 'square'
  osc.frequency.value = freq
  osc.connect(gain)
  osc.start(now)
  osc.stop(now + dur)
}

export function playGameOver() {
  const ac = getCtx()
  const notes = [392, 349, 330, 294]
  let t = ac.currentTime
  notes.forEach(f => {
    const gain = ac.createGain()
    gain.gain.setValueAtTime(0.2, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)
    gain.connect(ac.destination)
    const osc = ac.createOscillator()
    osc.type = 'square'
    osc.frequency.value = f
    osc.connect(gain)
    osc.start(t)
    osc.stop(t + 0.18)
    t += 0.2
  })
}

// Nokia Gran Vals (simplified melody)
const NOKIA: Array<[number, number]> = [
  [659.25, 0.133], [587.33, 0.133], [369.99, 0.267], [415.30, 0.267],
  [554.37, 0.133], [493.88, 0.133], [293.66, 0.267], [329.63, 0.267],
  [493.88, 0.133], [440.00, 0.133], [277.18, 0.267], [329.63, 0.267],
  [440.00, 0.533],
]

let ringingStop: (() => void) | null = null

export function playNokiaRingtone() {
  if (ringingStop) { ringingStop(); ringingStop = null; return }
  const ac = getCtx()
  let t = ac.currentTime
  const oscs: OscillatorNode[] = []
  NOKIA.forEach(([freq, dur]) => {
    const gain = ac.createGain()
    gain.gain.setValueAtTime(0.25, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.9)
    gain.connect(ac.destination)
    const osc = ac.createOscillator()
    osc.type = 'square'
    osc.frequency.value = freq
    osc.connect(gain)
    osc.start(t)
    osc.stop(t + dur)
    oscs.push(osc)
    t += dur
  })
  ringingStop = () => oscs.forEach(o => { try { o.stop() } catch {} })
  setTimeout(() => { ringingStop = null }, t * 1000 + 200)
}
