export const couponStyles = {
  list: 'mt-lg gap-md',
  card: 'overflow-hidden rounded-md bg-surface',
  headerFlat: 'bg-couponFlat px-md py-sm',
  headerPercent: 'bg-couponPercent px-md py-sm',
  headerShip: 'bg-couponShip px-md py-sm',
  headerFirst: 'bg-couponFirst px-md py-sm',
  body: 'gap-sm border-t border-dashed border-ink/20 px-md py-md',
  row: 'flex-row items-center justify-between gap-sm',
} as const;

export const couponHeaderClass = {
  flat: couponStyles.headerFlat,
  percent: couponStyles.headerPercent,
  ship: couponStyles.headerShip,
  first: couponStyles.headerFirst,
} as const;
