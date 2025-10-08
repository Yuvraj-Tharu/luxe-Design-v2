// export const toScreamingSnakeCase = (str: string) => {
//   return str.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();
// };

export const toScreamingSnakeCase = (str: string) => {
  // Convert the string to lowercase first
  const lowerCaseStr = str.toLowerCase();
  // Convert to uppercase
  return lowerCaseStr.toUpperCase();
};

export const toPascalCase = (str: string): string => {
  return str
    ?.replace(/[_\s-]+/g, ' ') // Replace underscores, hyphens, and spaces with a single space
    ?.trim()
    ?.split(' ') // Split by spaces
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
    ?.join(''); // Join without spaces
};

export const toSpacedPascalCaseFromCamelCase = (str: string): string => {
  if (!str) return '';

  return str
    .replace(/\[.*?\]/g, '') // Remove array indices like [0]
    .split('.') // Split on dot notation
    .map((segment) =>
      segment
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
        .replace(/(^\w|[A-Z])/g, (match) => ` ${match.toUpperCase()}`) // Capitalize and space
        .replace(/\burl\b/gi, '') // Remove standalone 'url' (case-insensitive)
        .replace(/\s+/g, ' ') // Collapse multiple spaces
        .trim()
    )
    .join(' ');
};

export const toSpacedPascalCaseFromHyphenated = (str: string): string => {
  return str
    ?.split('-')
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(' ');
};

export const toCamelCaseFromPascalCase = (str: string): string => {
  return str
    ?.replace(/[\s_-]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : '')) // Remove spaces or dashes and capitalize next letter
    ?.replace(/^[A-Z]/, (match) => match.toLowerCase()); // Lowercase the first letter
};
export const toPascalCaseFromHyphenedString = (str: string): string => {
  return str
    ?.split('-') // Split by hyphen
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    ?.join(''); // Join without spaces
};

export const toHyphenatedStringFromPascalCase = (str: string): string => {
  return str
    ?.replace(/([A-Z])/g, '-$1') // Add hyphen before each uppercase letter
    ?.toLowerCase() // Convert everything to lowercase
    ?.replace(/^-/, ''); // Remove leading hyphen if it exists
};

export const toTitleCaseFromHyphenated = (str: string): string => {
  return str
    ?.split('-') // Split by hyphen
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    ?.join(' '); // Join with spaces
};

export const toFormattedTitle = (str: string): string => {
  const cleanedStr = str.replace(/\[.*?\]|\.\w+/g, '');
  return toSpacedPascalCaseFromCamelCase(cleanedStr);
};
