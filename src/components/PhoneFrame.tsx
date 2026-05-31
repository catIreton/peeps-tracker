import { useState, useCallback } from 'react'
import PhoneStatusBar from './PhoneStatusBar'
import SnakeGame from './SnakeGame'
import { playDTMF, playNokiaRingtone } from '../lib/audio'

interface Props { children: React.ReactNode }

const KEYS = [
  { k: '1', s: '' },   { k: '2', s: 'ABC' }, { k: '3', s: 'DEF' },
  { k: '4', s: 'GHI' },{ k: '5', s: 'JKL' }, { k: '6', s: 'MNO' },
  { k: '7', s: 'PQRS'},{ k: '8', s: 'TUV' }, { k: '9', s: 'WXYZ'},
  { k: '*', s: '' },   { k: '0', s: '+' },   { k: '#', s: '' },
]

type EasterEgg = 'imei' | 'firmware' | 'secret' | 'codes' | null

const OVERLAYS: Record<NonNullable<EasterEgg>, string[]> = {
  imei:     ['IMEI: 350926-04-821009-8', 'S/N: 0501240-10', '', 'WARRANTY: OK'],
  firmware: ['V 05.31', '27-11-98', 'NSM-1', '', 'NOKIA MOBILE'],
  secret:   ['YOU FOUND IT!', '', '☎ KEEP IN TOUCH', '♥ PEEPS TRACKER'],
  codes:    ['── SECRET CODES ──', '', '*#06#  DEVICE INFO', '*#0000#  FIRMWARE', '*#99#  SECRET MSG', '5555  SNAKE GAME', '112  RINGTONE'],
}

