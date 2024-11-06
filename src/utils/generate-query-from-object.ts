export const generateQueryFromObject = (obj: Record<string, any>) => {
  return Object.keys(obj)
    .filter((key) => !!obj[key])
    .map((key) => `${key}=${encodeURIComponent(obj[key])}`)
    .join('&');
};
