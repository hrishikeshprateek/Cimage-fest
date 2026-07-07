import type { Metadata } from "next";
import PassView from "@/components/landing/PassView";

export const metadata: Metadata = {
  title: "Your Pass — CIMAGE Fest",
};

export default async function PassPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#05010f] px-6 py-16 text-white">
      <PassView token={token} />
    </main>
  );
}
