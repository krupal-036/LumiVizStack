export const isImageUrl = (url) => {
  if (typeof url !== 'string') return false;
  return (
    url.match(/\.(jpeg|jpg|gif|png|svg|webp)$/) != null ||
    url.includes('unsplash') ||
    url.includes('picsum') ||
    url.includes('googleusercontent')
  );
};

export const isUrl = (string) => {
  if (typeof string !== 'string') return false;
  return string.startsWith('http://') || string.startsWith('https://');
};

export const parseData = (dataString) => {
  try {
    const parsed = JSON.parse(dataString);

    if (!parsed || typeof parsed !== 'object') return [];

    if (Array.isArray(parsed)) {
      return parsed.length > 0 ? parsed : [];
    }

    const arrayKey = Object.keys(parsed).find((key) => 
      Array.isArray(parsed[key]) && parsed[key].length > 0
    );

    if (arrayKey) {
      return parsed[arrayKey];
    }

    if (Object.keys(parsed).length > 0) {
      return [parsed];
    }

    return [];
  } catch (e) {
    throw new Error("Invalid JSON format");
  }
};
