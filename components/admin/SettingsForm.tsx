"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { updateSettings } from "@/actions/settings";
import toast from "react-hot-toast";

const settingsFormSchema = z.object({
  shippingFee: z.coerce.number().min(0),
  freeShippingThreshold: z.coerce.number().min(0),
  businessAddress: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  whatsappNumber: z.string().optional(),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
});

type SettingsFormData = z.infer<typeof settingsFormSchema>;

interface Settings {
  shippingFee: number;
  freeShippingThreshold: number;
  businessAddress: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  whatsappNumber: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      shippingFee: settings.shippingFee,
      freeShippingThreshold: settings.freeShippingThreshold,
      businessAddress: settings.businessAddress ?? "",
      contactEmail: settings.contactEmail ?? "",
      contactPhone: settings.contactPhone ?? "",
      whatsappNumber: settings.whatsappNumber ?? "",
      instagramUrl: settings.instagramUrl ?? "",
      facebookUrl: settings.facebookUrl ?? "",
      twitterUrl: settings.twitterUrl ?? "",
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true);
    try {
      const result = await updateSettings(data);
      if (result.success) {
        toast.success("Settings saved");
      } else {
        toast.error(result.error || "Failed to save settings");
      }
    } catch (error) {
      console.error("Settings form error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 px-4 py-2.5 font-body text-sm text-gray-800 focus:outline-none focus:border-forest-400 rounded bg-gray-50";
  const labelClass =
    "font-body text-xs font-medium tracking-wider uppercase text-gray-600 block mb-2";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
        <h2 className="font-display text-lg text-forest-700">Shipping</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Shipping Fee (₹)</label>
            <input {...register("shippingFee")} type="number" step="1" className={inputClass} />
            {errors.shippingFee && (
              <p className="text-red-500 text-xs mt-1 font-body">{errors.shippingFee.message}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>Free Shipping Above (₹)</label>
            <input
              {...register("freeShippingThreshold")}
              type="number"
              step="1"
              className={inputClass}
            />
            {errors.freeShippingThreshold && (
              <p className="text-red-500 text-xs mt-1 font-body">
                {errors.freeShippingThreshold.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
        <h2 className="font-display text-lg text-forest-700">Business Info</h2>
        <div>
          <label className={labelClass}>Business Address</label>
          <textarea {...register("businessAddress")} rows={2} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Contact Email</label>
            <input {...register("contactEmail")} type="email" className={inputClass} />
            {errors.contactEmail && (
              <p className="text-red-500 text-xs mt-1 font-body">{errors.contactEmail.message}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>Contact Phone</label>
            <input {...register("contactPhone")} type="tel" className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>WhatsApp Number (with country code, e.g. 91XXXXXXXXXX)</label>
          <input {...register("whatsappNumber")} type="tel" className={inputClass} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
        <h2 className="font-display text-lg text-forest-700">Social Links</h2>
        <div>
          <label className={labelClass}>Instagram URL</label>
          <input {...register("instagramUrl")} type="url" className={inputClass} placeholder="https://instagram.com/kumarie" />
          {errors.instagramUrl && (
            <p className="text-red-500 text-xs mt-1 font-body">{errors.instagramUrl.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Facebook URL</label>
          <input {...register("facebookUrl")} type="url" className={inputClass} placeholder="https://facebook.com/kumarie" />
          {errors.facebookUrl && (
            <p className="text-red-500 text-xs mt-1 font-body">{errors.facebookUrl.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Twitter / X URL</label>
          <input {...register("twitterUrl")} type="url" className={inputClass} placeholder="https://x.com/kumarie" />
          {errors.twitterUrl && (
            <p className="text-red-500 text-xs mt-1 font-body">{errors.twitterUrl.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end bg-white border border-gray-200 rounded-lg px-6 py-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-forest-500 hover:bg-forest-600 disabled:bg-gray-300 text-white font-body font-medium text-sm px-6 py-2.5 rounded-lg transition-colors"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
