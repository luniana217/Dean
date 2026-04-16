// components/PostCard.jsx
// 사이드 패널에 표시되는 게시글 카드
// 클릭 시 해당 게시글 조회 명령을 채팅으로 전송
import React, { useState } from 'react';

export default function PostCard({ post, onSelect }) {
  const [hovered, setHovered] = useState(false);

  const cardStyle = {
    background: 'var(--surface2)',
    border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: '10px',
    padding: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    transform: hovered ? 'translateX(2px)' : 'translateX(0)',
    animation: 'fadeUp 0.2s ease',
  };

  const idBadgeStyle = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '10px',
    color: 'var(--accent)',
    background: 'rgba(79,142,247,0.1)',
    padding: '2px 6px',
    borderRadius: '4px',
    flexShrink: 0,
  };

  const titleStyle = {
    fontSize: '13px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1,
  };

  const metaStyle = {
    fontSize: '11px',
    color: 'var(--muted)',
    display: 'flex',
    gap: '8px',
    marginTop: '6px',
  };

  // DB 컬럼명이 한글인 경우와 영문인 경우 모두 대응
  const title   = post.제목    || post.title   || '제목 없음';
  const author  = post.작성자  || post.author  || '작성자 없음';
  const date    = post.created_at ? post.created_at.slice(0, 10) : '';

  return (
    <div
      style={cardStyle}
      onClick={() => onSelect(post.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 상단: ID 뱃지 + 제목 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={idBadgeStyle}>#{post.id}</span>
        <span style={titleStyle}>{title}</span>
      </div>

      {/* 하단: 작성자, 날짜 */}
      <div style={metaStyle}>
        <span>✍️ {author}</span>
        {date && <span>🕐 {date}</span>}
      </div>
    </div>
  );
}
