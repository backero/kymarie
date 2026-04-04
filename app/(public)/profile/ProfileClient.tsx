"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import {
  User, ShoppingBag, Heart, LogOut, ChevronRight, ChevronDown,
  Package, CheckCircle2, Clock, Truck, XCircle, Edit3, Save,
  Loader2, Leaf, Phone, Mail, Calendar, Eye, EyeOff, Lock,
  MapPin, Plus, Star, Trash2, CreditCard, ReceiptText, Copy,
  PackageCheck, Ban, RefreshCcw, CircleDot,
} from "lucide-react";
import {
  updateUserProfile, changeUserPassword,
} from "@/actions/userAuth";
import { removeFromWishlist } from "@/actions/wishlist";
import {
  addAddress, updateAddress, deleteAddress, setPrimaryAddress,
} from "@/actions/addresses";
import type { AddressInput } from "@/actions/addresses";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { format } from "date-fns";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type UserData = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: Date;
};

type OrderItem = {
  id: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  total: number;
  subtotal: number;
  shippingFee: number;
  discount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
};

type WishlistItem = {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    thumbnail: string | null;
    images: string[];
    category: { name: string };
  };
};

export type SavedAddress = {
  id: string;
  label: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isPrimary: boolean;
};

type Tab = "orders" | "info" | "addresses" | "wishlist" | "security";

// ─────────────────────────────────────────────────────────────────────────────
// Order status timeline config
// ─────────────────────────────────────────────────────────────────────────────

const TIMELINE_STEPS = [
  { key: "PENDING",    label: "Order Placed",  icon: ReceiptText,  desc: "We've received your order." },
  { key: "CONFIRMED",  label: "Confirmed",     icon: CheckCircle2, desc: "Your order has been confirmed." },
  { key: "PROCESSING", label: "Processing",    icon: Package,      desc: "We're preparing your items." },
  { key: "SHIPPED",    label: "Shipped",       icon: Truck,        desc: "Your order is on the way." },
  { key: "DELIVERED",  label: "Delivered",     icon: PackageCheck, desc: "Order delivered successfully." },
] as const;

const STATUS_ORDER = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

const STATUS_META: Record<string, { label: string; chipColor: string; icon: React.ElementType }> = {
  PENDING:    { label: "Pending",    chipColor: "text-amber-700 bg-amber-50 border-amber-200",    icon: Clock },
  CONFIRMED:  { label: "Confirmed",  chipColor: "text-blue-700 bg-blue-50 border-blue-200",      icon: CheckCircle2 },
  PROCESSING: { label: "Processing", chipColor: "text-violet-700 bg-violet-50 border-violet-200", icon: Package },
  SHIPPED:    { label: "Shipped",    chipColor: "text-cyan-700 bg-cyan-50 border-cyan-200",       icon: Truck },
  DELIVERED:  { label: "Delivered",  chipColor: "text-green-700 bg-green-50 border-green-200",   icon: PackageCheck },
  CANCELLED:  { label: "Cancelled",  chipColor: "text-red-700 bg-red-50 border-red-200",         icon: Ban },
  REFUNDED:   { label: "Refunded",   chipColor: "text-sage-700 bg-sage-50 border-sage-200",      icon: RefreshCcw },
};

// ─────────────────────────────────────────────────────────────────────────────
// Form schemas
// ─────────────────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const addressSchema = z.object({
  label: z.string().min(1).default("Home"),
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Valid 6-digit pincode required"),
  country: z.string().default("India"),
  isPrimary: z.boolean().default(false),
});

const indianStates = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands",
  "Chandigarh","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];

