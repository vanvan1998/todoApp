import { useEffect, useState } from 'react';

export const useMediaQuery = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 520);

  useEffect(() => {
    const updateWindowDimensions = () => {
      const newWidth = window.innerWidth;
      setIsMobile(newWidth < 520);
    };

    window.addEventListener('resize', updateWindowDimensions);
    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  return { isMobile };
};
