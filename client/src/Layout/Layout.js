import React from 'react';
import Content from './components/Content';
import WindowDimensionsProvider from './components/WindowDimensionsProvider';

const Layout = () => (
  <WindowDimensionsProvider>
    <Content />
  </WindowDimensionsProvider>
);

export default Layout;
