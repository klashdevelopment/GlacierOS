// useStartMenuAnimations.tsx
import { useContext, createContext } from 'react';

// Create context to share animation functions
export const StartMenuAnimationContext = createContext<{
  animateIn: () => void;
  animateOut: () => void;
}>({
  animateIn: () => {},
  animateOut: () => {},
});

// Custom hook to access animation functions
export function useStartMenuAnimations() {
  return useContext(StartMenuAnimationContext);
}