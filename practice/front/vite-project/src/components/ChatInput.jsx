// components/ChatInput.jsx
// 채팅 입력창: textarea 자동 높이 조절, Enter 전송, Shift+Enter 줄바꿈
import React, { useRef, useCallback } from 'react';

const containerStyle = {
  padding: '16px 28px',
  background: 'var(--surface)',
  borderTop: '1px solid var(--border)',
  display: 'flex',
  gap: '10px',
  alignItems: 'flex-end',
};

const btnBaseStyle = {
  width: '44px',
  height: '44px',
  background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  flexShrink: 0,
  transition: 'opacity 0.2s, transform 0.1s',
};

export default function ChatInput({ onSend, disabled }) {
  const textareaRef = useRef(null);
  const [value, setValue] = React.useState('');
  const [hovered, setHovered] = React.useState(false);

  // textarea 높이 자동 조절 (최대 120px)
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, []);

  const handleChange = (e) => {
    setValue(e.target.value);
    autoResize();
  };

  // Enter 전송 / Shift+Enter 줄바꿈
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
    // 전송 후 높이 초기화
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    textareaRef.current?.focus();
  };

  const textareaStyle = {
    flex: 1,
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: 'var(--text)',
    fontFamily: "'Noto Sans KR', sans-serif",
    fontSize: '14px',
    resize: 'none',
    outline: 'none',
    minHeight: '44px',
    maxHeight: '120px',
    lineHeight: 1.5,
    transition: 'border-color 0.2s',
  };

  const btnStyle = {
    ...btnBaseStyle,
    opacity: disabled || !value.trim() ? 0.35 : hovered ? 0.85 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <div style={containerStyle}>
      <textarea
        ref={textareaRef}
        style={textareaStyle}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="게시글 작성, 조회, 수정, 삭제를 자연어로 입력하세요... (Enter 전송)"
        rows={1}
        disabled={disabled}
        // 포커스 시 테두리 색상 변경
        onFocus={e  => (e.target.style.borderColor = 'var(--accent)')}
        onBlur={e   => (e.target.style.borderColor = 'var(--border)')}
      />
      <button
        style={btnStyle}
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title="전송 (Enter)"
      >
        ➤
      </button>
    </div>
  );
}
