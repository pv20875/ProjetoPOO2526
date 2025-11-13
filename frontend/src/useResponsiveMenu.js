import { useEffect } from "react";

export default function useResponsiveMenu(setIsOpen) {
  useEffect(
    () => (window.onresize = () => setIsOpen(window.innerWidth > 900)),
    [setIsOpen]
  );
}
