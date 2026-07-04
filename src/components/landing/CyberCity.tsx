// Original neon cyberpunk skyline, generated as a self-contained SVG.
// Deterministic (no Math.random at render) so server and client markup match.

function rand(i: number, salt: number) {
  const x = Math.sin((i + 1) * salt) * 43758.5453;
  return x - Math.floor(x);
}

type Building = { x: number; w: number; h: number };

function makeSkyline(count: number, salt: number, minH: number, maxH: number) {
  const buildings: Building[] = [];
  const colW = 1440 / count;
  for (let i = 0; i < count; i++) {
    const w = colW * (0.62 + rand(i, salt) * 0.3);
    const h = minH + rand(i, salt * 1.7) * (maxH - minH);
    const x = i * colW + (colW - w) / 2;
    buildings.push({ x, w, h });
  }
  return buildings;
}

function Windows({ b, salt }: { b: Building; salt: number }) {
  const cols = Math.max(2, Math.floor(b.w / 12));
  const rows = Math.max(3, Math.floor(b.h / 22));
  const dots: React.ReactElement[] = [];
  const cw = b.w / cols;
  const ch = 900 / rows;
  const palette = ["#22d3ee", "#e879f9", "#f59e0b", "#a78bfa"];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = rand(r * 31 + c * 7 + b.x, salt);
      if (lit < 0.62) continue;
      const color = palette[Math.floor(rand(r + c, salt * 3) * palette.length)];
      dots.push(
        <rect
          key={`${r}-${c}`}
          x={b.x + c * cw + cw * 0.25}
          y={900 - b.h + r * ch + ch * 0.25}
          width={Math.max(1.5, cw * 0.4)}
          height={Math.max(1.5, ch * 0.4)}
          fill={color}
          opacity={0.85}
        />
      );
    }
  }
  return <>{dots}</>;
}

export default function CyberCity() {
  const back = makeSkyline(24, 12.9898, 160, 360);
  const front = makeSkyline(16, 78.233, 240, 560);

  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#080318" />
          <stop offset="45%" stopColor="#1a0b3d" />
          <stop offset="80%" stopColor="#3b1276" />
          <stop offset="100%" stopColor="#5b1e9e" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="72%" r="55%">
          <stop offset="0%" stopColor="#e879f9" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#8b5cf6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* Sky + central glow */}
      <rect width="1440" height="900" fill="url(#sky)" />
      <rect width="1440" height="900" fill="url(#glow)" />

      {/* Distant neon beams */}
      {[220, 520, 900, 1180].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={80}
          width={2}
          height={520}
          fill={i % 2 ? "#22d3ee" : "#e879f9"}
          opacity={0.12}
        />
      ))}

      {/* Back skyline */}
      <g opacity={0.7}>
        {back.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={900 - b.h}
            width={b.w}
            height={b.h}
            fill="#241155"
            stroke="#22d3ee"
            strokeOpacity={0.15}
          />
        ))}
      </g>

      {/* Front skyline with lit windows + neon top edge */}
      <g>
        {front.map((b, i) => (
          <g key={i}>
            <rect
              x={b.x}
              y={900 - b.h}
              width={b.w}
              height={b.h}
              fill="#0a0716"
            />
            <rect
              x={b.x}
              y={900 - b.h}
              width={b.w}
              height={3}
              fill={i % 2 ? "#22d3ee" : "#e879f9"}
              filter="url(#soft)"
            />
            <Windows b={b} salt={9.13 + i} />
          </g>
        ))}
      </g>

      {/* Foreground haze */}
      <rect y={720} width="1440" height="180" fill="#05010f" opacity={0.55} />
    </svg>
  );
}
