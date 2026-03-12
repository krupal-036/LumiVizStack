// src/utils/dataParser.js

// Check if string is a typical image URL
export const isImageUrl = (url) => {
  if (typeof url !== 'string') return false;
  return (
    url.match(/\.(jpeg|jpg|gif|png|svg|webp)$/) != null ||
    url.includes('unsplash') ||
    url.includes('picsum') ||
    url.includes('googleusercontent')
  );
};

// Check if string looks like a generic URL
export const isUrl = (string) => {
  if (typeof string !== 'string') return false;
  return string.startsWith('http://') || string.startsWith('https://');
};

// Safe JSON parsing with array normalization
export const parseData = (dataString) => {
  try {
    const parsed = JSON.parse(dataString);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === 'object' && parsed !== null) {
      const arrayKey = Object.keys(parsed).find((key) =>
        Array.isArray(parsed[key])
      );
      return arrayKey ? parsed[arrayKey] : [parsed];
    }
    return [];
  } catch (e) {
    throw new Error("Invalid JSON format");
  }
};