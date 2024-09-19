import { getServerSession } from "next-auth/next";
import ProfileClient from "@/components/ui/ProfileClient";
import RequestedBooks from "@/components/ui/RequestedBooks";
import { authOptions } from "@/utils/authOptions";
import { User, BookOpen, Settings, LogIn } from "lucide-react";
import Link from "next/link";
import { getUserInfo } from "../admin/users/action";

// Updated to Vercel
async function getUserProfile(userId: number): Promise<any> {
  const session = await getServerSession(authOptions);
  const userInDb = await getUserInfo(userId);
  return {
    id: userId,
    name: userInDb.userData.username,
    email: userInDb.userData.email,
    password: userInDb.userData.password,
    profilePicture: userInDb.userData.profileimage,
  };
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  const userProfile = session ? await getUserProfile(session.user.id) : null;
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4 pt-20">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl text-center transition-all duration-300 hover:shadow-indigo-500/30">
          <User className="w-16 h-16 text-indigo-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-xl font-semibold mb-6">
            Please log in to view your profile.
          </p>
          <Link
            href="/login"
            className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-500 transition-all duration-300 inline-flex items-center transform hover:scale-105"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 sm:px-6 lg:px-8 py-12 pt-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12 text-center">
          Welcome, {userProfile.name}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              <ProfileClient profile={userProfile} />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <RequestedBooks userId={userProfile.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
