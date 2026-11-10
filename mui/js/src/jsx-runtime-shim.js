// MUI and Emotion ship compiled with the automatic JSX runtime, so they import
// react/jsx-runtime as well as react. The client publishes only React itself,
// so the runtime is rebuilt here on top of its createElement: with children
// already inside props, createElement builds the same element jsx() would.
import React from './react-shim.js';

export const Fragment = React.Fragment;

export function jsx(type, props, key) {
  return React.createElement(type, key === undefined ? props : { ...props, key });
}

export const jsxs = jsx;
export const jsxDEV = jsx;
