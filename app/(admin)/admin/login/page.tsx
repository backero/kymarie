"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Leaf, Eye, EyeOff, Lock } from "lucide-react";
import { adminLogin } from "@/actions/admin";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const result = await adminLogin(data);
      if (result.success) {
        toast.success("Welcome back!");
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-700 flex items-center justify-center px-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 11px
            )`,
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Leaf
              className="w-8 h-8 text-amber-400"
              strokeWidth={1.5}
            />
            <span className="font-display text-3xl text-cream-100 tracking-wide">
              Kumarie
            </span>
          </div>
          <p className="font-body text-xs tracking-widest uppercase text-cream-400">
            Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 md:p-10">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-medium text-forest-700 mb-1">
              Welcome back
            </h1>
            <p className="font-body text-sm text-sage-500">
              Sign in to access the admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-600 block mb-2">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className="w-full border border-cream-300 px-4 py-3 font-body text-sm text-forest-700 focus:outline-none focus:border-forest-400 bg-cream-50 placeholder-sage-300"
                placeholder="admin@kumarie.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 font-body">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-600 block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full border border-cream-300 px-4 py-3 pr-12 font-body text-sm text-forest-700 focus:outline-none focus:border-forest-400 bg-cream-50 placeholder-sage-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-forest-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 font-body">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-forest-500 hover:bg-forest-600 disabled:bg-sage-300 text-cream-100 font-body font-medium tracking-widest uppercase text-xs py-4 transition-colors duration-300 mt-2"
            >
              <Lock className="w-4 h-4" />
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-cream-300 text-center">
            <a
              href="/"
              className="font-body text-xs text-sage-400 hover:text-forest-600 transition-colors"
            >
              ← Back to website
            </a>
          </div>
        </div>

        <p className="text-center font-body text-xs text-cream-500 mt-6">
          © {new Date().getFullYear()} Kumarie. All rights reserved.
        </p>
      </div>
    </div>
  );
}
