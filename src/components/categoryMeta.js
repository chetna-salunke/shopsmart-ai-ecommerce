// Presentation-only info for each category (label, icon, pastel colour). Data still comes from productApi.
export const CATEGORY_META = {
  Electronics: { label: "Electronics", icon: "laptop", bg: "#dde8f6", fg: "#2d5f9f" },
  Fashion: { label: "Fashion", icon: "shirt", bg: "#fbe1e1", fg: "#c2474f" },
  Beauty: { label: "Beauty", icon: "drop", bg: "#fbdde6", fg: "#c2457a" },
  Home: { label: "Home & Living", icon: "home", bg: "#fde6d3", fg: "#c0692b" },
  Accessories: { label: "Accessories", icon: "watch", bg: "#e6def2", fg: "#6a4aa6" },
};
export const metaOf = (c) => CATEGORY_META[c] || { label: c, icon: "grid", bg: "#e8ece9", fg: "#0f3d2e" };
