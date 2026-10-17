import type { Metadata } from "next";
import Home5ClientPage from "../home5/Home5ClientPage";

export const metadata: Metadata = {
  title: "Murali Resort | Premium Resort & Convention Center — Vijayawada",
  description:
    "A premier destination for weddings, celebrations, and corporate events in Vijayawada. Featuring a grand indoor convention hall for up to 800 seated guests, expansive open-air lawns, and modern executive guest accommodations.",
  alternates: {
    canonical: "/home",
  },
};

export default function HomePage() {
  return <Home5ClientPage />;
}
