"use client";

export default function AdminAnnouncementCard() {
  return (
    <section
      style={{
        background: "#1E2A4A",
        borderRadius: 20,
        padding: 24,
        marginTop: 20,
      }}
    >
      <h2
        style={{
          fontWeight: 700,
          fontSize: 20,
          marginBottom: 12,
        }}
      >
        📢 ADMIN ADS / ANNOUNCEMENT
      </h2>

      <p
        style={{
          color: "#B8C4E0",
        }}
      >
        No announcements available.
      </p>
    </section>
  );
}