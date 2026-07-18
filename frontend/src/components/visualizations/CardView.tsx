import { useState } from "react";
import { FiLayers, FiMaximize2, FiX, FiExternalLink } from "react-icons/fi";
import SmartCell from "../common/SmartCell";
import { isUrl } from "../../utils/dataParser";

type CardViewProps = {
  data: any[];
  renderImages?: boolean;
  forceImages?: boolean;
  setForceImages?: (value: boolean) => void;
};

const checkIsImage = (key: string, value: any) => {
  if (typeof value !== 'string' || !isUrl(value)) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp'];
  const isImageExt = imageExtensions.some(ext => value.toLowerCase().includes(ext));
  const imageKeys = ['image', 'img', 'thumbnail', 'photo', 'avatar', 'cover', 'picture', 'poster'];
  const isImageKey = imageKeys.some(k => key.toLowerCase().includes(k));
  const isKnownService = value.includes('unsplash.com') || value.includes('picsum.photos') || value.includes('googleusercontent');
  return isImageExt || isImageKey || isKnownService;
};

const CardView = ({ data, renderImages = true, forceImages, setForceImages }: CardViewProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
        <FiLayers size={48} className="mb-4 opacity-50" />
        <p className="font-medium text-lg">No data found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {data.map((item, idx) => {
          const imgKey = Object.keys(item).find(key => checkIsImage(key, item[key]));
          const imgSrc = imgKey && renderImages ? item[imgKey] : null;

          return (
            <div key={idx} className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
              {imgSrc && (
                <div className="relative w-full h-52 overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
                  <img
                    src={imgSrc}
                    alt="Card visual"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e: any) => { e.target.closest('.relative').style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <button
                      onClick={() => setPreviewImage(imgSrc)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white rounded-full text-xs font-bold shadow-lg hover:scale-105 transition-transform"
                    >
                      <FiMaximize2 size={14} />
                      Quick View
                    </button>
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col">
                <div className="space-y-4">
                  {Object.entries(item).map(([key, val], entryIdx) => {
                    if (key === imgKey) return null;
                    return (
                      <div key={key} className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                          {key.replace(/_/g, ' ')}
                          <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800/50" />
                        </span>
                        <div className={`break-words leading-relaxed ${entryIdx === 0 && !imgSrc ? "text-lg font-bold text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300 text-sm"}`}>
                          <SmartCell value={val} renderImages={renderImages} forceImages={forceImages} setForceImages={setForceImages} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {previewImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setPreviewImage(null)} />

          <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 right-0 p-4 flex gap-3 z-50">
              <a href={previewImage} target="_blank" rel="noreferrer" className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-xl transition-all" title="Open Original">
                <FiExternalLink size={20} />
              </a>
              <button onClick={() => setPreviewImage(null)} className="p-3 bg-white/10 hover:bg-red-500 rounded-full text-white backdrop-blur-xl transition-all">
                <FiX size={20} />
              </button>
            </div>

            <img
              src={previewImage}
              alt="High Resolution Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl ring-1 ring-white/10"
            />

            <p className="mt-6 text-slate-400 text-xs font-mono bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
              {previewImage.split('/').pop()}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CardView;
