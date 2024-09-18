"use client";

import React, { useState } from "react";
import { PencilIcon, Trash2Icon, PlusCircleIcon } from "lucide-react";
import { IUser } from "@/repository/models/user.model";
import { useRouter } from "next/navigation";
import EditUserForm from "@/components/adminComponents/EditUserForm";
import Modal from "@/components/adminComponents/Modal";
import {
  deleteUser,
  getUserInfo,
  updateUserInfo,
  addUser,
} from "@/app/admin/users/action";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UserTableProps {
  users: IUser[];
}

export default function UsersTable({ users }: UserTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editUserData, setEditUserData] = useState<IUser | null>(null);

  const router = useRouter();

  const handleAddUserClick = () => {
    setIsEditing(true);
    setEditUserData({
      userid: 0,
      username: "",
      email: "",
      password: "",
      role: "user",
    });
  };

  const handleEditClick = async (id: number) => {
    try {
      const userInfo = await getUserInfo(id);
      if (userInfo) {
        setEditUserData(userInfo.userData);
        setIsEditing(true);
        setSelectedUserId(id);
      } else {
        toast.error("Failed to fetch user details.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching user details.");
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedUserId !== null) {
      try {
        const result = await deleteUser(selectedUserId);

        if (result.success) {
          toast.success("User deleted successfully.");
          router.refresh();
        } else {
          throw new Error(result.error || "Failed to delete user.");
        }
      } catch (error) {
        toast.error("Failed to delete user.");
      } finally {
        setIsModalOpen(false);
      }
    }
  };

  const handleSaveChanges = async (updatedUserData: IUser) => {
    try {
      let result;
      if (editUserData?.userid === 0) {
        result = await addUser(updatedUserData);
        toast.success("User added successfully.");
      } else {
        result = await updateUserInfo(updatedUserData);
        toast.success("User updated successfully.");
      }

      setIsEditing(false);
      setEditUserData(null);
      router.refresh();
    } catch (error) {
      toast.error("Failed to save user.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditUserData(null);
  };

  return (
    <>
      <div className="mb-4 mt-4 flex justify-center">
        <button
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          onClick={handleAddUserClick}
        >
          <PlusCircleIcon className="h-5 w-5" />
          <span>Add User</span>
        </button>
      </div>
      <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-xl">
        <table className="min-w-full text-xs sm:text-sm text-left text-gray-300">
          <thead className="bg-gray-800 text-gray-100">
            <tr>
              <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold">
                User ID
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold">
                Username
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold">Email</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold hidden md:table-cell">
                Role
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.map((user) => (
              <tr
                key={user.userid}
                className="hover:bg-gray-800 transition-colors duration-200"
              >
                <td className="px-2 py-2 sm:px-4 sm:py-3">{user.userid}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">{user.username}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">{user.email}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 hidden md:table-cell">
                  {user.role}
                </td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">
                  <div className="flex items-center space-x-3">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 bg-indigo-900 bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                      onClick={() => handleEditClick(user.userid)}
                      aria-label={`Edit ${user.username}`}
                    >
                      <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300 transition-colors duration-200 bg-red-900 bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      onClick={() => handleDeleteClick(user.userid)}
                      aria-label={`Delete ${user.username}`}
                    >
                      <Trash2Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && editUserData && (
        <EditUserForm
          user={editUserData}
          onSave={handleSaveChanges}
          onCancel={handleCancelEdit}
          isNewUser={editUserData.userid === 0}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this user?"
        title="Delete User"
      />

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
        closeButton
      />
    </>
  );
}
