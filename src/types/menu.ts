export type Label =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'spicy'
  | 'contains-nuts'
  | 'contains-fish'
  | 'dairy-free'

export type Platform = 'instagram' | 'facebook' | 'tiktok' | 'website' | 'custom'

export interface Item {
  id: string
  slug: string
  name: string
  description: string | null
  price: number | null
  is_available: boolean
  image_url: string | null
  thumbnail_url: string | null
  sort_order: number
  item_labels: { label: Label }[]
}

export interface Category {
  id: string
  slug: string
  label: string
  availability_note: string | null
  sort_order: number
  is_active: boolean
  items: Item[]
}

export interface Menu {
  id: string
  slug: string
  label: string
  sort_order: number
  is_active: boolean
  categories: Category[]
}

export interface RestaurantLocation {
  id: string
  address: string | null
  city: string | null
  lat: number | null
  lng: number | null
  phone: string | null
  hours_note: string | null
}

export interface SocialLink {
  id: string
  platform: Platform
  url: string
  sort_order: number
}

export interface MenuData {
  id: string
  slug: string
  name: string
  subtitle: string | null
  description: string | null
  logo_url: string | null
  currency: string
  locale: string
  theme: 'light' | 'dark' | null
  colors: { fg: string; bg: string; action: string; muted: string } | null
  updated_at: string
  menus: Menu[]
  restaurant_locations: RestaurantLocation[]
  social_links: SocialLink[]
}
