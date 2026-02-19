export type BrandColors = Partial<{
  fg: string;
  bg: string;
  action: string;
  muted: string;
}>;

// JSON labels are not consistent / are marketing tags (e.g. "Nuevo", "Recomendado").
// Keep it flexible.
export type Label = string;

export type MenuImage = {
  src: string;
  alt?: string | null;
};

export interface Item {
  id: string;
  name: string;
  ingredients?: string[];
  ingredientsType?: string | null;
  description?: string | null;
  price: number;
  labels?: string[] | null;
  display?: boolean;
  image?: { src: string; alt?: string | null };
  imageThumbnail?: { src: string; alt?: string | null };
}


export interface Section {
  id: string;
  label: string;
  items: Item[];
}

export interface Category {
  id: string;
  label: string;
  items?: Item[];
  sections?: Section[];
  image?: string;
}

export interface RestaurantInfo {
  id: string;
  name: string;
  logo?: string;
  subtitle?: string;
  address?: string;
  description?: string | null;

  currency: string;
  locale: string;

  theme?: "light" | "dark";
  colors?: BrandColors;

  updatedAt: string;
}

export interface RestaurantMenu {
  version: number;
  restaurant: RestaurantInfo;

  socialMedia?: {
    name: string;
    url: string;
  }[];

  additionalLinks?: {
    label: string;
    url: string;
  }[];

  menus: {
    id: string;
    label: string;
    categories: Category[];
  }[];
}
