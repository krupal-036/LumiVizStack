import { FiImage } from "react-icons/fi";
import SmartCell from "../common/SmartCell";
import { isUrl } from "../../utils/dataParser";

// Enhanced Image Checker
// 1. Checks standard extensions
// 2. Checks if the KEY name suggests it's an image (e.g., "thumbnail", "avatar")
// 3. Checks common image hosting domains
const checkIsImage = (key, value) => {
  if (typeof value !== 'string' || !isUrl(value)) return false;

  // A. Check extension
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp'];
  if (imageExtensions.some(ext => value.toLowerCase().includes(ext))) return true;

  // B. Check key names (heuristic)
  const imageKeys = ['image', 'img', 'thumbnail', 'photo', 'avatar', 'cover', 'picture', 'poster'];
  if (imageKeys.some(k => key.toLowerCase().includes(k))) return true;

  // C. Check domains known for images
  if (value.includes('unsplash.com') || value.includes('picsum.photos') || value.includes('googleusercontent')) {
    return true;
  }

  return false;
};

const CardView = ({ data, renderImages = true }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-20 text-gray-400">No data to display</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((item, idx) => {
        // 1. Find the best candidate for the main image
        const imgKey = Object.keys(item).find(key => checkIsImage(key, item[key]));
        const imgSrc = imgKey && renderImages ? item[imgKey] : null;

        return (
          <div
            key={idx}
            className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Image Container */}
            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt="Card Visual"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // If image fails to load, hide it to show the placeholder icon
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-gray-300 dark:text-gray-600 flex flex-col items-center gap-2">
                  <FiImage size={40} />
                  <span className="text-xs">No Image</span>
                </div>
              )}
            </div>

            {/* Content Container */}
            <div className="p-4 flex-1 flex flex-col">
              {Object.entries(item).map(([key, val]) => {
                // If this is the image key, skip rendering it in the text list (we already showed it)
                if (key === imgKey) return null;

                return (
                  <div key={key} className="mb-3 last:mb-0 text-sm border-b border-dashed dark:border-gray-800 pb-2 last:border-0 last:pb-0">
                    <span className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 mb-0.5 tracking-wide">
                      {key}
                    </span>
                    <div className="text-gray-800 dark:text-gray-200 wrap-break-word">
                      {/* Use SmartCell for nested objects/arrays support */}
                      <SmartCell value={val} renderImages={renderImages} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardView;