// components/Header.jsx
// 상단 헤더: 로고, 타이틀, 서버 연결 상태 표시
import React from 'react';

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 28px',
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
  },
  logo: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    letterSpacing: '-0.3px',
  },
  subtitle: {
    fontSize: '12px',
    color: 'var(--muted)',
    marginLeft: '4px',
  },
  statusWrap: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statusLabel: {
    fontSize: '11px',
    color: 'var(--muted)',
  },
};

export default function Header({ online }) {
  // online: true=연결됨 / false=끊김 / null=확인중
  const dotColor =
    online === null  ? 'var(--muted)' :
    online           ? 'var(--success)' :
                       'var(--error)';

  const dotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: dotColor,
    animation: online ? 'pulse 2s infinite' : 'none',
  };

  const label =
    online === null ? '확인 중...' :
    online          ? '서버 연결됨' :
                      '서버 끊김';

  return (
    <header style={styles.header}>
      {/* 로고 */}
      <div style={styles.logo}>🤖</div>

      {/* 타이틀 */}
      <div>
        <span style={styles.title}>
          게시판 AI 에이전트
          <span style={styles.subtitle}>Board Manager</span>
        </span>
      </div>

      {/* 서버 상태 표시 */}
      <div style={styles.statusWrap}>
        <span style={styles.statusLabel}>{label}</span>
        <div style={dotStyle} />
      </div>
    </header>
  );
}
