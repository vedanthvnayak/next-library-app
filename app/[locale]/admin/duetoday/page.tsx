import React from "react";
import { getDueToday } from "@/app/[locale]/admin/duetoday/action";
import DueTodayTable from "@/components/adminComponents/DueTodayTable";

export default async function DueTodayPage() {
  const result = await getDueToday();

  if (!result.success) {
    return (
      <section className="w-full py-8 sm:py-12 lg:py-16 bg-gray-950 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Books Due Today
          </h1>
          <div className="min-h-[50vh] flex items-center justify-center">
            <p className="text-2xl text-red-500 bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
              Error: {result.error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 bg-gray-950 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
          Books Due Today
        </h1>
        <div className="mb-8">
          {/* You can add search or other controls here if needed */}
        </div>
        <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-xl">
          <DueTodayTable dueBooks={result.data} />
        </div>
        <div className="mt-6 sm:mt-8 flex justify-center">
          {/* You can add pagination here if needed */}
        </div>
      </div>
    </section>
  );
}
