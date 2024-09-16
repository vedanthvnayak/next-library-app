import React from "react";
import AdminSidebar from "@/components/adminComponents/AdminSidebar";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
      <AdminSidebar />

      <div className="flex-1 p-10">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
