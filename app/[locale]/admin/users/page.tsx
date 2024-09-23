import React from "react";
import { DrizzleManager } from "@/db/drizzleDbConnection";
import Search from "@/components/adminComponents/Search";
import PaginationControls from "@/components/ui/PaginationControls";
import UsersTable from "@/components/adminComponents/UsersTable";
import { UserRepository } from "@/repository/user.repository";
import SortDropdown from "@/components/ui/SortDropdown";
interface UserPageProps {
  searchParams: {
    offset?: string;
    limit?: string;
    search?: string;
    sort?: string;
  };
}

const drizzleManager = new DrizzleManager();
const db = drizzleManager.getPoolDrizzle();
const userRepository = new UserRepository(db);

export default async function UserManagement({ searchParams }: UserPageProps) {
  const offset = parseInt(searchParams.offset || "0", 10);
  const limit = parseInt(searchParams.limit || "8", 10);
  const search = searchParams.search || "";
  const sort = searchParams.sort || "title-asc";
  const response = await userRepository.list({ offset, limit, search, sort });

  if (!response) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-2xl text-red-500 bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
          Oops, something went wrong.
        </p>
      </div>
    );
  }

  const { items: users, pagination } = response;

  const totalPages = Math.ceil(pagination.total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 bg-gray-950 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
          User Management
        </h1>
        <div className="mb-8">
          <div className="flex justify-between items-center space-x-4">
            <Search
              placeholder="Search users by name, email, role..."
              baseUrl="/admin/users"
            />
            <SortDropdown defaultSort={sort} type="user" />
          </div>
          <div className="mt-4 flex w-full justify-center">
            <PaginationControls
              totalPages={totalPages}
              currentPage={currentPage}
              baseUrl="/admin/users"
            />
          </div>{" "}
        </div>

        <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-xl">
          <UsersTable users={users} />
        </div>
        <div className="mt-6 sm:mt-8 flex justify-center"></div>
      </div>
    </section>
  );
}
