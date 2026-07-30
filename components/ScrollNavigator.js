import { useState, useEffect, useRef } from 'react';

export default function ScrollNavigator({ children, scrollAmount = 300 }) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
    }
    return () => el?.removeEventListener('scroll', updateScrollButtons);
  }, []);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative group">
      {canScrollLeft && (
        <button 
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-green-700 w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg items-center justify-center transition-all hover:scale-110 ml-2 md:ml-4"
          onClick={scrollLeft}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex overflow-x-auto pb-4 gap-4 md:gap-8 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none' }}
      >
        {children}
      </div>

      {canScrollRight && (
        <button 
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-green-700 w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg items-center justify-center transition-all hover:scale-110 mr-2 md:mr-4"
          onClick={scrollRight}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      )}
    </div>
  );
}
