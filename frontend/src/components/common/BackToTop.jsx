import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

const BackToTop = ({ threshold = 300 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(scrolled > threshold);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button onClick={scrollToTop} className={`fixed z-55 p-4 text-white rounded-full shadow-xl transition-all duration-300 animate-in fade-in zoom-in bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700`} aria-label="Back to top" >
      <FiArrowUp size={20} />
    </button>
  );
};

export default BackToTop;