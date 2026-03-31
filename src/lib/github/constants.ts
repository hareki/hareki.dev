export const CachingPolicy = {
  MAX_AGE: 60 * 15, // 15 mins
  SWR: 60 * 1, // Serve stale data less than 1 min old while revalidating in the background
};
