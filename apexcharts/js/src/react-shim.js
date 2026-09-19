// A plugin must render with the client's own React. A second copy would give
// its components a different dispatcher and their hooks would fail
//
// The bundle is built with `react` aliased to this file, so every import of
// React inside the plugin — including react-apexcharts' own — resolves to the
// instance the EWC client published on window.EWC.
const R = window.EWC && window.EWC.React;

if (!R) {
  throw new Error(
    'ewc-apexcharts: window.EWC.React is missing. This EWC client is too old to host plugins.'
  );
}

export default R;

export const {
  Children,
  Component,
  Fragment,
  Profiler,
  PureComponent,
  StrictMode,
  Suspense,
  cloneElement,
  createContext,
  createElement,
  createFactory,
  createRef,
  forwardRef,
  isValidElement,
  lazy,
  memo,
  startTransition,
  useCallback,
  useContext,
  useDebugValue,
  useDeferredValue,
  useEffect,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  version,
  // React-DOM and anything bundled alongside it reach for this to share
  // dispatcher state. Omitting it leaves them reading properties of undefined.
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
} = R;
