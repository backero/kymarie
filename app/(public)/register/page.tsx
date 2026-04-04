"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2, ArrowRight, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { registerUser } from "@/actions/userAuth";
import toast from "react-hot-toast";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });

      if (!result.success) {
        toast.error(result.error || "Registration failed");
        return;
      }

      // Auto sign-in after registration
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        role: "user",
        redirect: false,
      });

      if (signInResult?.error) {
        toast.success("Account created! Please sign in.");
        router.push("/login");
      } else {
        toast.success("Account created! Welcome to Kumarie.");
        router.push("/profile");
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
          <div className="mb-7">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-forest-50 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-forest-500" strokeWidth={1.5} />
              </div>
              <span className="font-body text-[10px] tracking-widest uppercase text-sage-400">
                New Account
              </span>
            </div>
            <h1 className="font-display text-2xl font-medium text-forest-700">
              Create account
            </h1>
            <p className="font-body text-sm text-sage-500 mt-1">
              Join Kumarie and enjoy exclusive benefits.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-500 block mb-2">
                Full Name
              </label>
              <input
                {...register("name")}
                type="text"
                autoComplete="name"
                className="w-full border border-cream-300 rounded-xl px-4 py-3 font-body text-sm text-forest-700 focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-400/10 bg-white placeholder-sage-300 transition-all duration-200"
                placeholder="Your name"
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-xs mt-1.5 font-body overflow-hidden"
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email */}
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
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-xs mt-1.5 font-body overflow-hidden"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Phone (optional) */}
            <div>
              <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-500 block mb-2">
                Phone{" "}
                <span className="normal-case text-sage-300 tracking-normal font-normal">
                  (optional)
                </span>
              </label>
              <input
                {...register("phone")}
                type="tel"
                autoComplete="tel"
                className="w-full border border-cream-300 rounded-xl px-4 py-3 font-body text-sm text-forest-700 focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-400/10 bg-white placeholder-sage-300 transition-all duration-200"
                placeholder="+91 00000 00000"
              />
            </div>

            {/* Password */}
            <div>
              <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-500 block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="w-full border border-cream-300 rounded-xl px-4 py-3 pr-12 font-body text-sm text-forest-700 focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-400/10 bg-white placeholder-sage-300 transition-all duration-200"
                  placeholder="Min. 8 characters"
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
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-xs mt-1.5 font-body overflow-hidden"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm password */}
            <div>
              <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-500 block mb-2">
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full border border-cream-300 rounded-xl px-4 py-3 font-body text-sm text-forest-700 focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-400/10 bg-white placeholder-sage-300 transition-all duration-200"
                placeholder="••••••••"
              />
              <AnimatePresence>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-xs mt-1.5 font-body overflow-hidden"
                  >
                    {errors.confirmPassword.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-forest-500 hover:bg-forest-400 disabled:bg-sage-300 text-white font-body font-medium tracking-widest uppercase text-xs py-3.5 rounded-xl transition-colors duration-200 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center font-body text-sm text-sage-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-forest-500 hover:text-forest-400 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

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
