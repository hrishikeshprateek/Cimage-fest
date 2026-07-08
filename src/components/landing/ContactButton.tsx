"use client";

import { useState } from "react";
import { PhoneIcon } from "./icons";
import ContactDialog from "./ContactDialog";

export default function ContactButton({
  className = "",
}: {
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          "inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10"
        }
      >
        <PhoneIcon className="h-4 w-4" />
        Contact
      </button>

      <ContactDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
