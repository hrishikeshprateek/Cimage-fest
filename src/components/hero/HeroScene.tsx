"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles, Stars } from "@react-three/drei";
import type { Group, Mesh } from "three";

function SpinningKnot() {
  const mesh = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.12;
    mesh.current.rotation.y += delta * 0.18;
  });
  return (
    <mesh ref={mesh} position={[0, 0, -2]} scale={2.6}>
      <torusKnotGeometry args={[1, 0.28, 180, 32]} />
      <meshStandardMaterial
        color="#4c1d95"
        emissive="#4338ca"
        emissiveIntensity={0.5}
        metalness={0.9}
        roughness={0.2}
        wireframe
      />
    </mesh>
  );
}

function FloatingShapes() {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    // Gentle parallax toward the pointer.
    group.current.rotation.y +=
      (state.pointer.x * 0.25 - group.current.rotation.y) * 0.03;
    group.current.rotation.x +=
      (-state.pointer.y * 0.15 - group.current.rotation.x) * 0.03;
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[-4, 1.6, -1]} scale={0.6}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#0e7490"
            emissiveIntensity={0.6}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
      </Float>
      <Float speed={1.4} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[4.2, -1.4, -1]} scale={0.5}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#e879f9"
            emissive="#a21caf"
            emissiveIntensity={0.6}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={1} floatIntensity={2.5}>
        <mesh position={[3, 2.2, -2]} scale={0.35}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#6d28d9"
            emissiveIntensity={0.6}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroScene() {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <fog attach="fog" args={["#05010f", 6, 18]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 6, 5]} intensity={1.4} />
      <pointLight position={[-6, -4, -2]} intensity={40} color="#a855f7" />
      <pointLight position={[6, 4, 4]} intensity={30} color="#38bdf8" />

      <Suspense fallback={null}>
        <SpinningKnot />
        <FloatingShapes />
        <Sparkles
          count={isMobile ? 40 : 100}
          scale={12}
          size={2}
          speed={0.3}
          color="#c4b5fd"
        />
        <Stars
          radius={60}
          depth={40}
          count={isMobile ? 900 : 2200}
          factor={4}
          fade
          speed={1}
        />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
