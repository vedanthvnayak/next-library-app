"use client";

import { useState } from "react";

export default function AdminProfessorTable({ professors }) {
  const [editingId, setEditingId] = useState(null);

  // Implement edit, delete, and refresh functionality here
  const handleRefresh = (professorId) => {
    // Refresh logic for the professor can be implemented here.
    console.log(`Refresh requested for professor with ID: ${professorId}`);
  };

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Department
          </th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Calendly Link
          </th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {professors.map((professor) => (
          <tr key={professor.id}>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
              {professor.name}
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
              {professor.department}
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
              {professor.calendly_event_link ? (
                <a
                  href={professor.calendly_event_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Link
                </a>
              ) : (
                <div className="flex items-center">
                  <span className="text-red-600">Not Accepted</span>
                  <button
                    onClick={() => handleRefresh(professor.id)}
                    className="ml-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded px-2 py-1"
                  >
                    Refresh
                  </button>
                </div>
              )}
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
              <button
                onClick={() => setEditingId(professor.id)}
                className="text-blue-600 hover:text-blue-900"
              >
                Edit
              </button>
              <button className="ml-2 text-red-600 hover:text-red-900">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
