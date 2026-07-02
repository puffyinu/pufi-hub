export default function LeaderboardCard() {
  const containerStyle: React.CSSProperties = {
    background: '#1E2A4A',
    borderRadius: '20px',
    padding: '32px',
    color: '#FFFFFF',
    fontFamily: 'sans-serif',
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '24px',
    lineHeight: '32px',
  };

  const subtitleStyle: React.CSSProperties = {
    margin: '8px 0 24px',
    color: '#94A3B8',
    fontSize: '16px',
    lineHeight: '24px',
  };

  const rowStyle: React.CSSProperties = {
    margin: '8px 0',
    fontSize: '16px',
    lineHeight: '24px',
  };

  const secondaryTextStyle: React.CSSProperties = {
    color: '#94A3B8',
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>🏆 Leaderboard</h2>
      <p style={subtitleStyle}>Top Community Members</p>
      <div style={rowStyle}>
        <span>🥇 PuffyMaster</span>
        <span style={secondaryTextStyle}> — 1250 PUFI</span>
      </div>
      <div style={rowStyle}>
        <span>🥈 InuHunter</span>
        <span style={secondaryTextStyle}> — 980 PUFI</span>
      </div>
      <div style={rowStyle}>
        <span>🥉 WorldPlayer</span>
        <span style={secondaryTextStyle}> — 820 PUFI</span>
      </div>
    </div>
  );
}
