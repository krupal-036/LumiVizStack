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

    // 1. Basic validation: ensure it's a non-null object/array
    if (!parsed || typeof parsed !== 'object') return [];

    // 2. If it's already an array, return it (if not empty)
    if (Array.isArray(parsed)) {
      return parsed.length > 0 ? parsed : [];
    }

    // 3. Logic 1: Look for a key that contains a non-empty array (e.g., "users")
    const arrayKey = Object.keys(parsed).find((key) => 
      Array.isArray(parsed[key]) && parsed[key].length > 0
    );

    if (arrayKey) {
      return parsed[arrayKey];
    }

    // 4. Logic 2: If no internal array exists, return the object itself in an array
    // Check if the object has at least one key (not empty)
    if (Object.keys(parsed).length > 0) {
      return [parsed];
    }

    return [];
  } catch (e) {
    throw new Error("Invalid JSON format");
  }
};
