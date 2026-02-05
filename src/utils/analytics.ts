// src/utils/analytics.ts
type GtagFn = (...args: any[]) => void;

const getGtag = (): GtagFn | null => {
  const w = window as unknown as { gtag?: GtagFn };
  return typeof w.gtag === "function" ? w.gtag : null;
};

export const trackMenuRendered = (params: {
  menuId?: string;
  restaurantId?: string;
  source?: string;
}) => {
  const gtag = getGtag();
  if (!gtag) return; // GA not loaded (dev, blocked, etc.)

  gtag("event", "menu_rendered", {
    menu_id: params.menuId ?? "",
    restaurant_id: params.restaurantId ?? "",
    source: params.source ?? "",
  });
};
