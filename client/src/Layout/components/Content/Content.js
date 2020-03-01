import React from 'react';
import Responsive from '../Responsive';
import Mobile from '../../../Mobile';
import Desktop from '../../../Desktop';

import breakpoint from '../../../configs/breakpoint';

const Content = () => {
  return (
    <Responsive
      breakPoint={breakpoint.Mobile}
      renderDesktop={() => <Desktop />}
      renderMobile={() => <Mobile />}
    />
  );
};

export default Content;
