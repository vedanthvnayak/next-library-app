"use client";

import React, { useState, useEffect } from "react";
import { PencilIcon, Trash2Icon, RefreshCcw, PlusIcon, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/components/adminComponents/Modal";
import { QueryResultRow } from "@neondatabase/serverless";
import {
  checkInvitationAndUpdateCalendlyLink,
  createProfessor,
} from "@/app/[locale]/admin/professors/calendlyOperations";

interface Professor {
  id: number;
  name: string;
  department: string;
  email: string;
  calendly_event_link: string | null;
}

interface AdminProfessorTableProps {
  professors: QueryResultRow[];
}

type SortKey = keyof Professor;
type SortOrder = "asc" | "desc";

const SortArrow = ({ direction }: { direction: SortOrder }) => (
  <svg
    className={`ml-1 h-4 w-4 inline-block transition-transform duration-200 ease-in-out ${
      direction === "asc" ? "transform rotate-180" : ""
    }`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default function AdminProfessorTable({
  professors: initialProfessors,
}: AdminProfessorTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [professors, setProfessors] = useState(initialProfessors);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessorId, setSelectedProfessorId] = useState<number | null>(
    null
  );
  const [isAddProfessorModalOpen, setIsAddProfessorModalOpen] = useState(false);
  const [newProfessor, setNewProfessor] = useState({
    name: "",
    department: "",
    shortBio: "",
    calendly_event_link: "",
    email: "",
  });

  const defaultSort = searchParams.get("sort") || "name-asc";
  const [field, setField] = useState<SortKey>(
    (defaultSort.split("-")[0] as SortKey) || "name"
  );
  const [direction, setDirection] = useState<SortOrder>(
    (defaultSort.split("-")[1] as SortOrder) || "asc"
  );

  useEffect(() => {
    const sortedProfessors = [...initialProfessors].sort((a, b) => {
      if (a[field] < b[field]) return direction === "asc" ? -1 : 1;
      if (a[field] > b[field]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setProfessors(sortedProfessors);
  }, [initialProfessors, field, direction]);

  const handleSort = (key: SortKey) => {
    const newDirection = field === key && direction === "asc" ? "desc" : "asc";
    setField(key);
    setDirection(newDirection);
    router.replace(`?sort=${key}-${newDirection}`);
  };

  const handleRefresh = async (professorEmail: string) => {
    await checkInvitationAndUpdateCalendlyLink(professorEmail);
    toast.info("Refreshing professor's Calendly link...");
    router.refresh();
  };

  const handleEditClick = (id: number) => {
    setEditingId(id);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedProfessorId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedProfessorId !== null) {
      console.log(`Deleting professor with ID: ${selectedProfessorId}`);
      toast.success("Professor deleted successfully.");
      setIsModalOpen(false);
    }
  };

  const handleAddProfessor = async () => {
    console.log("Adding new professor:", newProfessor);

    try {
      const result = await createProfessor(newProfessor);

      if (result.insertedProfessorId) {
        toast.success("Professor added and invitation sent successfully.");
      } else if (result.invitationSent === "success") {
        toast.success("Invitation sent successfully, but professor not added.");
      } else {
        toast.error("Failed to add professor or send invitation.");
      }

      setIsAddProfessorModalOpen(false);
      setNewProfessor({
        name: "",
        department: "",
        shortBio: "",
        calendly_event_link: "",
        email: "",
      });
      router.refresh();
    } catch (error) {
      console.error("Error adding professor:", error);
      toast.error("An error occurred while adding the professor.");
    }
  };

  const SortableHeader = ({
    children,
    sortKey,
  }: {
    children: React.ReactNode;
    sortKey: SortKey;
  }) => (
    <th
      className="px-2 py-2 sm:px-4 sm:py-3 font-semibold cursor-pointer group"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center justify-between">
        <span>{children}</span>
        <span
          className={`transition-colors duration-200 ${
            field === sortKey
              ? "text-indigo-400"
              : "text-gray-400 group-hover:text-gray-300"
          }`}
        >
          <SortArrow direction={field === sortKey ? direction : "asc"} />
        </span>
      </div>
    </th>
  );

  return (
    <>
      <div className="mb-4 text-center">
        <button
          onClick={() => setIsAddProfessorModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300 ease-in-out"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Professor
        </button>
      </div>

      <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-xl">
        <table className="min-w-full text-xs sm:text-sm text-left text-gray-300">
          <thead className="bg-gray-800 text-gray-100">
            <tr>
              <SortableHeader sortKey="name">Name</SortableHeader>
              <SortableHeader sortKey="department">Department</SortableHeader>
              <SortableHeader sortKey="email">Email</SortableHeader>
              <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold">
                Calendly Link
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {professors.map((professor) => (
              <tr
                key={professor.id}
                className="hover:bg-gray-800 transition-colors duration-200"
              >
                <td className="px-2 py-2 sm:px-4 sm:py-3">{professor.name}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">
                  {professor.department}
                </td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">{professor.email}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">
                  {professor.calendly_event_link ? (
                    <a
                      href={professor.calendly_event_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                    >
                      Link
                    </a>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-red-400">Not Accepted</span>
                      <button
                        onClick={() => handleRefresh(professor.email)}
                        className="ml-2 text-gray-400 hover:text-gray-300 transition-colors duration-200 bg-gray-700 bg-opacity-30 hover:bg-opacity-50 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                        aria-label={`Refresh Calendly link for ${professor.name}`}
                      >
                        <RefreshCcw className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditClick(professor.id)}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 bg-indigo-900 bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                      aria-label={`Edit ${professor.name}`}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(professor.id)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200 bg-red-900 bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      aria-label={`Delete ${professor.name}`}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this professor?"
        title="Delete Professor"
        type="delete"
      />

      {isAddProfessorModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Add Professor</h2>
              <button
                onClick={() => setIsAddProfessorModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddProfessor();
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newProfessor.name}
                  onChange={(e) =>
                    setNewProfessor({ ...newProfessor, name: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  value={newProfessor.department}
                  onChange={(e) =>
                    setNewProfessor({
                      ...newProfessor,
                      department: e.target.value,
                    })
                  }
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="shortBio"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Short Bio
                </label>
                <textarea
                  id="shortBio"
                  value={newProfessor.shortBio}
                  onChange={(e) =>
                    setNewProfessor({
                      ...newProfessor,
                      shortBio: e.target.value,
                    })
                  }
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={newProfessor.email}
                  onChange={(e) =>
                    setNewProfessor({ ...newProfessor, email: e.target.value })
                  }
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                Add Professor
              </button>
            </form>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
