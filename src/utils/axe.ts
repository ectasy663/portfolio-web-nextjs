import React from 'react';
import ReactDOM from 'react-dom';

const axe = async (App: React.ComponentType, appProps: any) => {
  if (process.env.NODE_ENV === 'development') {
    const { default: axeCore } = await import('@axe-core/react');
    axeCore(React, ReactDOM, 1000);
  }
};

export default axe;
