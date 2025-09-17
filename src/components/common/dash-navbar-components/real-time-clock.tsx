"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function RealTimeClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      month: "short",
      day: "2-digit",
      weekday: "short",
    });
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border">
      <Clock className="size-4 text-muted-foreground" />

      {isClient ? (
        <>
          <span className="text-xs text-muted-foreground font-mono font-semibold">
            {formatDate(currentTime)}
          </span>
          <span className="mx-1 h-4 w-px bg-muted-foreground/30 rounded" />
          <span className="text-xs font-semibold text-muted-foreground font-mono">
            {formatTime(currentTime)}
          </span>
        </>
      ) : (
        <span className="text-xs text-muted-foreground font-mono font-semibold">
          --:--:--
        </span>
      )}
    </div>
  );
}
