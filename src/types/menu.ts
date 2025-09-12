export type Label = "spicy" | "vegetarian";

export interface Item {
  id: string;
  name: string;
  ingredients: string[];
  description?: string;
  image?: { src: string; alt?: string };
  price: number;
  labels?: Label[];
};
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
export interface RestaurantMenu {
  version: number;
  restaurant: Record<string, string>;
  menus: {
    id: string;
    label: string;
    categories: Category[];
  }[];
}

export type BrandColors = Partial<{
  fg: string; bg: string; action: string; muted: string;
}>;