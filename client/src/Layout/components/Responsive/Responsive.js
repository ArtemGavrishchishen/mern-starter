import { useState, useEffect } from 'react';

import { useWindowDimensions } from '../WindowDimensionsProvider';

const Responsive = ({ breakPoint = 576, renderMobile, renderDesktop }) => {
  const { width } = useWindowDimensions();

  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBrowser(true);
    }
  }, []);
  if (browser) {
    return width > breakPoint ? renderDesktop() : renderMobile();
  }
  return renderMobile();
};

export default Responsive;
