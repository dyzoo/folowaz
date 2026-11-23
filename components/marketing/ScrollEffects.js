"use client";

import { useEffect } from "react";

export default function ScrollEffects() {
  useEffect(() => {
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    document.body.appendChild(progress);

    const header = document.querySelector(".site-header");
    const glows = Array.from(document.querySelectorAll(".hero-glow"));
    const targets = Array.from(
      document.querySelectorAll(
        ".section, .step-card, .why-card, .price-card, .review-card, .feature-card, .result-card, .faq-intro, .accordion-item, .guarantee-card, .logos-section"
      )
    );

    targets.forEach((element) => element.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((element) => observer.observe(element));

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = height > 0 ? Math.min(1, window.scrollY / height) : 0;
        progress.style.transform = `scaleX(${ratio})`;
        header?.classList.toggle("scrolled", window.scrollY > 10);
        glows.forEach((glow, index) => {
          const speed = index % 2 === 0 ? 0.14 : -0.09;
          glow.style.translate = `0 ${window.scrollY * speed}px`;
        });
        frame = 0;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      progress.remove();
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
