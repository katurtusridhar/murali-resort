import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Murali Resort | Premium Resort & Convention Center — Vijayawada",
  description:
    "A premier destination for weddings, celebrations, and corporate events in Vijayawada.",
};

export default function Home5Page() {
  redirect("/home");
}

