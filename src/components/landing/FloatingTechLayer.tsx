"use client";

import dynamic from "next/dynamic";

// WebGL can't render on the server — load the floating scene client-side only.
const FloatingTech = dynamic(() => import("./FloatingTech"), {
  ssr: false,
  loading: () => null,
});

export default function FloatingTechLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <FloatingTech />
    </div>
  );
}
