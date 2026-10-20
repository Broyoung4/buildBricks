export const fontFamily = {
  sans: "Plus Jakarta Sans",
  medium: "Plus Jakarta Sans Medium",
  semibold: "Plus Jakarta Sans SemiBold",
  bold: "Plus Jakarta Sans Bold",
} as const;

export const typeScale = [
  {
    label: "H1",
    title: "Page / Screen Title",
    size: 32,
    weight: "Bold",
    lineHeight: 1.2,
  },
  {
    label: "H2",
    title: "Section Title",
    size: 24,
    weight: "SemiBold",
    lineHeight: 1.3,
  },
  {
    label: "H3",
    title: "Card / Module Title",
    size: 20,
    weight: "SemiBold",
    lineHeight: 1.3,
  },
  {
    label: "H4",
    title: "Subheading",
    size: 16,
    weight: "Medium",
    lineHeight: 1.4,
  },
  {
    label: "Body Large",
    title: "Important content",
    size: 16,
    weight: "Regular",
    lineHeight: 1.6,
  },
  {
    label: "Body Medium",
    title: "Body text",
    size: 14,
    weight: "Regular",
    lineHeight: 1.6,
  },
  {
    label: "Body Small",
    title: "Supporting text",
    size: 13,
    weight: "Regular",
    lineHeight: 1.6,
  },
  {
    label: "Caption",
    title: "Labels, meta text",
    size: 11,
    weight: "Regular",
    lineHeight: 1.4,
  },
] as const;

export default typeScale;
