"use client";

import React from "react";
import { useLeaderboard } from "@/app/hooks/useLeaderboard";

export default function LeaderboardCard() {
  const { leaderboard } = useLeaderboard();

  const containerStyle: React.CSSProperties = {
    background: "#1E2A4A",
    borderRadius: "20px",
    padding: "32px",
    color: "#FFFFFF",
    fontFamily: "sans-serif",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "24px",
    lineHeight: "32px",
  };

  const subtitleStyle: React.CSSProperties = {
    margin: "8px 0 24px",
    color: "#94A3B8",
    fontSize: "16px",
    lineHeight: "24px",
  };

  const summaryContainer: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap",
  };

  const summaryCard: React.CSSProperties = {
    flex: "1",
    minWidth: "120px",
    background: "#27385F",
    borderRadius: "12px",
    padding: "12px",
  };

  const summaryLabel: React.CSSProperties = {
    color: "#94A3B8",
    fontSize: "12px",
    marginBottom: "4px",
  };

  const summaryValue: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "bold",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    marginBottom: "10px",
    borderRadius: "12px",
    background: "#27385F",
  };

  const currentUserStyle: React.CSSProperties = {
    ...rowStyle,
    background: "#365D9D",
    border: "2px solid #60A5FA",
  };

  const badgeStyle: React.CSSProperties = {
    marginLeft: "8px",
    background: "#60A5FA",
    color: "#0F172A",
    padding: "2px 8px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
  };

  const secondaryTextStyle: React.CSSProperties = {
    color: "#94A3B8",
    fontSize: "14px",
  };

  const footerStyle: React.CSSProperties = {
    marginTop: "24px",
    color: "#94A3B8",
    fontSize: "13px",
    textAlign: "center",
  };

  const totalPlayers = leaderboard.length;

  const highestScore =
    leaderboard.length > 0
      ? Math.max(...leaderboard.map((e) => e.score))
      : 0;

  const currentUser = leaderboard.find(
    (entry) => entry.isCurrentUser
  );

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>🏆 Leaderboard</h2>

      <p style={subtitleStyle}>Community Ranking</p>

      <div style={summaryContainer}>
        <div style={summaryCard}>
          <div style={summaryLabel}>Total Players</div>
          <div style={summaryValue}>{totalPlayers}</div>
        </div>

        <div style={summaryCard}>
          <div style={summaryLabel}>Highest Score</div>
          <div style={summaryValue}>{highestScore}</div>
        </div>

        <div style={summaryCard}>
          <div style={summaryLabel}>Your Rank</div>
          <div style={summaryValue}>
            {currentUser ? `#${currentUser.rank}` : "-"}
          </div>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <p style={secondaryTextStyle}>
          No leaderboard data available.
        </p>
      ) : (
        leaderboard.map((entry) => (
          <div
            key={entry.id}
            style={
              entry.isCurrentUser
                ? currentUserStyle
                : rowStyle
            }
          >
            <div>
              <strong>
                #{entry.rank} {entry.username}
              </strong>

              {entry.isCurrentUser && (
                <span style={badgeStyle}>YOU</span>
              )}

              <div style={secondaryTextStyle}>
                Score: {entry.score} PUFI
              </div>
            </div>

            <div>
              {entry.rank === 1 && "🥇"}
              {entry.rank === 2 && "🥈"}
              {entry.rank === 3 && "🥉"}
            </div>
          </div>
        ))
      )}

      <div style={footerStyle}>
        Leaderboard updates automatically.
      </div>
    </div>
  );
}