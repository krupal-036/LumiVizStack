import type { Dispatch, SetStateAction } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Download, Search, Image as ImageIcon, ExternalLink } from 'lucide-react';

export const renderValue = (val: any, path: any, forceImages: Record<any, any>, setForceImages: Dispatch<SetStateAction<Record<any, any>>>) => {
  if (val === null || val === undefined) return <span className="text-gray-400">null</span>;

  if (typeof val === 'number') return <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{val}</span>;
  if (typeof val === 'boolean') return <span className="font-mono text-blue-600 dark:text-blue-400">{val.toString()}</span>;

  if (typeof val !== 'string') return String(val);

  if (val.startsWith('http')) {
    const isImage = val.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);
    const isVideo = val.match(/\.(mp4|webm|ogg)$/i);
    const isAudio = val.match(/\.(mp3|wav|ogg)$/i);
    const isForced = forceImages[path];

    if (isImage || (isForced && !isVideo && !isAudio)) {
      return (
        <div className="mt-2 group relative inline-block">
          <img
            src={val}
            alt="Preview"
            crossOrigin="anonymous"
            className="max-w-[150px] rounded border border-gray-200 dark:border-gray-700 shadow-sm transition-transform hover:scale-105"
          />
          <a href={val} target="_blank" rel="noreferrer" className="absolute top-1 right-1 p-1 bg-white dark:bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink size={10} className="text-gray-600 dark:text-gray-300" />
          </a>
        </div>
      );
    }

    if (isVideo) return <video controls className="max-w-[250px] rounded mt-2 shadow-sm"><source src={val} /></video>;
    if (isAudio) return <audio controls className="mt-2 w-full max-w-[250px]"><source src={val} /></audio>;

    return (
      <div className="flex items-center gap-2">
        <a href={val} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-xs truncate max-w-[120px]">Link</a>
        <button
          onClick={() => setForceImages(prev => ({ ...prev, [path]: true }))}
          className="text-[10px] bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <ImageIcon size={10} /> Preview
        </button>
      </div>
    );
  }

  return val.length > 100 ? val.substring(0, 100) + '...' : val;
};

export const Features = ({ searchTerm, setSearchTerm, targetRef }: any) => {
  const downloadPDF = async () => {
    const element = targetRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const contentHeightInPdf = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = contentHeightInPdf;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, contentHeightInPdf, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - contentHeightInPdf;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, contentHeightInPdf, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save(`report-${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert("Export failed. Check console for details.");
    }
  };

  return (
    <div className="flex flex-row md:flex-row gap-4 items-center justify-between transition-colors">
      <div className="relative w-full sm:flex-1 md:w-160">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          size={18}
        />
        <input
          type="text"
          placeholder="Search records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm dark:text-white"
        />
      </div>
      <div className="flex gap-2 w-auto md:w-auto">
        <button
          onClick={downloadPDF}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-gray-900 dark:bg-indigo-600 text-white rounded-lg font-bold hover:opacity-90 transition-all shadow-lg text-sm"
        >
          <Download size={18} /> PDF
        </button>
      </div>
    </div>
  );
};
