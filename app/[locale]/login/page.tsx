import React from "react";
import AuthPage from "@/components/ui/AuthPage";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            {/* <h1 className="text-4xl font-bold text-center mb-8">
              Welcome Back
            </h1> */}
            <AuthPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