const ADDRESS_LABELS = ["Home", "Work", "Other"];

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function ProfileClient({
  user,
  orders,
  wishlistItems: initialWishlist,
  addresses: initialAddresses,
}: {
  user: UserData;
  orders: Order[];
  wishlistItems: WishlistItem[];
  addresses: SavedAddress[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [wishlist, setWishlist]   = useState(initialWishlist);
  const [addresses, setAddresses] = useState(initialAddresses);

  // expanded order id
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [editingProfile, setEditingProfile]   = useState(false);
  const [savingProfile, setSavingProfile]     = useState(false);
  const [showCurrentPw, setShowCurrentPw]     = useState(false);
  const [showNewPw, setShowNewPw]             = useState(false);
  const [savingPassword, setSavingPassword]   = useState(false);

  const [showAddressForm, setShowAddressForm]       = useState(false);
  const [editingAddressId, setEditingAddressId]     = useState<string | null>(null);
  const [savingAddress, setSavingAddress]           = useState(false);
  const [deletingAddressId, setDeletingAddressId]   = useState<string | null>(null);

  const nameInitials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, phone: user.phone ?? "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  const addressForm = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: { label: "Home", country: "India", isPrimary: false },
  });

  // ── handlers ────────────────────────────────────────────────────────────

  const handleProfileSave = async (data: z.infer<typeof profileSchema>) => {
    setSavingProfile(true);
    try {
      const result = await updateUserProfile(user.id, data);
      if (result.success) { toast.success("Profile updated"); setEditingProfile(false); router.refresh(); }
      else toast.error(result.error ?? "Failed to update");
    } catch { toast.error("Something went wrong"); }
    finally { setSavingProfile(false); }
  };

  const handlePasswordChange = async (data: z.infer<typeof passwordSchema>) => {
    setSavingPassword(true);
    try {
      const result = await changeUserPassword(user.id, { currentPassword: data.currentPassword, newPassword: data.newPassword });
      if (result.success) { toast.success("Password changed"); passwordForm.reset(); }
      else toast.error(result.error ?? "Failed to change password");
    } catch { toast.error("Something went wrong"); }
    finally { setSavingPassword(false); }
  };

  const handleRemoveWishlist = async (productId: string) => {
    await removeFromWishlist(user.id, productId);
    setWishlist((prev) => prev.filter((i) => i.productId !== productId));
    toast.success("Removed from wishlist");
  };

  const openAddressForm = (addr?: SavedAddress) => {
    if (addr) {
      addressForm.reset({ label: addr.label, name: addr.name, phone: addr.phone, addressLine1: addr.addressLine1, addressLine2: addr.addressLine2 ?? "", city: addr.city, state: addr.state, pincode: addr.pincode, country: addr.country, isPrimary: addr.isPrimary });
      setEditingAddressId(addr.id);
    } else {
      addressForm.reset({ label: "Home", country: "India", isPrimary: addresses.length === 0, name: user.name, phone: user.phone ?? "" });
      setEditingAddressId(null);
    }
    setShowAddressForm(true);
  };

  const handleAddressSave = async (data: z.infer<typeof addressSchema>) => {
    setSavingAddress(true);
    try {
      const payload: AddressInput = { label: data.label, name: data.name, phone: data.phone, addressLine1: data.addressLine1, addressLine2: data.addressLine2, city: data.city, state: data.state, pincode: data.pincode, country: data.country, isPrimary: data.isPrimary };
      const result = editingAddressId
        ? await updateAddress(editingAddressId, user.id, payload)
        : await addAddress(user.id, payload);
      if (result.success) { toast.success(editingAddressId ? "Address updated" : "Address added"); setShowAddressForm(false); setEditingAddressId(null); router.refresh(); }
      else toast.error(result.error ?? "Failed to save address");
    } catch { toast.error("Something went wrong"); }
    finally { setSavingAddress(false); }
  };

  const handleDeleteAddress = async (id: string) => {
    setDeletingAddressId(id);
    try {
      const result = await deleteAddress(id, user.id);
      if (result.success) { setAddresses((prev) => prev.filter((a) => a.id !== id)); toast.success("Address deleted"); router.refresh(); }
      else toast.error(result.error ?? "Failed to delete");
    } catch { toast.error("Something went wrong"); }
    finally { setDeletingAddressId(null); }
  };

  const handleSetPrimary = async (id: string) => {
    const result = await setPrimaryAddress(id, user.id);
    if (result.success) { setAddresses((prev) => prev.map((a) => ({ ...a, isPrimary: a.id === id }))); toast.success("Default address updated"); }
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "orders",    label: "My Orders",  icon: ShoppingBag, count: orders.length },
    { id: "info",      label: "Profile",    icon: User },
    { id: "addresses", label: "Addresses",  icon: MapPin, count: addresses.length },
    { id: "wishlist",  label: "Wishlist",   icon: Heart, count: wishlist.length },
    { id: "security",  label: "Security",   icon: Lock },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-cream-300 shadow-sm p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
        >
          <div className="w-16 h-16 rounded-2xl bg-forest-500 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="font-display text-xl font-bold text-white">{nameInitials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl font-semibold text-forest-700 truncate">{user.name}</h1>
            <p className="font-body text-sm text-sage-500 mt-0.5">{user.email}</p>
            <p className="font-body text-xs text-sage-400 mt-1">Member since {format(new Date(user.createdAt), "MMMM yyyy")}</p>
          </div>
          <div className="flex gap-4 sm:gap-6 flex-shrink-0">
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-forest-700">{orders.length}</p>
              <p className="font-body text-[10px] text-sage-400 uppercase tracking-wider mt-0.5">Orders</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-forest-700">{wishlist.length}</p>
              <p className="font-body text-[10px] text-sage-400 uppercase tracking-wider mt-0.5">Saved</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 font-body text-xs text-sage-400 hover:text-red-500 hover:bg-red-50 border border-cream-300 hover:border-red-200 rounded-xl px-3.5 py-2.5 transition-all flex-shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} /> Sign out
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-cream-300 shadow-sm p-1.5 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-xl font-body text-sm transition-all duration-200 whitespace-nowrap flex-1 justify-center min-w-0",
                  activeTab === tab.id ? "bg-forest-500 text-white shadow-sm" : "text-sage-500 hover:text-forest-600 hover:bg-cream-100"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[20px] text-center", activeTab === tab.id ? "bg-white/20 text-white" : "bg-cream-200 text-sage-600")}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >

            {/* ── ORDERS ───────────────────────────────────────────────── */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <EmptyState icon={ShoppingBag} title="No orders yet" description="When you place an order, it will appear here." action={{ label: "Start Shopping", href: "/products" }} />
                ) : (
                  orders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      expanded={expandedOrderId === order.id}
                      onToggle={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                    />
                  ))
                )}
              </div>
            )}

            {/* ── PROFILE INFO ─────────────────────────────────────────── */}
            {activeTab === "info" && (
              <div className="bg-white rounded-2xl border border-cream-300 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-lg font-semibold text-forest-700">Personal Information</h2>
                  {!editingProfile ? (
                    <button onClick={() => setEditingProfile(true)} className="flex items-center gap-1.5 font-body text-xs text-sage-500 hover:text-forest-600 border border-cream-300 hover:border-forest-300 rounded-xl px-3 py-2 transition-all">
                      <Edit3 className="w-3.5 h-3.5" strokeWidth={1.5} /> Edit
                    </button>
                  ) : (
                    <button onClick={() => { setEditingProfile(false); profileForm.reset({ name: user.name, phone: user.phone ?? "" }); }} className="font-body text-xs text-sage-400 hover:text-sage-600 transition-colors">Cancel</button>
                  )}
                </div>
                {!editingProfile ? (
                  <div className="space-y-5">
                    <InfoRow icon={User}     label="Full Name"     value={user.name} />
                    <InfoRow icon={Mail}     label="Email Address" value={user.email} />
                    <InfoRow icon={Phone}    label="Phone Number"  value={user.phone ?? "Not provided"} muted={!user.phone} />
                    <InfoRow icon={Calendar} label="Member Since"  value={format(new Date(user.createdAt), "MMMM d, yyyy")} />
                  </div>
                ) : (
                  <form onSubmit={profileForm.handleSubmit(handleProfileSave)} className="space-y-5">
                    <FormInput label="Full Name" error={profileForm.formState.errors.name?.message} required>
                      <input {...profileForm.register("name")} className={inputCls} />
                    </FormInput>
                    <div>
                      <label className={labelCls}>Email Address</label>
                      <input value={user.email} disabled className="w-full border border-cream-200 rounded-xl px-4 py-3 font-body text-sm text-sage-400 bg-cream-50 cursor-not-allowed" />
                      <p className="font-body text-[11px] text-sage-400 mt-1.5">Email cannot be changed.</p>
                    </div>
                    <FormInput label="Phone Number">
                      <input {...profileForm.register("phone")} type="tel" placeholder="+91 00000 00000" className={inputCls} />
                    </FormInput>
                    <div className="flex justify-end pt-2">
                      <button type="submit" disabled={savingProfile} className={saveBtnCls}>
                        {savingProfile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" strokeWidth={1.5} />}
                        Save Changes
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ── ADDRESSES ────────────────────────────────────────────── */}
            {activeTab === "addresses" && (
              <div className="space-y-4">
                {addresses.length === 0 && !showAddressForm ? (
                  <EmptyState icon={MapPin} title="No saved addresses" description="Save your delivery address for faster checkout." onAction={() => openAddressForm()} actionLabel="Add Address" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <motion.div key={addr.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                        className={cn("bg-white rounded-2xl border-2 shadow-sm p-5 relative", addr.isPrimary ? "border-forest-400" : "border-cream-300")}>
                        {addr.isPrimary && (
                          <span className="absolute top-4 right-4 flex items-center gap-1 font-body text-[10px] font-semibold text-forest-500 bg-forest-50 border border-forest-200 px-2 py-0.5 rounded-full">
                            <Star className="w-2.5 h-2.5 fill-forest-500" /> Default
                          </span>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="w-3.5 h-3.5 text-sage-400" strokeWidth={1.5} />
                          <span className="font-body text-[10px] font-semibold tracking-widest uppercase text-sage-500">{addr.label}</span>
                        </div>
                        <p className="font-body text-sm font-medium text-forest-700">{addr.name}</p>
                        <p className="font-body text-xs text-sage-500 mt-1 leading-relaxed">{addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}</p>
                        <p className="font-body text-xs text-sage-500">{addr.city}, {addr.state} — {addr.pincode}</p>
                        <p className="font-body text-xs text-sage-400 mt-1">{addr.phone}</p>
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-cream-200">
                          <button onClick={() => openAddressForm(addr)} className="flex items-center gap-1.5 font-body text-xs text-sage-500 hover:text-forest-600 transition-colors"><Edit3 className="w-3 h-3" strokeWidth={1.5} /> Edit</button>
                          {!addr.isPrimary && <button onClick={() => handleSetPrimary(addr.id)} className="flex items-center gap-1.5 font-body text-xs text-sage-500 hover:text-forest-600 transition-colors"><Star className="w-3 h-3" strokeWidth={1.5} /> Set Default</button>}
                          <button onClick={() => handleDeleteAddress(addr.id)} disabled={deletingAddressId === addr.id} className="flex items-center gap-1.5 font-body text-xs text-sage-400 hover:text-red-500 transition-colors ml-auto">
                            {deletingAddressId === addr.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" strokeWidth={1.5} />} Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    {!showAddressForm && (
                      <button onClick={() => openAddressForm()} className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-cream-300 hover:border-forest-300 rounded-2xl p-8 text-sage-400 hover:text-forest-500 transition-all bg-white">
                        <Plus className="w-6 h-6" strokeWidth={1.5} />
                        <span className="font-body text-sm">Add New Address</span>
                      </button>
                    )}
                  </div>
                )}
                <AnimatePresence>
                  {showAddressForm && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="bg-white rounded-2xl border border-cream-300 shadow-sm p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-display text-lg font-semibold text-forest-700">{editingAddressId ? "Edit Address" : "Add New Address"}</h3>
                        <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddressId(null); }} className="font-body text-xs text-sage-400 hover:text-sage-600 transition-colors">Cancel</button>
                      </div>
                      <form onSubmit={addressForm.handleSubmit(handleAddressSave)} className="space-y-4">
                        <div>
                          <label className={labelCls}>Label</label>
                          <div className="flex gap-2">
                            {ADDRESS_LABELS.map((lbl) => (
                              <button key={lbl} type="button" onClick={() => addressForm.setValue("label", lbl)}
                                className={cn("font-body text-xs px-3 py-1.5 rounded-full border transition-all", addressForm.watch("label") === lbl ? "bg-forest-500 text-white border-forest-500" : "border-cream-300 text-sage-500 hover:border-forest-300")}>
                                {lbl}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormInput label="Full Name" error={addressForm.formState.errors.name?.message} required><input {...addressForm.register("name")} className={inputCls} placeholder="Ananya Kumar" /></FormInput>
                          <FormInput label="Mobile Number" error={addressForm.formState.errors.phone?.message} required><input {...addressForm.register("phone")} type="tel" maxLength={10} className={inputCls} placeholder="9876543210" /></FormInput>
                          <FormInput label="Address Line 1" error={addressForm.formState.errors.addressLine1?.message} required className="sm:col-span-2"><input {...addressForm.register("addressLine1")} className={inputCls} placeholder="House/Flat no., Street, Area" /></FormInput>
                          <FormInput label="Address Line 2" className="sm:col-span-2"><input {...addressForm.register("addressLine2")} className={inputCls} placeholder="Landmark, Colony (optional)" /></FormInput>
                          <FormInput label="City" error={addressForm.formState.errors.city?.message} required><input {...addressForm.register("city")} className={inputCls} placeholder="Bengaluru" /></FormInput>
                          <FormInput label="Pincode" error={addressForm.formState.errors.pincode?.message} required><input {...addressForm.register("pincode")} maxLength={6} className={inputCls} placeholder="560001" /></FormInput>
                          <FormInput label="State" error={addressForm.formState.errors.state?.message} required className="sm:col-span-2">
                            <select {...addressForm.register("state")} className={inputCls}>
                              <option value="">Select state</option>
                              {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </FormInput>
                        </div>
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <input type="checkbox" {...addressForm.register("isPrimary")} className="w-4 h-4 rounded border-cream-300 text-forest-500 focus:ring-forest-400/20 cursor-pointer" />
                          <span className="font-body text-sm text-sage-600 group-hover:text-forest-700 transition-colors">Set as default delivery address</span>
                        </label>
                        <div className="flex justify-end pt-2">
                          <button type="submit" disabled={savingAddress} className={saveBtnCls}>
                            {savingAddress ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" strokeWidth={1.5} />}
                            {editingAddressId ? "Update Address" : "Save Address"}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ── WISHLIST ─────────────────────────────────────────────── */}
            {activeTab === "wishlist" && (
              <div>
                {wishlist.length === 0 ? (
                  <EmptyState icon={Heart} title="Your wishlist is empty" description="Save products you love by clicking the heart icon." action={{ label: "Explore Products", href: "/products" }} />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {wishlist.map((item) => (
                      <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl border border-cream-300 shadow-sm overflow-hidden group">
                        <Link href={`/products/${item.product.slug}`} className="relative block aspect-square bg-cream-100 overflow-hidden">
                          {item.product.thumbnail || item.product.images?.[0] ? (
                            <Image src={item.product.thumbnail || item.product.images[0]} alt={item.product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 50vw, 25vw" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center"><Leaf className="w-8 h-8 text-sage-300" /></div>
                          )}
                          <button onClick={(e) => { e.preventDefault(); handleRemoveWishlist(item.productId); }} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-cream-300 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200">
                            <XCircle className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </Link>
                        <div className="p-3">
                          <p className="font-body text-[10px] text-sage-400 uppercase tracking-wider mb-1">{item.product.category.name}</p>
                          <Link href={`/products/${item.product.slug}`} className="font-display text-sm font-medium text-forest-700 hover:text-amber-500 transition-colors line-clamp-2 leading-snug">{item.product.name}</Link>
                          <p className="font-display text-sm font-semibold text-forest-700 mt-2">{formatPrice(item.product.price)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── SECURITY ─────────────────────────────────────────────── */}
            {activeTab === "security" && (
              <div className="bg-white rounded-2xl border border-cream-300 shadow-sm p-6 max-w-md">
                <h2 className="font-display text-lg font-semibold text-forest-700 mb-6">Change Password</h2>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-5">
                  <FormInput label="Current Password" error={passwordForm.formState.errors.currentPassword?.message} required>
                    <div className="relative">
                      <input {...passwordForm.register("currentPassword")} type={showCurrentPw ? "text" : "password"} className={cn(inputCls, "pr-12")} placeholder="••••••••" />
                      <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600">
                        {showCurrentPw ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                      </button>
                    </div>
                  </FormInput>
                  <FormInput label="New Password" error={passwordForm.formState.errors.newPassword?.message} required>
                    <div className="relative">
                      <input {...passwordForm.register("newPassword")} type={showNewPw ? "text" : "password"} className={cn(inputCls, "pr-12")} placeholder="Min. 8 characters" />
                      <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600">
                        {showNewPw ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                      </button>
                    </div>
                  </FormInput>
                  <FormInput label="Confirm New Password" error={passwordForm.formState.errors.confirmPassword?.message} required>
                    <input {...passwordForm.register("confirmPassword")} type={showNewPw ? "text" : "password"} className={inputCls} placeholder="••••••••" />
                  </FormInput>
                  <button type="submit" disabled={savingPassword} className={cn(saveBtnCls, "w-full justify-center")}>
                    {savingPassword ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />}
                    Update Password
                  </button>
                </form>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OrderCard — expandable card with timeline + detail panel
// ─────────────────────────────────────────────────────────────────────────────

function OrderCard({ order, expanded, onToggle }: { order: Order; expanded: boolean; onToggle: () => void }) {
  const meta   = STATUS_META[order.status] ?? STATUS_META.PENDING;
  const Chip   = meta.icon;
  const isBad  = order.status === "CANCELLED" || order.status === "REFUNDED";

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    toast.success("Order number copied");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-cream-300 shadow-sm overflow-hidden"
    >
      {/* ── Header row ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}
        className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-4 gap-3 hover:bg-cream-50 transition-colors duration-150 text-left cursor-pointer"
      >
        {/* Left: order number + date */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", isBad ? "bg-red-50" : "bg-forest-50")}>
            <Chip className={cn("w-4 h-4", isBad ? "text-red-500" : "text-forest-500")} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-semibold text-forest-700">#{order.orderNumber}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); copyOrderNumber(); }}
                className="text-sage-400 hover:text-forest-500 transition-colors"
                aria-label="Copy order number"
              >
                <Copy className="w-3 h-3" strokeWidth={1.5} />
              </button>
            </div>
            <p className="font-body text-xs text-sage-400 mt-0.5">
              {format(new Date(order.createdAt), "d MMM yyyy")}
              <span className="mx-1.5 text-cream-400">·</span>
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {/* Right: status chip + total + chevron */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-auto sm:ml-0">
          <span className={cn("flex items-center gap-1.5 text-xs font-body font-medium px-2.5 py-1 rounded-full border", meta.chipColor)}>
            <Chip className="w-3 h-3" /> {meta.label}
          </span>
          <span className="font-display text-base font-semibold text-forest-700">{formatPrice(order.total)}</span>
          <ChevronDown className={cn("w-4 h-4 text-sage-400 transition-transform duration-300", expanded && "rotate-180")} />
        </div>
      </div>

      {/* ── Expanded content ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-cream-200 px-5 py-6 space-y-7">

              {/* ── Status timeline ── */}
              <OrderTimeline status={order.status} createdAt={order.createdAt} updatedAt={order.updatedAt} />

              {/* ── Items + pricing ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Items list */}
                <div>
                  <SectionHeading icon={Package} label="Items Ordered" />
                  <div className="space-y-3 mt-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-cream-100 flex-shrink-0 overflow-hidden">
                          {item.productImage
                            ? <Image src={item.productImage} alt={item.productName} width={44} height={44} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Leaf className="w-4 h-4 text-sage-300" /></div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm font-medium text-forest-700 truncate">{item.productName}</p>
                          <p className="font-body text-xs text-sage-400">Qty {item.quantity} × {formatPrice(item.unitPrice)}</p>
                        </div>
                        <span className="font-body text-sm font-semibold text-forest-700 flex-shrink-0">{formatPrice(item.totalPrice)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing breakdown */}
                  <div className="mt-4 pt-4 border-t border-cream-200 space-y-2">
                    <PriceRow label="Subtotal" value={formatPrice(order.subtotal)} />
                    <PriceRow label="Shipping" value={order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)} highlight={order.shippingFee === 0} />
                    {order.discount > 0 && <PriceRow label="Discount" value={`−${formatPrice(order.discount)}`} highlight />}
                    <div className="flex justify-between pt-2 border-t border-cream-200">
                      <span className="font-body text-sm font-semibold text-forest-700">Total</span>
                      <span className="font-display text-base font-bold text-forest-700">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery + payment */}
                <div className="space-y-5">
                  {/* Delivery address */}
                  <div>
                    <SectionHeading icon={MapPin} label="Delivery Address" />
                    <div className="mt-3 p-4 bg-cream-50 rounded-xl border border-cream-200 space-y-1">
                      <p className="font-body text-sm font-medium text-forest-700">{order.customerName}</p>
                      <p className="font-body text-xs text-sage-500">{order.addressLine1}{order.addressLine2 && `, ${order.addressLine2}`}</p>
                      <p className="font-body text-xs text-sage-500">{order.city}, {order.state} — {order.pincode}</p>
                      <p className="font-body text-xs text-sage-500">{order.country}</p>
                      <p className="font-body text-xs text-sage-400 pt-1">{order.customerPhone}</p>
                    </div>
                  </div>

                  {/* Payment info */}
                  <div>
                    <SectionHeading icon={CreditCard} label="Payment" />
                    <div className="mt-3 p-4 bg-cream-50 rounded-xl border border-cream-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-body text-xs text-sage-500">Status</span>
                        <PaymentChip status={order.paymentStatus} />
                      </div>
                      {order.paymentMethod && (
                        <div className="flex items-center justify-between">
                          <span className="font-body text-xs text-sage-500">Method</span>
                          <span className="font-body text-xs font-medium text-forest-700">{order.paymentMethod}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="font-body text-xs text-sage-500">Email</span>
                        <span className="font-body text-xs text-forest-700">{order.customerEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div>
                      <SectionHeading icon={ReceiptText} label="Order Notes" />
                      <p className="mt-2 font-body text-sm text-sage-600 bg-cream-50 rounded-xl border border-cream-200 px-4 py-3">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OrderTimeline
// ─────────────────────────────────────────────────────────────────────────────

function OrderTimeline({ status, createdAt, updatedAt }: { status: string; createdAt: Date; updatedAt: Date }) {
  const isCancelled = status === "CANCELLED";
  const isRefunded  = status === "REFUNDED";
  const isTerminal  = isCancelled || isRefunded;

  // current index in the normal flow (−1 if not in flow)
  const currentIdx = STATUS_ORDER.indexOf(status);

  return (
    <div>
      <SectionHeading icon={CircleDot} label="Order Status" />

      <div className="mt-4 relative">
        {/* Horizontal connector line (desktop) */}
        <div className="hidden sm:block absolute top-5 left-0 right-0 h-px bg-cream-300 z-0" style={{ left: "2.5rem", right: "2.5rem" }} />

        <div className="flex flex-col sm:flex-row sm:items-start gap-0 sm:gap-0 relative z-10">
          {TIMELINE_STEPS.map((step, i) => {
            const isDone    = !isTerminal && currentIdx >= i;
            const isCurrent = !isTerminal && currentIdx === i;
            const isFuture  = isTerminal || currentIdx < i;

            return (
              <div key={step.key} className="flex sm:flex-col items-start sm:items-center flex-1 relative gap-3 sm:gap-0 pb-4 sm:pb-0">
                {/* Vertical connector (mobile) */}
                {i < TIMELINE_STEPS.length - 1 && (
                  <div className={cn("sm:hidden absolute left-[19px] top-10 w-px h-[calc(100%-2.5rem)]", isDone ? "bg-forest-400" : "bg-cream-300")} />
                )}

                {/* Dot */}
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ring-4 transition-all duration-300 sm:mb-3 z-10",
                  isDone && !isCurrent  ? "bg-forest-500 ring-forest-100 shadow-md shadow-forest-200/60" :
                  isCurrent            ? "bg-forest-500 ring-forest-100 shadow-lg shadow-forest-300/50 scale-110" :
                                         "bg-cream-100 ring-cream-50"
                )}>
                  {isCurrent ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    >
                      <step.icon className="w-4 h-4 text-white" strokeWidth={2} />
                    </motion.div>
                  ) : (
                    <step.icon className={cn("w-4 h-4", isDone ? "text-white" : "text-cream-400")} strokeWidth={isDone ? 2 : 1.5} />
                  )}
                </div>

                {/* Label + desc */}
                <div className="sm:text-center sm:px-1">
                  <p className={cn("font-body text-xs font-semibold leading-tight", isDone ? "text-forest-700" : "text-sage-400")}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="font-body text-[10px] text-sage-500 mt-0.5 leading-snug hidden sm:block">{step.desc}</p>
                  )}
                  {isCurrent && (
                    <p className="font-body text-[10px] text-sage-400 mt-0.5">
                      {i === 0 ? format(new Date(createdAt), "d MMM, h:mm a") : format(new Date(updatedAt), "d MMM, h:mm a")}
                    </p>
                  )}
                  {isDone && !isCurrent && i === 0 && (
                    <p className="font-body text-[10px] text-sage-400 mt-0.5">{format(new Date(createdAt), "d MMM")}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cancelled / Refunded banner */}
        {isTerminal && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={cn("mt-5 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-body", isCancelled ? "bg-red-50 border-red-200 text-red-700" : "bg-sage-50 border-sage-200 text-sage-700")}
          >
            {isCancelled ? <Ban className="w-4 h-4 flex-shrink-0" /> : <RefreshCcw className="w-4 h-4 flex-shrink-0" />}
            <div>
              <span className="font-semibold">{isCancelled ? "Order Cancelled" : "Order Refunded"}</span>
              <span className="text-xs ml-2 opacity-70">{format(new Date(updatedAt), "d MMM yyyy, h:mm a")}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────────────────────────────────────

function PaymentChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    PAID:     "text-green-700 bg-green-50 border-green-200",
    PENDING:  "text-amber-700 bg-amber-50 border-amber-200",
    FAILED:   "text-red-700 bg-red-50 border-red-200",
    REFUNDED: "text-sage-700 bg-sage-50 border-sage-200",
  };
  return (
    <span className={cn("font-body text-xs font-medium px-2 py-0.5 rounded-full border", map[status] ?? map.PENDING)}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function SectionHeading({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-sage-400" strokeWidth={1.5} />
      <span className="font-body text-[10px] font-semibold tracking-widest uppercase text-sage-400">{label}</span>
    </div>
  );
}

function PriceRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="font-body text-xs text-sage-500">{label}</span>
      <span className={cn("font-body text-xs", highlight ? "text-forest-500 font-medium" : "text-forest-700")}>{value}</span>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, muted = false }: { icon: React.ElementType; label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-cream-100 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-cream-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-sage-400" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body text-[11px] text-sage-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className={cn("font-body text-sm", muted ? "text-sage-400 italic" : "text-forest-700")}>{value}</p>
      </div>
    </div>
  );
}

function FormInput({ label, error, required, className, children }: { label: string; error?: string; required?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label className={labelCls}>{label} {required && <span className="text-amber-500">*</span>}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1.5 font-body">{error}</p>}
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, action, onAction, actionLabel }: {
  icon: React.ElementType; title: string; description: string;
  action?: { label: string; href: string };
  onAction?: () => void; actionLabel?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-cream-300 shadow-sm p-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-sage-300" strokeWidth={1} />
      </div>
      <h3 className="font-display text-lg font-medium text-forest-700 mb-2">{title}</h3>
      <p className="font-body text-sm text-sage-500 mb-6">{description}</p>
      {action && (
        <Link href={action.href} className="inline-flex items-center gap-2 bg-forest-500 hover:bg-forest-400 text-white font-body text-xs font-medium tracking-widest uppercase px-5 py-3 rounded-full transition-colors">
          {action.label} <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      )}
      {onAction && actionLabel && (
        <button onClick={onAction} className="inline-flex items-center gap-2 bg-forest-500 hover:bg-forest-400 text-white font-body text-xs font-medium tracking-widest uppercase px-5 py-3 rounded-full transition-colors">
          <Plus className="w-3.5 h-3.5" /> {actionLabel}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared style tokens
// ─────────────────────────────────────────────────────────────────────────────
const inputCls = "w-full border border-cream-300 rounded-xl px-4 py-3 font-body text-sm text-forest-700 focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-400/10 bg-white placeholder-sage-300 transition-all";
const labelCls = "font-body text-xs font-medium tracking-wider uppercase text-sage-500 block mb-2";
const saveBtnCls = "flex items-center gap-2 bg-forest-500 hover:bg-forest-400 disabled:bg-sage-300 text-white font-body text-xs font-medium tracking-widest uppercase px-5 py-3 rounded-xl transition-colors";
