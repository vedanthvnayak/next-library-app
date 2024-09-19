"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, SortAsc, SortDesc } from "lucide-react";

interface SortDropdownProps {
  defaultSort: string;
  type?: "book" | "user"; // Add type prop with default value
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  defaultSort,
  type = "book", // Default to "book"
}) => {
  const router = useRouter();

  // Determine default field and direction from defaultSort
  const [field, setField] = useState<string>(
    defaultSort.split("-")[0] || (type === "book" ? "title" : "id")
  );
  const [direction, setDirection] = useState<string>(
    defaultSort.split("-")[1] || "asc"
  );

  // Handle field change
  const handleFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedField = event.target.value;
    setField(selectedField);
    router.push(`?sort=${selectedField}-${direction}`);
  };

  // Handle direction change
  const handleDirectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDirection = event.target.value;
    setDirection(selectedDirection);
    router.push(`?sort=${field}-${selectedDirection}`);
  };

  // Options based on type
  const fieldOptions =
    type === "book" ? (
      <>
        <option value="title">Title</option>
        <option value="author">Author</option>
        <option value="genre">Genre</option>
      </>
    ) : (
      <>
        <option value="id">ID</option>
        <option value="username">Name</option>
        <option value="email">Email</option>
        <option value="role">Role</option>
      </>
    );

  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
      <div className="relative flex-1">
        <select
          onChange={handleFieldChange}
          value={field}
          className="appearance-none bg-gray-800 text-gray-300 py-2 pl-4 pr-10 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700 w-full sm:w-auto"
          aria-label="Sort by field"
        >
          {fieldOptions}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          size={18}
        />
      </div>

      <div className="relative flex-1">
        <select
          onChange={handleDirectionChange}
          value={direction}
          className="appearance-none bg-gray-800 text-gray-300 py-2 pl-4 pr-10 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700 w-full sm:w-auto"
          aria-label="Sort direction"
        >
          <option value="asc">Ascending (A-Z)</option>
          <option value="desc">Descending (Z-A)</option>
        </select>
        {direction === "asc" ? (
          <SortAsc
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
        ) : (
          <SortDesc
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
        )}
      </div>
    </div>
  );
};

export default SortDropdown;
