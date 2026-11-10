// The client publishes React but not ReactDOM, and bundling a second ReactDOM
// would bring a second renderer. MUI needs three things from it:
//
// - createPortal (Select, Menu, Popover, Dialog, Tooltip). A portal is a plain
//   object the client's own renderer mounts, so it is built here directly.
// - flushSync (SwipeableDrawer only). Running the update unflushed only costs
//   a frame of latency.
// - findDOMNode, reached by react-transition-group only when a transition is
//   given no nodeRef. MUI's own transitions always pass one, so reaching this
//   means a component outside that rule, which should get a nodeRef instead.
const REACT_PORTAL_TYPE = Symbol.for('react.portal');

export function createPortal(children, containerInfo, key = null) {
  return {
    $$typeof: REACT_PORTAL_TYPE,
    key: key == null ? null : String(key),
    children,
    containerInfo,
    implementation: null,
  };
}

export const flushSync = (fn) => fn();

export function findDOMNode() {
  throw new Error('ewc-mui: findDOMNode is not available - pass the transition a nodeRef');
}

export default { createPortal, flushSync, findDOMNode };
