// components/Toast.jsx
// 화면 하단 중앙에 잠깐 나타나는 알림 컴포넌트
// toast가 null이면 숨김, 있으면 슬라이드업 표시
import React from 'react';

export default function Toast({ toast }) {
  const visible = toast !== null;

  const style = {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: `translateX(-50%) translateY(${visible ? '0' : '60px'})`,
    background: 'var(--surface2)',
    border: `1px solid ${toast?.type === 'error' ? 'var(--error)' : 'var(--success)'}`,
    borderRadius: '10px',
    padding: '10px 20px',
    fontSize: '13px',
    color: toast?.type === 'error' ? 'var(--error)' : 'var(--success)',
    transition: 'transform 0.3s ease',
    zIndex: 999,
    pointerEvents: 'none',   // 클릭 통과
    whiteSpace: 'nowrap',
  };

  return <div style={style}>{toast?.msg}</div>;
}
