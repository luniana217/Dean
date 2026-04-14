// components/SidePanel.jsx
// 우측 사이드 패널: 게시글 목록, 새로고침 버튼, API URL 설정
import React, { useState } from 'react';
import PostCard from './PostCard';

const panelStyle = {
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--surface)',
  overflow: 'hidden',
};

const headerStyle = {
  padding: '18px 20px 14px',
  borderBottom: '1px solid var(--border)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
};

const h2Style = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--muted)',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
};

const listStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const configStyle = {
  padding: '12px',
  borderTop: '1px solid var(--border)',
  flexShrink: 0,
};

const inputStyle = {
  width: '100%',
  background: 'var(--surface2)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '8px 12px',
  color: 'var(--text)',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '11px',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const labelStyle = {
  fontSize: '11px',
  color: 'var(--muted)',
  marginBottom: '6px',
  display: 'block',
};

export default function SidePanel({ posts, fetching, onFetch, onSelectPost, apiUrl, onApiUrlChange }) {
  const [refreshHovered, setRefreshHovered] = useState(false);

  const refreshBtnStyle = {
    background: 'none',
    border: 'none',
    color: refreshHovered ? 'var(--accent)' : 'var(--muted)',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px',
    borderRadius: '6px',
    transition: 'all 0.2s',
    background: refreshHovered ? 'var(--surface2)' : 'none',
    animation: fetching ? 'spin 0.8s linear infinite' : 'none',
  };

  return (
    <aside style={panelStyle}>
      {/* 패널 헤더 */}
      <div style={headerStyle}>
        <h2 style={h2Style}>📄 게시글 목록</h2>
        <button
          style={refreshBtnStyle}
          onClick={onFetch}
          disabled={fetching}
          title="새로고침"
          onMouseEnter={() => setRefreshHovered(true)}
          onMouseLeave={() => setRefreshHovered(false)}
        >
          ↻
        </button>
      </div>

      {/* 게시글 목록 */}
      <div style={listStyle}>
        {fetching ? (
          // 로딩 상태
          <EmptyState icon="⏳" text="불러오는 중..." />
        ) : posts.length === 0 ? (
          // 빈 상태
          <EmptyState icon="📭" text={"↻ 버튼을 눌러\n게시글을 불러오세요"} />
        ) : (
          // 게시글 카드 목록
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onSelect={(id) => onSelectPost(`${id}번 글 보여줘`)}
            />
          ))
        )}
      </div>

      {/* API URL 설정 */}
      <div style={configStyle}>
        <label style={labelStyle}>🔌 API 서버 URL</label>
        <input
          style={inputStyle}
          type="text"
          value={apiUrl}
          onChange={e => onApiUrlChange(e.target.value)}
          placeholder="http://localhost:8000"
          onFocus={e  => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={e   => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>
    </aside>
  );
}

// ── 빈 상태 표시 서브 컴포넌트 ──
function EmptyState({ icon, text }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)', fontSize: '13px', whiteSpace: 'pre-line' }}>
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
      {text}
    </div>
  );
}
