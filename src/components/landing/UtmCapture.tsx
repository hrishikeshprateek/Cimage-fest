"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/utm";

// Captures UTM params from the landing URL on first load. Renders nothing.
export default function UtmCapture() {
  useEffect(() => {
    captureUtm();
  }, []);
  return null;
}
