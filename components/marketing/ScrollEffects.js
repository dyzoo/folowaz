"use client";

import { useEffect } from "react";

export default function ScrollEffects() {
  useEffect(() => {
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    document.body.appendChild(progress);

    const header = document.querySelector(".site-header");
    const glows = Array.from(document.querySelectorAll(".hero-glow"));
    const floaters = Array.from(document.querySelectorAll(".floating-card, .clone-success .guarantee-orb"));
    const heroCopy = document.querySelector(".hero-copy, .clone-intro");
    const targets = Array.from(
      document.querySelectorAll(
        ".section, .why-card, .review-card, .feature-card, .result-card, .faq-intro, .accordion-item, .logos-section, .clone-trust, .clone-progress, .clone-disclaimer"
      )
    );

    targets.forEach((element, index) => {
      element.classList.add("reveal");
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 60}ms`;
    });

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
    let lastY = window.scrollY;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = height > 0 ? Math.min(1, y / height) : 0;
        progress.style.transform = `scaleX(${ratio})`;

        if (header) {
          header.classList.toggle("scrolled", y > 10);
          header.classList.toggle("header-hidden", y > 260 && y > lastY + 4);
        }
        lastY = y;

        glows.forEach((glow, index) => {
          const speed = index % 2 === 0 ? 0.14 : -0.09;
          glow.style.translate = `0 ${y * speed}px`;
        });
        floaters.forEach((element, index) => {
          element.style.translate = `0 ${Math.sin(y / 420 + index) * 12}px`;
        });
        if (heroCopy) {
          heroCopy.style.opacity = String(Math.max(0.55, 1 - y / 1100));
          heroCopy.style.translate = `0 ${Math.min(y * 0.12, 90)}px`;
        }

        frame = 0;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      targets.forEach((element) => {
        element.classList.remove("reveal", "reveal-visible");
        element.style.transitionDelay = "";
      });
      if (heroCopy) {
        heroCopy.style.opacity = "";
        heroCopy.style.translate = "";
      }
      floaters.forEach((element) => { element.style.translate = ""; });
      progress.remove();
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
