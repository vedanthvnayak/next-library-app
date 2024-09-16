"use client";

import React from "react";
import { IUser } from "@/repository/models/user.model";

interface EditUserFormProps {
  user: IUser;
  onSave: (userData: IUser) => void;
  onCancel: () => void;
  isNewUser: boolean;
}

export default function EditUserForm({
  user,
  onSave,
  onCancel,
  isNewUser,
}: EditUserFormProps) {
  const [userData, setUserData] = React.useState<IUser>(user);
  const [passwordHash, setPasswordHash] = React.useState<string>(
    user.passwordHash || ""
  );
  const [password, setPassword] = React.useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(value);
    } else {
      setUserData({
        ...userData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUserData = {
      ...userData,
      passwordHash: password ? password : passwordHash,
    };
    onSave(updatedUserData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-indigo-300">
            {isNewUser ? "Add User" : "Edit User"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-indigo-200"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={userData.username || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-100"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-indigo-200"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-100"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-indigo-200"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={userData.role || "user"}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-100"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Render password field for both new and existing users */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-indigo-200"
              >
                {isNewUser ? "Password" : "Change Password (optional)"}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder={
                  isNewUser ? "Enter password" : "Leave blank to keep the same"
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-100"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
