"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react"; // Assuming you are using next-auth

export default function CalendlyEmbed({
  calendlyLink,
}: {
  calendlyLink: string;
}) {
  const { data: session } = useSession(); // Get session data (name and email)

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Add query parameters for name and email
  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";

  const calendlyUrl = `${calendlyLink}?background_color=1f2937&text_color=f9fafb&primary_color=6366f1&name=${encodeURIComponent(
    name
  )}&email=${encodeURIComponent(email)}`;

  return (
    <div className="bg-gray-600 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-indigo-500/20">
      <div
        className="calendly-inline-widget"
        data-url={calendlyUrl}
        style={{ minWidth: "320px", height: "700px" }}
      />
    </div>
  );
}
