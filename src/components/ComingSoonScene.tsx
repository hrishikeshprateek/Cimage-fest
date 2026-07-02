"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Center,
  Float,
  Environment,
  OrbitControls,
  Sparkles,
  Stars,
  Text3D,
} from "@react-three/drei";
import type { Group, Mesh } from "three";

const FONT_URL = "/fonts/helvetiker_bold.typeface.json";

function Headline() {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    // Gentle parallax that follows the pointer for a living, 3D feel.
    const { x, y } = state.pointer;
    group.current.rotation.y += (x * 0.35 - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (-y * 0.2 - group.current.rotation.x) * 0.05;
  });

  return (
    <group ref={group}>
      <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.9}>
        <Center position={[0, 0.75, 0]}>
          <Text3D
            font={FONT_URL}
            size={1.15}
            height={0.35}
            bevelEnabled
            bevelThickness={0.04}
            bevelSize={0.03}
            bevelSegments={6}
            curveSegments={12}
          >
            COMING
            <meshStandardMaterial
              color="#f5f3ff"
              emissive="#8b5cf6"
              emissiveIntensity={0.55}
              metalness={0.35}
              roughness={0.25}
            />
          </Text3D>
        </Center>

        <Center position={[0, -0.85, 0]}>
          <Text3D
            font={FONT_URL}
            size={1.15}
            height={0.35}
            bevelEnabled
            bevelThickness={0.04}
            bevelSize={0.03}
            bevelSegments={6}
            curveSegments={12}
          >
            SOON
            <meshStandardMaterial
              color="#ecfeff"
              emissive="#22d3ee"
              emissiveIntensity={0.55}
              metalness={0.35}
              roughness={0.25}
            />
          </Text3D>
        </Center>
      </Float>
    </group>
  );
}

function Knot() {
  const mesh = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.15;
    mesh.current.rotation.y += delta * 0.2;
  });

  return (
    <Float speed={1} rotationIntensity={1} floatIntensity={1.5}>
      <mesh ref={mesh} position={[0, 0, -4]} scale={2.4}>
        <torusKnotGeometry args={[1, 0.3, 160, 32]} />
        <meshStandardMaterial
          color="#4c1d95"
          emissive="#312e81"
          metalness={0.9}
          roughness={0.25}
          wireframe
        />
      </mesh>
    </Float>
  );
}

export default function ComingSoonScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#05010f"]} />
      <fog attach="fog" args={["#05010f", 8, 20]} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 6, 5]} intensity={1.5} />
      <pointLight position={[-6, -4, -2]} intensity={40} color="#a855f7" />
      <pointLight position={[6, 4, 4]} intensity={30} color="#38bdf8" />

      <Suspense fallback={null}>
        <Headline />
        <Knot />
        <Sparkles count={120} scale={12} size={2} speed={0.3} color="#c4b5fd" />
        <Stars radius={60} depth={40} count={2500} factor={4} fade speed={1} />
        <Environment preset="night" />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.4}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.7}
      />
    </Canvas>
  );
}
