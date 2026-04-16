// components/ChatSection.jsx
// 채팅 영역: 메시지 목록 + 빠른 명령 버튼 + 입력창 통합 레이아웃
import React, { useEffect, useRef } from 'react';
import MessageBubble  from './MessageBubble';
import QuickCommands  from './QuickCommands';
import ChatInput      from './ChatInput';

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid var(--border)',
  overflow: 'hidden',
};

const messagesStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: '24px 28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  scrollBehavior: 'smooth',
};

// 로딩 중 표시되는 dots 애니메이션
function LoadingDots() {
  const wrapStyle = {
    display: 'flex',
    gap: '10px',
    animation: 'fadeUp 0.25s ease',
  };
  const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    flexShrink: 0,
  };
  const bubbleStyle = {
    padding: '14px 18px',
    borderRadius: '12px',
    borderTopLeftRadius: '3px',
    background: 'var(--agent-bg)',
    border: '1px solid var(--border)',
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  };
  const dotStyle = (delay) => ({
    width: '6px',
    height: '6px',
    background: 'var(--muted)',
    borderRadius: '50%',
    animation: `bounce 1.2s ${delay} infinite`,
  });

  return (
    <div style={wrapStyle}>
      <div style={avatarStyle}>🤖</div>
      <div style={bubbleStyle}>
        <div style={dotStyle('0s')} />
        <div style={dotStyle('0.2s')} />
        <div style={dotStyle('0.4s')} />
      </div>
    </div>
  );
}

export default function ChatSection({ messages, loading, onSend }) {
  const bottomRef = useRef(null);

  // 새 메시지마다 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <section style={sectionStyle}>
      {/* 메시지 목록 */}
      <div style={messagesStyle}>
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            time={msg.time}
          />
        ))}

        {/* 에이전트 응답 대기 중 로딩 표시 */}
        {loading && <LoadingDots />}

        {/* 스크롤 앵커 */}
        <div ref={bottomRef} />
      </div>

      {/* 빠른 명령 버튼 */}
      <QuickCommands onSend={onSend} />

      {/* 입력창 */}
      <ChatInput onSend={onSend} disabled={loading} />
    </section>
  );
}
