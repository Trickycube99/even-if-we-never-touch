import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Check touch screen or reduced motion preference
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.interactive') ||
        target.getAttribute('role') === 'button'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    let animationFrameId;
    const render = () => {
      // Lerp ring towards real cursor position with smooth lag factor
      const lerp = 0.12;
      ringPos.current.x += (pos.current.x - ringPos.current.x) * lerp;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * lerp;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${isHovered ? 1.8 : 1})`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden" aria-hidden="true">
      {/* Real cursor dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#8C2F39] transition-opacity duration-300"
        style={{ willChange: 'transform' }}
      />
      {/* Lagging outer ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border ${
          isHovered ? 'border-[#8C2F39] bg-[#8C2F39]/10' : 'border-[#8B8F89]/40'
        } transition-all duration-300 ease-out`}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};

export default CustomCursor;
