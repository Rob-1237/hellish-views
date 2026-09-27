"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// The header floats over the page until the reader is ~80vh down, then its
// navy background eases in. On Home the big wordmark is already on screen, so
// the small logo waits for the same moment.
export default function HeaderShell({ children }) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <header className="site-header" data-scrolled={scrolled} data-home={path === "/"}>
      {children}
    </header>
  );
}
