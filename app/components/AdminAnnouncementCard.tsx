"use client";

import { useEffect, useState } from "react";

const announcements = [
  {
    url: "https://worldcoin.org/mini-app?app_id=app_5613f2d20bf12c10b7c8a09d3cf97840&app_mode=mini-app",
  },
  {
    url: "https://worldcoin.org/mini-app?app_id=app_baea7d46bd43022ca80716a70537ff29&app_mode=mini-app",
  },
  {
    url: "https://worldcoin.org/mini-app?app_id=app_0e3f2e07cf3fb2e43fdddbb73d21d355&app_mode=mini-app",
  },
  {
    url: "https://worldcoin.org/mini-app?app_id=app_9da0f0443ff4a0bb886c78c96c3e9b7d&app_mode=mini-app",
  },
  {
    url: "https://worldcoin.org/mini-app?app_id=app_eaffd104d3bda895e1df76fa3dc3c917&app_mode=mini-app",
  },
];

export default function AdminAnnouncementCard() {
  const [currentIndex, setCurrentIndex] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentIndex((prev) =>
      prev === announcements.length - 1 ? 0 : prev + 1
    );
  }, 3000);

  return () => clearInterval(timer);
}, []);

  const handleOpenAnnouncement = () => {
  window.open(announcements[currentIndex].url, "_self");
};

  return (
    <section
      onClick={handleOpenAnnouncement}
      style={{
        background: "#1E2A4A",
        border: "1px solid #31456E",
        borderRadius: 20,
        padding: 10,
        marginTop: 15,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <h2
          style={{
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: 700,
            lineHeight: 1.35,
            margin: 0,
          }}
        >
          📢 ADMIN ADS /
          <br />
          ANNOUNCEMENT
        </h2>

        <span
          style={{
            color: "#B8C4E0",
            fontSize: 20,
            lineHeight: 1,
          }}
        >
          ›
        </span>
      </div>
     
      <div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: 6,
    marginTop: 15,
    marginBottom: 2,
  }}
>
  {announcements.map((_, index) => (
    <div
      key={index}
      style={{
        width: index === currentIndex ? 18 : 8,
        height: 8,
        borderRadius: 999,
        transition: "all .25s ease",
        background:
          index === currentIndex
            ? "#7C3AED"
            : "#4B5563",
      }}
    />
  ))}
</div>
    </section>
  );
}