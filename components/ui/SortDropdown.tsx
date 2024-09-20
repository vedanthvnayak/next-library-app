"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, SortAsc, SortDesc } from "lucide-react";

interface SortDropdownProps {
  defaultSort: string;
  type?: "book" | "user";
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  defaultSort,
  type = "book",
}) => {
  const router = useRouter();

  const [field, setField] = useState<string>(
    defaultSort.split("-")[0] || (type === "book" ? "title" : "id")
  );
  const [direction, setDirection] = useState<string>(
    defaultSort.split("-")[1] || "asc"
  );

  const handleFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedField = event.target.value;
    setField(selectedField);
    router.push(`?sort=${selectedField}-${direction}`);
  };

  const handleDirectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDirection = event.target.value;
    setDirection(selectedDirection);
    router.push(`?sort=${field}-${selectedDirection}`);
  };

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
    <div className="flex flex-col space-y-2 w-full sm:flex-row sm:space-y-0 sm:space-x-2 sm:w-auto">
      <div className="relative flex-1 sm:flex-initial">
        <select
          onChange={handleFieldChange}
          value={field}
          className="appearance-none w-full sm:w-auto bg-gray-800 text-gray-300 py-2 pl-3 pr-8 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700 text-sm"
          aria-label="Sort by field"
        >
          {fieldOptions}
        </select>
        <ChevronDown
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          size={16}
        />
      </div>

      <div className="relative flex-1 sm:flex-initial">
        <select
          onChange={handleDirectionChange}
          value={direction}
          className="appearance-none w-full sm:w-auto bg-gray-800 text-gray-300 py-2 pl-3 pr-8 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700 text-sm"
          aria-label="Sort direction"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        {direction === "asc" ? (
          <SortAsc
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
        ) : (
          <SortDesc
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
        )}
      </div>
    </div>
  );
};

export default SortDropdown;
