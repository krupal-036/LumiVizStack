import React from "react";
import { isImageUrl, isUrl } from "../../utils/dataParser";

const CardView = ({ data, renderImages }) => {
  if (data.length === 0)
    return <p className="text-center py-10 text-gray-400">No data to display</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {data.map((item, idx) => {
        const imgKey = Object.keys(item).find((k) => isImageUrl(item[k]));
        const imgSrc = imgKey && renderImages ? item[imgKey] : null;

        return (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all"
          >
            {imgSrc && (
              <img
                src={imgSrc}
                alt="Card Visual"
                className="w-full h-40 object-cover bg-gray-100"
              />
            )}
            <div className="p-4">
              {Object.entries(item).map(([key, val]) => {
                // Fix for [object Object]
                const displayVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
                const isUrlVal = typeof val === 'string' && isUrl(val);

                return (
                  <div key={key} className="mb-1 text-xs">
                    <span className="font-semibold text-gray-500 dark:text-gray-400 uppercase mr-1">
                      {key}:
                    </span>
                    <span className="text-gray-800 dark:text-gray-100 break-words">
                      {isUrlVal ? (
                        <a
                          href={val}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 underline hover:text-blue-700"
                        >
                          {displayVal}
                        </a>
                      ) : (
                        displayVal
                      )}
                    </span>
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