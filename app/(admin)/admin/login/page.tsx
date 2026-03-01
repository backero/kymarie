"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
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
    <div className="min-h-screen bg-forest-700 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated gradient orbs in background */}
      <motion.div
        className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-amber-400/4 blur-3xl pointer-events-none"
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Diagonal stripe pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
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

      <div className="relative w-full max-w-md">
        {/* Logo — slides down */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center mb-2">
            <Image
              src="/logo.png"
              alt="Kumarie"
              width={160}
              height={64}
              className="h-14 w-auto object-contain brightness-0 invert"
              priority
            />
          </div>
          <p className="font-body text-xs tracking-widest uppercase text-cream-400">
            Admin Portal
          </p>
        </motion.div>

        {/* Login Card — scales in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white p-8 md:p-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.28 }}
            className="mb-8"
          >
            <h1 className="font-display text-2xl font-medium text-forest-700 mb-1">
              Welcome back
            </h1>
            <p className="font-body text-sm text-sage-500">
              Sign in to access the admin panel
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.33 }}
            >
              <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-600 block mb-2">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className="w-full border border-cream-300 px-4 py-3 font-body text-sm text-forest-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 bg-cream-50 placeholder-sage-300 transition-all duration-200"
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
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-600 block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full border border-cream-300 px-4 py-3 pr-12 font-body text-sm text-forest-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 bg-cream-50 placeholder-sage-300 transition-all duration-200"
                  placeholder="••••••••"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileTap={{ scale: 0.85 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-forest-600 transition-colors"
                >
                  <AnimatePresence mode="wait">
                    {showPassword ? (
                      <motion.span
                        key="hide"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="show"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <Eye className="w-5 h-5" strokeWidth={1.5} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
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
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.48 }}
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={isLoading ? {} : { scale: 1.02 }}
                whileTap={isLoading ? {} : { scale: 0.97 }}
                transition={{ duration: 0.14 }}
                className="w-full flex items-center justify-center gap-2 bg-forest-500 hover:bg-forest-600 disabled:bg-sage-300 text-cream-100 font-body font-medium tracking-widest uppercase text-xs py-4 transition-colors duration-300 mt-2"
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
                      Signing in...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="signin"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Sign In
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mt-6 pt-6 border-t border-cream-300 text-center"
          >
            <a
              href="/"
              className="font-body text-xs text-sage-400 hover:text-forest-600 transition-colors"
            >
              ← Back to website
            </a>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="text-center font-body text-xs text-cream-500 mt-6"
        >
          © {new Date().getFullYear()} Kumarie. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
}
