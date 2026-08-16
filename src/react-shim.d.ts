declare module 'react' {
  export type FC<P = {}> = (props: P) => any;
  export const StrictMode: any;
  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useMemo<T>(factory: () => T, deps?: unknown[]): T;
  export function useRef<T>(initialValue: T): { current: T };
  export const Fragment: any;
  export default any;
}

declare module 'react/jsx-runtime' {
  export const Fragment: any;
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
}

declare module 'react-dom/client' {
  export function createRoot(container: Element | DocumentFragment): {
    render: (node: any) => void;
  };
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'motion/react' {
  export const motion: any;
  export const AnimatePresence: any;
  export type PanInfo = any;
}

declare module 'canvas-confetti' {
  const confetti: (options?: any) => void;
  export default confetti;
}
