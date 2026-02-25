// ========================================
// PRODUCT TYPES
// ========================================
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string | null;
  price: number;
  comparePrice?: number | null;
  stock: number;
  sku?: string | null;
  weight?: number | null;
  images: string[];
  thumbnail?: string | null;
  category: Category;
  categoryId: string;
  tags: string[];
  ingredients?: string | null;
  howToUse?: string | null;
  benefits: string[];
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  metaTitle?: string | null;
  metaDesc?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
}

// ========================================
// CART TYPES
// ========================================
export interface CartItem {
  id: string;           // product id
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
  stock: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// ========================================
// ORDER TYPES
// ========================================
export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface CheckoutData {
  shippingAddress: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  couponCode?: string;
  discount?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: string | null;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  notes?: string | null;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// ========================================
// ENUMS
// ========================================
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

// ========================================
// API RESPONSE TYPES
// ========================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ========================================
// FORM TYPES
// ========================================
export interface ProductFormData {
  name: string;
  description: string;
  shortDesc?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku?: string;
  weight?: number;
  categoryId: string;
  tags: string[];
  ingredients?: string;
  howToUse?: string;
  benefits: string[];
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  metaTitle?: string;
  metaDesc?: string;
}

export interface AdminLoginData {
  email: string;
  password: string;
}

// ========================================
// RAZORPAY TYPES
// ========================================
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
