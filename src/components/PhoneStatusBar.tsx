import { useEffect, useState } from 'react'

// Nokia-style signal bars using block chars
const SIGNAL = '▁▃▅▇'
const BATTERY = '▐██▌'

export default function PhoneStatusBar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="flex items-center justify-between px-2 py-0.5 text-sm"
      style={{ background: '#1d2b00', color: '#c2cf9c' }}
    >
      <span className="tracking-tight opacity-80">{SIGNAL}</span>
      <span className="tracking-[0.15em] text-xs">☎ PEEPS DIAL</span>
      <span className="tabular-nums text-xs">{time} {BATTERY}</span>
    </div>
  )
}
