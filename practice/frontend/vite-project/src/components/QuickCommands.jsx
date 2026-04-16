// components/QuickCommands.jsx
import React from 'react';

const QUICK_CMDS = [
  { label: '📋 목록 보기',   text: '게시글 목록 보여줘' },
  { label: '🔍 1번 글 조회', text: '1번 글 보여줘' },
  { label: '🗑️ 1번 글 삭제', text: '1번 글 삭제해줘' },
];

const wrapStyle = {
  padding: '0 28px 12px',
  background: 'var(--surface)',
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
};

export default function QuickCommands({ onSend }) {
  return (
    <div style={wrapStyle}>
      {QUICK_CMDS.map(cmd => (
        <QuickBtn key={cmd.text} label={cmd.label} onClick={() => onSend(cmd.text)} />
      ))}
    </div>
  );
}

function QuickBtn({ label, onClick }) {
  const [hovered, setHovered] = React.useState(false);

  const style = {
    background: 'var(--surface2)',
    border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: '20px',
    padding: '5px 12px',
    fontSize: '12px',
    color: hovered ? 'var(--accent)' : 'var(--muted)',
    cursor: 'pointer',
    fontFamily: "'Noto Sans KR', sans-serif",
    transition: 'all 0.2s',
  };

  return (
    <button
      style={style}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </button>
  );
}