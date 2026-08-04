"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { subscribeNewsletter } from "@/actions/admin";
import toast from "react-hot-toast";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await subscribeNewsletter(email);
      if (result.success) {
        toast.success(result.message || "Successfully subscribed!");
        setSubscribed(true);
        setEmail("");
      } else {
        toast.error(result.error || "Subscription failed");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (subscribed) {
    return (
      <div className="flex items-center justify-center gap-2 max-w-md mx-auto bg-white border border-forest-200 text-forest-600 font-body text-sm px-5 py-3.5 rounded-full">
        <CheckCircle2 className="w-4 h-4" />
        You&rsquo;re on the list — welcome to the ritual.
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-white border border-cream-300 hover:border-sage-300 focus:border-amber-400 text-forest-500 placeholder-sage-300 font-body text-sm px-5 py-3.5 focus:outline-none transition-colors rounded-full"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 bg-forest-500 hover:bg-forest-400 disabled:bg-sage-300 text-white font-body font-medium tracking-widest uppercase text-xs px-7 py-3.5 transition-all duration-200 whitespace-nowrap rounded-full"
      >
        {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        Subscribe
      </button>
    </form>
  );
}
