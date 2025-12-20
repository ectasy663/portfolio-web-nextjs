'use client';

import { useEffect } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';

export default function Accessibility() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@axe-core/react').then(axe => {
        axe.default(React, ReactDOM, 1000);
      });
    }
  }, []);

  return null;
}
