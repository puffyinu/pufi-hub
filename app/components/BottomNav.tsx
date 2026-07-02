export default function BottomNav() {
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '72px',
    background: '#111827',
    borderTop: '1px solid #23304A',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1000,
  };

  const activeItemStyle: React.CSSProperties = {
    color: '#FBBF24',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '14px',
    gap: '4px',
  };

  const itemStyle: React.CSSProperties = {
    color: '#94A3B8',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '14px',
    gap: '4px',
  };

  return (
    <nav style={containerStyle}>
      <div style={activeItemStyle}>
        <span>🏠</span>
        <span>Dashboard</span>
      </div>
      <div style={itemStyle}>
        <span>🎯</span>
        <span>Tasks</span>
      </div>
      <div style={itemStyle}>
        <span>💰</span>
        <span>Wallet</span>
      </div>
      <div style={itemStyle}>
        <span>👤</span>
        <span>Profile</span>
      </div>
    </nav>
  );
}