import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Murali Resort | Celebrations",
  description: "Weddings, receptions, and celebrations at Murali Resort.",
};

export default function CelebrationsPage() {
  redirect("/home");
}

