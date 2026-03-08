"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Eye, EyeOff, Lock, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="min-h-screen bg-cream-100 flex">
      {/* ── Left panel (decorative) — hidden on small screens ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-forest-500 flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Logo */}
        <div className="relative">
          <Image
            src="/logo.png"
            alt="Kumarie"
            width={140}
            height={56}
            className="h-10 w-auto object-contain brightness-0 invert"
            priority
          />
        </div>

        {/* Center text */}
        <div className="relative space-y-4">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-white/50">
            Admin Portal
          </p>
          <h2 className="font-display text-4xl font-light text-white leading-snug">
            Manage your<br />store with ease.
          </h2>
          <p className="font-body text-sm text-white/50 leading-relaxed max-w-xs">
            Products, orders, and analytics — all in one clean dashboard.
          </p>
        </div>

        {/* Bottom badge */}
        <div className="relative flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-white/60" strokeWidth={1.5} />
          </div>
          <p className="font-body text-xs text-white/40">
            Secured with encrypted authentication
          </p>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          {/* Logo (mobile only) */}
          <div className="lg:hidden mb-10 text-center">
            <Image
              src="/logo.png"
              alt="Kumarie"
              width={140}
              height={56}
              className="h-10 w-auto object-contain mx-auto"
              priority
            />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-display text-2xl font-medium text-forest-700 mb-1">
              Welcome back
            </h1>
            <p className="font-body text-sm text-sage-500">
              Sign in to access the admin panel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                placeholder="admin@kumarie.com"
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    className="text-red-500 text-xs mt-1.5 font-body overflow-hidden"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
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
                  autoComplete="current-password"
                  className="w-full border border-cream-300 rounded-xl px-4 py-3 pr-12 font-body text-sm text-forest-700 focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-400/10 bg-white placeholder-sage-300 transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600 transition-colors"
                >
                  <AnimatePresence mode="wait">
                    {showPassword ? (
                      <motion.span
                        key="hide"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="show"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Eye className="w-4 h-4" strokeWidth={1.5} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    className="text-red-500 text-xs mt-1.5 font-body overflow-hidden"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-forest-500 hover:bg-forest-400 disabled:bg-sage-300 text-white font-body font-medium tracking-widest uppercase text-xs py-3.5 rounded-xl transition-colors duration-200 mt-2"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in…
                  </motion.span>
                ) : (
                  <motion.span
                    key="signin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-cream-300 flex items-center justify-between">
            <a
              href="/"
              className="font-body text-xs text-sage-400 hover:text-forest-600 transition-colors"
            >
              ← Back to website
            </a>
            <p className="font-body text-xs text-sage-300">
              © {new Date().getFullYear()} Kumarie
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
