import React, { createContext, useContext, useState, useEffect } from 'react';

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
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
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
