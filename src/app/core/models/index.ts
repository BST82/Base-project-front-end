export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'user';
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: 'customer' | 'admin' | 'user';
  user_id: number;
  name: string;
}

export interface SiteContentMap {
  [key: string]: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  display_order: number;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  photo_url: string;
  tags: string;
  in_stock: boolean;
  is_top_recipe: boolean;
  is_chef_special: boolean;
  created_at: string;
  category?: Category;
}

export interface Table {
  id: number;
  table_number: string;
  capacity: number;
  location: string;
  is_active: boolean;
}

export interface AvailableSlot {
  slot_start: string;
  slot_end: string;
  table_id: number;
  table_number: string;
  capacity: number;
  location: string;
  is_available: boolean;
}

export interface ReservationHoldResponse {
  success: boolean;
  session_id: string;
  held_until_seconds: number;
  message: string;
}

export interface Reservation {
  id: number;
  table_id: number;
  user_id?: number;
  payment_id?: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: string;
  slot_start: string;
  slot_end: string;
  guests: number;
  special_requests?: string;
  status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  created_at: string;
  table?: Table;
}

export interface ReservationRescheduleRequest {
  reservation_date: string;
  slot_start: string;
  slot_end: string;
  table_id?: number;
}

export interface PaymentOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  gateway: string;
  key_id?: string;
  client_secret?: string;
  qr_code_string?: string;
  reservation_id: number;
}

export interface PaymentVerificationResponse {
  id: number;
  order_id: string;
  payment_id: string;
  gateway: string;
  method: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  created_at: string;
}

export interface Review {
  id: number;
  user_id?: number;
  customer_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export interface NavItem {
  id: number;
  label: string;
  route: string;
  display_order: number;
  is_active: boolean;
  is_external: boolean;
  has_dynamic_page?: boolean;
  page_slug?: string;
  created_at?: string;
}

export interface Branch {
  id: number;
  name: string;
  city: string;
  state?: string;
  zip_code?: string;
  address: string;
  phone?: string;
  email?: string;
  latitude: number;
  longitude: number;
  opening_hours?: string;
  operating_hours?: string;
  image_url?: string;
  is_active: boolean;
  created_at?: string;
}

export interface BannerSlide {
  id: number;
  badge_text?: string;
  script_text?: string;
  title: string;
  subtitle?: string;
  ribbon_text?: string;
  image_url: string;
  cta_text?: string;
  cta_link?: string;
  button_primary_text?: string;
  button_primary_link?: string;
  button_secondary_text?: string;
  button_secondary_link?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Story {
  id: number;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  author?: string;
  author_name?: string;
  category: string;
  read_time?: string;
  reading_time_minutes?: number;
  tags?: string;
  is_published: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PageHeroSlide {
  image_url: string;
  badge_text?: string;
  title: string;
  subtitle?: string;
  caption?: string;
  button_primary_text?: string;
  button_primary_link?: string;
  button_secondary_text?: string;
  button_secondary_link?: string;
}

export interface ContentBlockItem {
  id?: string;
  block_type: 'rich_text' | 'split_content' | 'feature_grid' | 'cta_banner';
  badge?: string;
  heading: string;
  subheading?: string;
  body?: string;
  image_url?: string;
  button_text?: string;
  button_link?: string;
  items?: Array<{ icon?: string; title: string; description: string }>;
}

export interface DynamicPage {
  id: number;
  nav_item_id?: number;
  slug: string;
  title: string;
  subtitle?: string;
  meta_description?: string;
  hero_slides: PageHeroSlide[];
  content_blocks: ContentBlockItem[];
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

