import Section from "../Section";
import Reveal from "../Reveal";
import StatCounter from "../StatCounter";
import { fest, stats } from "@/lib/data";

export default function About() {
  return (
    <Section
      id="about"
      eyebrow="About the Fest"
      title={
        <>
          Where <span className="text-gradient">ideas ignite</span>
        </>
      }
      className="grid-backdrop"
    >
      <Reveal className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-white/70">
        <p>
          {fest.name} is {fest.tagline.toLowerCase()} — three electric days of
          hackathons, robotics, competitions, keynote talks and after-dark
          concerts. Founded to put Bihar&apos;s student innovators on the
          national map, it brings together builders, dreamers and doers from
          across the country under one neon sky.
        </p>
      </Reveal>

      <Reveal
        as="div"
        delay={120}
        className="mt-16 grid grid-cols-2 gap-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur sm:p-12 lg:grid-cols-4"
      >
        {stats.map((s) => (
          <StatCounter
            key={s.label}
            value={s.value}
            suffix={s.suffix}
            label={s.label}
          />
        ))}
      </Reveal>
    </Section>
  );
}
