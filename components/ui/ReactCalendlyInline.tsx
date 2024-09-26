"use client";

import React from "react";
import { InlineWidget } from "react-calendly";

interface ReactCalendlyInlineProps {
  url: string;
}

const ReactCalendlyInline: React.FC<ReactCalendlyInlineProps> = ({ url }) => {
  // Append the custom appearance parameters to the URL
  const customizedUrl = `${url}?background_color=1f2937&text_color=f9fafb&primary_color=6366f1`;

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">
          Reschedule Appointment
        </h2>
      </div>
      <div
        className="calendly-inline-widget"
        style={{ minWidth: "320px", height: "630px" }}
      >
        <InlineWidget
          url={customizedUrl}
          styles={{
            height: "100%",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default ReactCalendlyInline;
