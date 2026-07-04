"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, RoundedBox, Sparkles } from "@react-three/drei";
import type { Group, Mesh } from "three";

/** The spinning knot "wheel" from the earlier hero. */
function KnotWheel(props: React.ComponentProps<"group">) {
  const mesh = useRef<Mesh>(null);
  useFrame((_, d) => {
    if (mesh.current) {
      mesh.current.rotation.x += d * 0.25;
      mesh.current.rotation.y += d * 0.3;
    }
  });
  return (
    <group {...props}>
      <mesh ref={mesh}>
        <torusKnotGeometry args={[1, 0.3, 160, 32]} />
        <meshStandardMaterial
          color="#6d28d9"
          emissive="#4338ca"
          emissiveIntensity={0.55}
          metalness={0.9}
          roughness={0.2}
          wireframe
        />
      </mesh>
    </group>
  );
}

/** A neon wheel / rim — two concentric tori that spin. */
function Wheel({
  color = "#22d3ee",
  spin = 0.5,
  ...props
}: { color?: string; spin?: number } & React.ComponentProps<"group">) {
  const ref = useRef<Group>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.z += d * spin;
  });
  return (
    <group {...props}>
      <group ref={ref}>
        <mesh>
          <torusGeometry args={[1, 0.14, 20, 64]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[0.6, 0.06, 16, 48]} />
          <meshStandardMaterial
            color="#e879f9"
            emissive="#a21caf"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>
        {/* spokes */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
            <boxGeometry args={[1.2, 0.05, 0.05]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.3}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** A stylised AR / VR headset (Meta Quest-like). */
function ARHeadset(props: React.ComponentProps<"group">) {
  return (
    <group {...props}>
      {/* Visor body */}
      <RoundedBox args={[2.2, 1.15, 0.95]} radius={0.3} smoothness={4}>
        <meshStandardMaterial
          color="#101018"
          metalness={0.6}
          roughness={0.35}
        />
      </RoundedBox>
      {/* Glossy front plate */}
      <RoundedBox
        args={[2.05, 1, 0.16]}
        radius={0.22}
        smoothness={4}
        position={[0, 0, 0.52]}
      >
        <meshStandardMaterial
          color="#08080f"
          metalness={0.95}
          roughness={0.08}
          emissive="#22d3ee"
          emissiveIntensity={0.12}
        />
      </RoundedBox>
      {/* Sensor accents */}
      <mesh position={[-0.55, 0.1, 0.61]}>
        <circleGeometry args={[0.12, 24]} />
        <meshBasicMaterial color="#8b5cf6" />
      </mesh>
      <mesh position={[0.55, 0.1, 0.61]}>
        <circleGeometry args={[0.12, 24]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>
      <mesh position={[0, -0.15, 0.61]}>
        <boxGeometry args={[1.1, 0.04, 0.02]} />
        <meshBasicMaterial color="#e879f9" />
      </mesh>
      {/* Head strap */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, -0.55]}>
        <torusGeometry args={[1.15, 0.09, 16, 40, Math.PI * 1.1]} />
        <meshStandardMaterial color="#1b1b2b" metalness={0.4} roughness={0.6} />
      </mesh>
    </group>
  );
}

function Scene({ mobile }: { mobile: boolean }) {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    // Pointer parallax on the whole tilted composition.
    group.current.rotation.y +=
      (state.pointer.x * 0.2 + 0.15 - group.current.rotation.y) * 0.04;
    group.current.rotation.x +=
      (-state.pointer.y * 0.12 - group.current.rotation.x) * 0.04;
  });

  // On mobile the objects tuck into the corners to frame the centred logo;
  // on desktop they sweep in from the sides.
  const pos = mobile
    ? {
        knot: [-1.7, 2.5, -2] as const,
        headset: [1.9, -2.7, -1.5] as const,
        wheelA: [1.8, 2.6, -3] as const,
        wheelB: [-1.8, -2.6, -2.5] as const,
        ico: [-1.9, -1.4, -2.5] as const,
        octa: [1.9, 1.2, -2] as const,
      }
    : {
        knot: [-4.2, 0.6, -1] as const,
        headset: [4.1, -0.4, 0] as const,
        wheelA: [3.2, 2.3, -2] as const,
        wheelB: [-3.1, -2.4, -1.5] as const,
        ico: [-2.2, 2.6, -2.5] as const,
        octa: [2.4, -2.6, -1] as const,
      };
  const s = mobile ? 0.72 : 1; // global scale multiplier

  return (
    <group ref={group} rotation={[0.12, 0.2, 0.06]}>
      {/* The knot wheel, tilted in */}
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
        <KnotWheel position={pos.knot} scale={1.15 * s} rotation={[0.4, 0.3, 0.2]} />
      </Float>

      {/* AR headset tilted from the side */}
      <Float speed={1.1} rotationIntensity={0.8} floatIntensity={1.4}>
        <ARHeadset position={pos.headset} scale={0.95 * s} rotation={[0.25, -0.7, 0.12]} />
      </Float>

      {/* Neon wheels scattered + tilted */}
      <Float speed={1.6} rotationIntensity={1} floatIntensity={1.6}>
        <Wheel color="#22d3ee" spin={0.7} position={pos.wheelA} scale={0.7 * s} rotation={[0.9, 0.4, 0]} />
      </Float>
      <Float speed={1.2} rotationIntensity={1.2} floatIntensity={2}>
        <Wheel color="#a78bfa" spin={-0.5} position={pos.wheelB} scale={0.85 * s} rotation={[1.1, 0.2, 0.3]} />
      </Float>

      {/* Small floating polyhedra */}
      <Float speed={2} rotationIntensity={2} floatIntensity={2.5}>
        <mesh position={pos.ico} scale={0.4 * s}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#e879f9" emissive="#a21caf" emissiveIntensity={0.5} metalness={0.6} roughness={0.2} />
        </mesh>
      </Float>
      <Float speed={1.7} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={pos.octa} scale={0.35 * s}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#22d3ee" emissive="#0e7490" emissiveIntensity={0.5} metalness={0.6} roughness={0.2} />
        </mesh>
      </Float>

      <Sparkles count={mobile ? 35 : 60} scale={14} size={2} speed={0.3} color="#c4b5fd" />
    </group>
  );
}

export default function FloatingTech() {
  // Client-only (loaded via ssr:false), so `window` is available here.
  const mobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <Canvas
      className="!pointer-events-none"
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, mobile ? 8 : 9], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 6, 5]} intensity={1.4} />
      <pointLight position={[-6, -4, -2]} intensity={45} color="#a855f7" />
      <pointLight position={[6, 4, 4]} intensity={35} color="#38bdf8" />
      {/* Objects render immediately (explicit lights). Environment only adds
          reflections, so it lives in its own boundary — if its HDR is slow or
          blocked, the scene still shows. */}
      <Scene mobile={mobile} />
      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