export default function PhoneFrame({ children }: Props) {
  const [keyBuffer, setKeyBuffer] = useState('')
  const [snakeActive, setSnakeActive] = useState(false)
  const [easterEgg, setEasterEgg] = useState<EasterEgg>(null)
  const [keySignal, setKeySignal] = useState<{ key: string; seq: number } | null>(null)

  const checkCodes = useCallback((buf: string) => {
    if (buf.endsWith('*#06#')) { setEasterEgg('imei'); setTimeout(() => setEasterEgg(null), 4000); return }
    if (buf.endsWith('*#0000#')) { setEasterEgg('firmware'); setTimeout(() => setEasterEgg(null), 4000); return }
    if (buf.endsWith('*#99#')) { setEasterEgg('secret'); setTimeout(() => setEasterEgg(null), 4000); return }
    if (buf.endsWith('5555')) { setSnakeActive(true); return }
    if (buf.endsWith('112')) { playNokiaRingtone(); return }
  }, [])

  const handleKey = useCallback((key: string) => {
    playDTMF(key)
    const newBuf = (keyBuffer + key).slice(-12)
    setKeyBuffer(newBuf)
    checkCodes(newBuf)
    setKeySignal(prev => ({ key, seq: (prev?.seq ?? 0) + 1 }))
  }, [keyBuffer, checkCodes])

  const handleDpad = useCallback((dir: 'U' | 'D' | 'L' | 'R') => {
    setKeySignal(prev => ({ key: dir, seq: (prev?.seq ?? 0) + 1 }))
  }, [])

  const screenContent = snakeActive ? (
    <>
      <PhoneStatusBar />
      <SnakeGame keySignal={keySignal} onExit={() => setSnakeActive(false)} />
    </>
  ) : easterEgg && easterEgg !== 'codes' ? (
    <>
      <PhoneStatusBar />
      <EasterEggOverlay lines={OVERLAYS[easterEgg]} onDismiss={() => setEasterEgg(null)} />
    </>
  ) : (
    <>
      <PhoneStatusBar />
      {children}
    </>
  )

  return (
    <div className="min-h-screen flex justify-center items-start py-6 px-3" style={{ background: '#0a0f1e' }}>
      {/* Phone body */}
      <div
        className="w-full max-w-[340px] sm:max-w-[480px] select-none"
        style={{
          background: 'linear-gradient(175deg, #1f3068 0%, #0e1838 60%, #0a1228 100%)',
          borderRadius: 36,
          padding: 12,
          boxShadow: '0 40px 100px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.12)',
        }}
      >
        {/* Top decoration: camera + speaker */}
        <div className="flex items-center justify-between px-5 py-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: '#080e20', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8), 0 0 0 1px #1a2550' }}
          />
          <div className="flex gap-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-1 rounded-full" style={{ height: 12, background: '#080e20' }} />
            ))}
          </div>
          <div className="w-3 h-3 rounded-full" style={{ background: '#080e20', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8)' }} />
        </div>

        {/* Screen bezel */}
        <div
          style={{
            borderRadius: 10,
            padding: 3,
            background: '#050c1a',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.9)',
          }}
        >
          {/* LCD screen */}
          <div
            className="lcd-screen relative"
            style={{ background: '#c2cf9c', borderRadius: 7, overflow: 'hidden' }}
          >
            {/* Scrollable content — determines screen height */}
            <div style={{ maxHeight: 480, overflowY: 'auto', overflowX: 'hidden' }}>
              {screenContent}
            </div>
            {/* Codes overlay — sits on top without affecting layout */}
            {easterEgg === 'codes' && (
              <div className="absolute inset-0 flex flex-col" style={{ background: '#c2cf9c', zIndex: 10 }}>
                <PhoneStatusBar />
                <EasterEggOverlay lines={OVERLAYS.codes} onDismiss={() => setEasterEgg(null)} />
              </div>
            )}
          </div>
        </div>

        {/* Brand label */}
        <div className="text-center my-3">
          <span
            style={{
              fontFamily: 'Arial Black, Arial, sans-serif',
              color: '#1e305c',
              fontSize: 11,
              letterSpacing: '0.35em',
              fontWeight: 900,
            }}
          >
            NOKIA
          </span>
        </div>

        {/* Soft keys row */}
        <div className="grid grid-cols-3 gap-2 px-3 mb-3">
          <button
            onClick={() => setEasterEgg(prev => prev === 'codes' ? null : 'codes')}
            className="phone-key rounded-lg flex items-center justify-center"
            style={{ height: 32, background: '#0e1830', border: '1px solid #0a1228', cursor: 'pointer' }}
          >
            <span style={{ color: '#a0b0d0', fontSize: 10, fontFamily: 'Arial, sans-serif', letterSpacing: '0.1em' }}>MENU</span>
          </button>
          <div />
          <div
            className="phone-key rounded-lg flex items-center justify-center"
            style={{ height: 32, background: '#0e1830', border: '1px solid #0a1228' }}
          >
            <span style={{ color: '#a0b0d0', fontSize: 10, fontFamily: 'Arial, sans-serif', letterSpacing: '0.1em' }}>NAMES</span>
          </div>
        </div>

        {/* D-pad */}
        <div className="flex justify-center mb-3">
          <div
            className="relative"
            style={{
              width: 110,
              height: 110,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #1a2b50, #080e20)',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.9), 0 2px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Clickable quadrant buttons for D-pad directions */}
            {([
              { dir: 'U' as const, label: '▲', style: { top: 0, left: '25%', width: '50%', height: '38%' } },
              { dir: 'D' as const, label: '▼', style: { bottom: 0, left: '25%', width: '50%', height: '38%' } },
              { dir: 'L' as const, label: '◄', style: { left: 0, top: '25%', width: '38%', height: '50%' } },
              { dir: 'R' as const, label: '►', style: { right: 0, top: '25%', width: '38%', height: '50%' } },
            ]).map(({ dir, label, style }) => (
              <button
                key={dir}
                onClick={() => handleDpad(dir)}
                className="absolute flex items-center justify-center"
                style={{
                  ...style,
                  background: 'transparent',
                  border: 'none',
                  color: '#2a4080',
                  fontSize: 13,
                  cursor: 'pointer',
                  borderRadius: 4,
                }}
              >
                {label}
              </button>
            ))}
            {/* Center select button */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                margin: 'auto',
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 40% 30%, #253860, #0e1830)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.08)',
              }}
            />
          </div>
        </div>

        {/* Call / End buttons */}
        <div className="grid grid-cols-2 gap-3 px-4 mb-3">
          <div
            className="phone-key rounded-xl flex items-center justify-center gap-1"
            style={{ height: 38, background: '#1a5c28', border: '1px solid #0e3518' }}
          >
            <span style={{ color: '#7de89a', fontSize: 20, lineHeight: 1 }}>☎</span>
          </div>
          <div
            className="phone-key rounded-xl flex items-center justify-center"
            style={{ height: 38, background: '#5c1a1a', border: '1px solid #3a0e0e' }}
          >
            <span style={{ color: '#e87d7d', fontSize: 16, lineHeight: 1 }}>✕</span>
          </div>
        </div>

        {/* Number keys */}
        <div className="grid grid-cols-3 gap-2 px-2 pb-3">
          {KEYS.map(({ k, s }) => (
            <button
              key={k}
              onClick={() => handleKey(k)}
              className="phone-key rounded-xl flex flex-col items-center justify-center"
              style={{ height: 46, background: '#0e1830', border: '1px solid #0a1228', cursor: 'pointer' }}
            >
              <span style={{ color: '#e0e8ff', fontSize: 24, fontFamily: 'Arial, sans-serif', fontWeight: 700, lineHeight: 1 }}>
                {k}
              </span>
              {s && (
                <span style={{ color: '#3a5090', fontSize: 8, fontFamily: 'Arial, sans-serif', fontWeight: 600, letterSpacing: '0.05em', marginTop: 1 }}>
                  {s}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bottom antenna bump */}
        <div className="flex justify-center pt-1 pb-2">
          <div style={{ width: 40, height: 4, borderRadius: 2, background: '#080e20' }} />
        </div>
      </div>
    </div>
  )
}

function EasterEggOverlay({ lines, onDismiss }: { lines: string[]; onDismiss: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-6 px-4"
      style={{ minHeight: 160, color: '#1d2b00', cursor: 'pointer' }}
      onClick={onDismiss}
    >
      <div className="border-2 w-full p-3 text-center" style={{ borderColor: '#1d2b00' }}>
        {lines.map((line, i) => (
          <div key={i} className="text-sm tracking-widest" style={{ lineHeight: '1.6', opacity: line ? 1 : 0.4 }}>
            {line || '—'}
          </div>
        ))}
        <div className="text-xs opacity-40 mt-2">tap to close</div>
      </div>
    </div>
  )
}
