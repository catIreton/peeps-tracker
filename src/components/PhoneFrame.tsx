interface Props { children: React.ReactNode }

const KEYS = [
  { k: '1', s: '' },   { k: '2', s: 'ABC' }, { k: '3', s: 'DEF' },
  { k: '4', s: 'GHI' },{ k: '5', s: 'JKL' }, { k: '6', s: 'MNO' },
  { k: '7', s: 'PQRS'},{ k: '8', s: 'TUV' }, { k: '9', s: 'WXYZ'},
  { k: '*', s: '' },   { k: '0', s: '+' },   { k: '#', s: '' },
]

export default function PhoneFrame({ children }: Props) {
  return (
    <div className="min-h-screen flex justify-center items-start py-6 px-3" style={{ background: '#0a0f1e' }}>
      {/* Phone body */}
      <div
        className="w-full select-none"
        style={{
          maxWidth: 340,
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
          {/* Speaker grill slots */}
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
            className="lcd-screen relative overflow-hidden"
            style={{
              background: '#c2cf9c',
              borderRadius: 7,
              maxHeight: 480,
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {children}
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
          <div
            className="phone-key rounded-lg flex items-center justify-center"
            style={{ height: 32, background: '#0e1830', border: '1px solid #0a1228' }}
          >
            <span style={{ color: '#a0b0d0', fontSize: 10, fontFamily: 'Arial, sans-serif', letterSpacing: '0.1em' }}>MENU</span>
          </div>
          {/* D-pad outer ring center */}
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
            {/* Direction labels */}
            {[
              { label: '▲', style: { top: 8, left: '50%', transform: 'translateX(-50%)' } },
              { label: '▼', style: { bottom: 8, left: '50%', transform: 'translateX(-50%)' } },
              { label: '◄', style: { left: 8, top: '50%', transform: 'translateY(-50%)' } },
              { label: '►', style: { right: 8, top: '50%', transform: 'translateY(-50%)' } },
            ].map(({ label, style }) => (
              <span
                key={label}
                className="absolute"
                style={{ color: '#2a4080', fontSize: 13, lineHeight: 1, ...style }}
              >
                {label}
              </span>
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
            <div
              key={k}
              className="phone-key rounded-xl flex flex-col items-center justify-center"
              style={{ height: 46, background: '#0e1830', border: '1px solid #0a1228' }}
            >
              <span style={{ color: '#e0e8ff', fontSize: 24, fontFamily: 'Arial, sans-serif', fontWeight: 700, lineHeight: 1 }}>
                {k}
              </span>
              {s && (
                <span style={{ color: '#3a5090', fontSize: 8, fontFamily: 'Arial, sans-serif', fontWeight: 600, letterSpacing: '0.05em', marginTop: 1 }}>
                  {s}
                </span>
              )}
            </div>
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
