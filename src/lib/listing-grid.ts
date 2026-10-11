export type CardLayout = {
  /** Grid span on the article. */
  article: string;
  /** Photo box sizing. */
  media: string;
  title: string;
  /** True when the card spans more than one column at any breakpoint. */
  wide: boolean;
};

const REGULAR: CardLayout = {
  article: "",
  media: "aspect-[4/3]",
  title: "text-lg sm:text-xl",
  wide: false,
};

/**
 * Layout for card `index` of `count` in a `sm:grid-cols-2 lg:grid-cols-3`
 * grid. Only the first card ever widens, by exactly enough to leave every row
 * full, so a group never ends on an empty column. A first card sharing its row
 * stretches its photo to match its neighbour's height instead of using a
 * fixed ratio.
 */
export function listingLayout(index: number, count: number): CardLayout {
  if (index !== 0) return REGULAR;

  const smWide = count % 2 === 1;
  const lgSpan = count % 3 === 0 ? 1 : count % 3 === 1 ? 3 : 2;
  if (!smWide && lgSpan === 1) return REGULAR;

  const article = [
    smWide && "sm:col-span-2",
    lgSpan === 3 ? "lg:col-span-3" : lgSpan === 2 ? "lg:col-span-2" : "lg:col-span-1",
  ].filter(Boolean).join(" ");

  const media = [
    "aspect-[4/3]",
    smWide && "sm:aspect-[2/1]",
    lgSpan === 3 ? "lg:aspect-[3/1]" : lgSpan === 2 ? "lg:aspect-auto lg:min-h-64 lg:flex-1" : "lg:aspect-[4/3]",
  ].filter(Boolean).join(" ");

  const title = [
    "text-lg",
    smWide ? "sm:text-3xl" : "sm:text-xl",
    lgSpan > 1 ? "lg:text-3xl" : "lg:text-xl",
  ].join(" ");

  return { article, media, title, wide: true };
}
