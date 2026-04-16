// components/MessageBubble.jsx
// 채팅 말풍선: role에 따라 user(오른쪽) / agent(왼쪽) 레이아웃 분기
import React from 'react';

export default function MessageBubble({ role, content, time }) {
  const isUser = role === 'user';

  const wrapStyle = {
    display: 'flex',
    gap: '10px',
    flexDirection: isUser ? 'row-reverse' : 'row',
    animation: 'fadeUp 0.25s ease',
  };

  const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    flexShrink: 0,
    background: isUser
      ? 'linear-gradient(135deg, var(--accent), var(--accent2))'
      : 'var(--surface2)',
    border: isUser ? 'none' : '1px solid var(--border)',
  };

  const bubbleStyle = {
    maxWidth: '75%',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    lineHeight: 1.6,
    background: isUser ? 'var(--user-bg)' : 'var(--agent-bg)',
    border: isUser
      ? '1px solid rgba(79,142,247,0.2)'
      : '1px solid var(--border)',
    borderTopRightRadius: isUser ? '3px' : '12px',
    borderTopLeftRadius:  isUser ? '12px' : '3px',
    whiteSpace: 'pre-wrap',   // 줄바꿈 유지
    wordBreak: 'break-word',
  };

  const timeStyle = {
    fontSize: '10px',
    color: 'var(--muted)',
    marginTop: '6px',
  };

  return (
    <div style={wrapStyle}>
      <div style={avatarStyle}>
        {isUser ? '🐻' : '🐼'}
      </div>
      <div style={bubbleStyle}>
        {content}
        <div style={timeStyle}>{time}</div>
      </div>
    </div>
  );
}
