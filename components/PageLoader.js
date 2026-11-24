"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageLoader() {
  const pathname = usePathname();
  const [loadedPath, setLoadedPath] = useState(null);
  const loading = loadedPath !== pathname;

  useEffect(() => {
    const root = document.documentElement;
    const previousOverflow = document.body.style.overflow;
    root.classList.add("page-loading");
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      root.classList.remove("page-loading");
      document.body.style.overflow = previousOverflow;
      setLoadedPath(pathname);
    }, 4000);

    return () => {
      window.clearTimeout(timer);
      root.classList.remove("page-loading");
      document.body.style.overflow = previousOverflow;
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <div className="page-loader-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
