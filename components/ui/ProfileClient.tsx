"use client";

import { useRef, useState } from "react";
import {
  User,
  Mail,
  Save,
  Edit2,
  X,
  Camera,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { updateUserNameAndPassword } from "@/app/admin/users/action";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/utils/uploadthing";
import { uploadProfileImage } from "@/app/profile/action";

interface Profile {
  name: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
}

interface ProfileClientProps {
  profile: Profile | null;
}

const ProfileClient: React.FC<ProfileClientProps> = ({ profile }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || "");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(
    profile.profilePicture || ""
  );

  const handleImageUploadComplete = (res: any) => {
    if (res?.[0]?.url) {
      setProfileImage(res[0].url);
      // console.log("Uploaded image URL: ", res[0].url);
      uploadProfileImage(profile.email, res[0].url);
    }
  };

  const handleSave = async () => {
    console.log("Saving profile:", { name, password, profileImage });
    await updateUserNameAndPassword(profile!.email, name, password);
    // saveProfileImage(profile!.email, profileImage);
    router.refresh();
    setIsEditing(false);
  };

  // const saveProfileImage = (email: string, imageUrl: string) => {
  //   console.log("Saving profile image for user:", { email, imageUrl });
  //   // Replace with actual API call to save profile image link
  // };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <p className="text-xl text-gray-300 animate-pulse">
          No profile data available
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 rounded-2xl flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="relative inline-block group">
            <img
              src={profileImage}
              alt={profile.name}
              className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-lg transition-all duration-300 group-hover:scale-105"
            />
            {isEditing && (
              <>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={handleImageUploadComplete}
                  onUploadError={(error: Error) =>
                    alert(`ERROR! ${error.message}`)
                  }
                />
              </>
            )}
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            {isEditing ? "Edit Your Profile" : "Your Profile"}
          </h2>
        </div>
        <div className="mt-8 bg-gray-800 py-8 px-6 shadow-2xl sm:rounded-lg sm:px-10 transition-all duration-300 hover:shadow-indigo-500/10">
          {!isEditing ? (
            <div className="space-y-6">
              <ProfileField
                icon={<User className="h-5 w-5" />}
                label="Name"
                value={profile.name}
              />
              <ProfileField
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                value={profile.email}
              />
              <div className="pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
                >
                  <Edit2 className="w-5 h-5 mr-2" aria-hidden="true" />
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-400"
                >
                  Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-400"
                >
                  Password (leave blank to keep current)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    className="block w-full pl-10 pr-10 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-300 focus:outline-none focus:text-gray-300 transition-colors duration-200"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 transform hover:scale-105"
                >
                  <X className="w-5 h-5 mr-2" aria-hidden="true" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
                >
                  <Save className="w-5 h-5 mr-2" aria-hidden="true" />
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileField: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400">{label}</label>
    <div className="mt-1 flex items-center">
      <span className="text-gray-400 mr-2">{icon}</span>
      <span className="text-white">{value}</span>
    </div>
  </div>
);

export default ProfileClient;
