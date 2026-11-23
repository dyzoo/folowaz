"use client";

import { useEffect, useState } from "react";
import { Star, ArrowRight, X } from "lucide-react";

export default function Announcement() {
  const [visible, setVisible] = useState(true);
  const [time, setTime] = useState({ days: "00", hours: "00", mins: "00", secs: "00" });

  useEffect(() => {
    const key = "folowaz_deadline";
    let deadline = Number(localStorage.getItem(key));
    if (!deadline || deadline < Date.now()) {
      deadline = Date.now() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(key, String(deadline));
    }
    const pad = (value) => String(value).padStart(2, "0");
    const tick = () => {
      let left = Math.max(0, deadline - Date.now());
      const days = Math.floor(left / 86400000);
      left %= 86400000;
      const hours = Math.floor(left / 3600000);
      left %= 3600000;
      const mins = Math.floor(left / 60000);
      const secs = Math.floor((left % 60000) / 1000);
      setTime({ days: pad(days), hours: pad(hours), mins: pad(mins), secs: pad(secs) });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="announcement">
      <div className="announcement-inner">
        <Star size={15} fill="currentColor" className="announcement-star" />
        <strong>Black Friday offer:</strong>
        <span>All plans are 60% off for a limited time!</span>
        <div className="countdown" aria-label="Time remaining">
          <span>{time.days}</span><small>days</small>
          <span>{time.hours}</span><small>hrs</small>
          <span>{time.mins}</span><small>min</small>
          <span>{time.secs}</span><small>sec</small>
        </div>
        <a href="/bei" className="announcement-link">Get the offer <ArrowRight size={13} /></a>
        <button className="announcement-close" onClick={() => setVisible(false)} aria-label="Dismiss announcement"><X size={16} /></button>
      </div>
    </div>
  );
}
