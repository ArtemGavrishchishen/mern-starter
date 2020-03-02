import React, { createContext, useContext, useState, useEffect } from 'react';
import throttle from 'lodash.throttle';

export const WindowDimensionsCtx = createContext(null);

const windowDims = () =>
  typeof window !== 'undefined'
    ? {
        height: window.innerHeight,
        width: window.innerWidth
      }
    : {};

const WindowDimensionsProvider = ({ children }) => {
  const [dimensions, setDims] = useState(windowDims());

  const handleResize = () => {
    setDims(windowDims());
  };

  useEffect(() => {
    const throttled = throttle(handleResize, 1000);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', throttled);
      return () => {
        window.removeEventListener('resize', throttled);
      };
    }
  }, []);

  return (
    <WindowDimensionsCtx.Provider value={dimensions}>
      {children}
    </WindowDimensionsCtx.Provider>
  );
};

export default WindowDimensionsProvider;

export const useWindowDimensions = () => {
  return useContext(WindowDimensionsCtx);
};
