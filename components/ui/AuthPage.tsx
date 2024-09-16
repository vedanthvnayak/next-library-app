"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/ui/AuthForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const toggleAuthMode = () => setIsLogin((prev) => !prev);

  const handleSuccess = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* <div className="text-center">
          <p className="text-gray-400">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </p>
        </div> */}
        <AuthForm
          isLogin={isLogin}
          onAuthModeToggle={toggleAuthMode}
          onSuccess={handleSuccess}
        />
        <div className="text-center text-sm text-gray-500">
          By continuing, you agree to our{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
}
