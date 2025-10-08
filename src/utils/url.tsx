export const convertToQueryParams = (filterObj: Record<string, any>) => {
  return Object.entries(filterObj)
    .filter(
      ([_, value]) => value !== '' && value !== null && value !== undefined
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');
};
