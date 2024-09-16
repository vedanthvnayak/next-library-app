"use client";

import React, { useEffect, useState } from "react";
import { signIn, getProviders } from "next-auth/react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { addUser } from "@/app/admin/users/action";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS

interface AuthFormProps {
  isLogin: boolean;
  onAuthModeToggle: () => void;
  onSuccess: () => void;
}

export default function AuthForm({
  isLogin,
  onAuthModeToggle,
  onSuccess,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [providers, setProviders] = useState<any>(null);
  const router = useRouter(); // Initialize useRouter for redirection

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        if (result?.error) {
          console.error("Sign In failed:", result.error);
          toast.error("Failed to sign in. Please check your credentials.");
        } else {
          toast.success("Sign In successful! Redirecting...");
          setTimeout(() => {
            router.push("/admin"); // Redirect to your desired page
          }, 1000); // Delay for better UX
        }
      } else {
        handleRegister();
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      toast.error("An error occurred during authentication. Please try again.");
    }
  };

  const handleRegister = async () => {
    const username = email.split("@")[0];
    console.log("Registering user...", { email, password, username });
    const passwordHash = password;
    await addUser({
      username,
      email,
      passwordHash,
      userId: 0,
      role: "user",
    });

    toast.success("Account created successfully! login to access account ...");
    setTimeout(() => {
      router.push("/login"); // Redirect to login page after successful registration
    }, 1500);
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="bg-gray-900 text-gray-100 p-8 sm:p-12 rounded-2xl shadow-2xl max-w-md mx-auto border border-gray-800">
      <ToastContainer position="top-right" autoClose={3000} />{" "}
      {/* Notification container */}
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-100">
        {isLogin ? "Sign In" : "Create Your Account"}
      </h2>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2 text-gray-300"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-2 text-gray-300"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-100 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEyeSlash className="text-lg" />
              ) : (
                <FaEye className="text-lg" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm font-medium"
        >
          {isLogin ? "Sign In" : "Create Account"}
        </button>
      </form>
      <div className="flex items-center my-6">
        <hr className="flex-grow border-gray-800" />
        <span className="mx-4 text-sm text-gray-500">or</span>
        <hr className="flex-grow border-gray-800" />
      </div>
      <div className="flex justify-center">
        {providers &&
          Object.values(providers).map(
            (provider: any) =>
              provider.name === "Google" && (
                <button
                  key={provider.name}
                  onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                  className="flex items-center justify-center text-gray-100 bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-3 w-full max-w-xs transition-colors duration-300 border border-gray-700"
                >
                  <FaGoogle className="mr-2 text-lg" />
                  <span className="text-sm font-medium">
                    Sign in with Google
                  </span>
                </button>
              )
          )}
      </div>
      <div className="text-center mt-6">
        <p className="text-sm text-gray-400">
          {isLogin ? "New to our platform?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={onAuthModeToggle}
            className="text-blue-400 hover:underline font-medium"
          >
            {isLogin ? "Create Account" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
