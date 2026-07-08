// Premium outro centerpiece: a set of thin luminous rings precessing in 3D
// around a glowing core — a gyroscope / orbital system. Pure CSS, no emojis.

const RINGS = [
  { size: 288, dur: "28s", tiltZ: 0, color: "#22d3ee", rev: false },
  { size: 236, dur: "22s", tiltZ: 62, color: "#e879f9", rev: true },
  { size: 236, dur: "34s", tiltZ: -62, color: "#8b5cf6", rev: false },
  { size: 176, dur: "18s", tiltZ: 28, color: "#38bdf8", rev: true },
];

export default function OrbitStage() {
  return (
    <div className="pointer-events-none relative grid h-72 w-72 scale-75 place-items-center [perspective:1100px] sm:scale-100">
      {/* Ambient core glow */}
      <div className="absolute h-40 w-40 rounded-full bg-violet-600/25 blur-3xl" />

      {/* Precessing rings */}
      {RINGS.map((r, i) => (
        <div key={i} className="absolute inset-0 grid place-items-center">
          <div
            className={`[transform-style:preserve-3d] ${
              r.rev ? "animate-spin-y-rev" : "animate-spin-y"
            }`}
            style={{ animationDuration: r.dur }}
          >
            <div
              className="relative rounded-full"
              style={{
                width: r.size,
                height: r.size,
                transform: `rotateX(74deg) rotateZ(${r.tiltZ}deg)`,
                border: `1.5px solid ${r.color}`,
                boxShadow: `0 0 24px -4px ${r.color}, inset 0 0 24px -8px ${r.color}`,
                opacity: 0.85,
              }}
            >
              {/* Travelling node on the ring */}
              <span
                className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
                style={{
                  background: r.color,
                  boxShadow: `0 0 14px 2px ${r.color}`,
                }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Luminous core */}
      <div className="relative grid place-items-center">
        <div
          className="h-16 w-16 rounded-full ring-1 ring-white/40 sm:h-20 sm:w-20"
          style={{
            background:
              "radial-gradient(circle at 32% 30%, #ffffff, #c4b5fd 34%, #7c3aed 72%, #4c1d95 100%)",
            boxShadow:
              "0 0 60px 12px rgba(139,92,246,0.55), inset 0 0 20px rgba(255,255,255,0.35)",
          }}
        />
        <div className="animate-breathe absolute h-16 w-16 rounded-full ring-1 ring-cyan-300/40 sm:h-20 sm:w-20" />
      </div>
    </div>
  );
}
