"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2, ArrowRight, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function UserLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/profile";

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
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        role: "user",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back!");
        router.push(redirectTo);
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Kumarie"
              width={140}
              height={56}
              className="h-10 w-auto object-contain mx-auto"
              priority
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-cream-300 shadow-sm p-8">
          {/* Header */}
          <div className="mb-7">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-forest-50 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-forest-500" strokeWidth={1.5} />
              </div>
              <span className="font-body text-[10px] tracking-widest uppercase text-sage-400">
                Your Account
              </span>
            </div>
            <h1 className="font-display text-2xl font-medium text-forest-700">
              Sign in
            </h1>
            <p className="font-body text-sm text-sage-500 mt-1">
              Welcome back — we missed you.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-500 block mb-2">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className="w-full border border-cream-300 rounded-xl px-4 py-3 font-body text-sm text-forest-700 focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-400/10 bg-white placeholder-sage-300 transition-all duration-200"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 font-body">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-500 block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full border border-cream-300 rounded-xl px-4 py-3 pr-12 font-body text-sm text-forest-700 focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-400/10 bg-white placeholder-sage-300 transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 font-body">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-forest-500 hover:bg-forest-400 disabled:bg-sage-300 text-white font-body font-medium tracking-widest uppercase text-xs py-3.5 rounded-xl transition-colors duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center font-body text-sm text-sage-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-forest-500 hover:text-forest-400 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="font-body text-xs text-sage-400 hover:text-forest-600 transition-colors"
          >
            ← Continue shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
