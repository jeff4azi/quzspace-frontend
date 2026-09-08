import { useState, useEffect } from "react";

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState("up");
  const [isAtTop, setIsAtTop] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // At the top of the viewport (less than 10px scrolled)
      if (currentScrollY < 10) {
        setIsAtTop(true);
        setScrollDirection("up");
        lastScrollY = currentScrollY;
        return;
      }

      setIsAtTop(false);

      const diff = currentScrollY - lastScrollY;

      // Small threshold (5px) to ignore minor touch jitter
      if (Math.abs(diff) > 5) {
        if (diff > 0) {
          setScrollDirection("down");
        } else {
          setScrollDirection("up");
        }
        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener("scroll", updateScrollDirection, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, []);

  return { scrollDirection, isAtTop, scrollY };
}
