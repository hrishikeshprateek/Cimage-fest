import Reveal from "../Reveal";
import { fest } from "@/lib/data";

export default function Register() {
  return (
    <section id="register" className="scroll-mt-24 px-6 py-24 sm:px-10">
      <Reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 px-8 py-16 text-center sm:px-16 sm:py-20">
        {/* Glowing gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-fuchsia-600/20 to-cyan-600/30" />
        <div className="absolute -left-20 -top-20 h-64 w-64 animate-glow rounded-full bg-violet-500/40 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 animate-glow rounded-full bg-cyan-500/40 blur-3xl" />

        <div className="relative">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-cyan">
            {fest.dates}
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
            Be part of <span className="text-gradient">{fest.name}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Registration opens soon. Join the waitlist now and be the first to
            grab your pass when it drops.
          </p>
          <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="you@email.com"
              aria-label="Email address"
              className="w-full rounded-full border border-white/15 bg-white/10 px-5 py-3.5 text-white placeholder-white/40 outline-none backdrop-blur focus:border-cyan"
            />
            <button
              type="submit"
              className="rounded-full bg-white px-7 py-3.5 font-semibold text-[#05010f] transition-transform hover:scale-105"
            >
              Notify Me
            </button>
          </form>
        </div>
      </Reveal>
    </section>
  );
}
