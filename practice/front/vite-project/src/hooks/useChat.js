// hooks/useChat.js
// 채팅 메시지 전송, 히스토리 관리, 로딩 상태를 담당하는 커스텀 훅
import { useState, useCallback } from 'react';

// 세션 고정 thread_id (페이지 로드마다 새 세션)
const THREAD_ID = `frontend_session_${Date.now()}`;

export function useChat(apiUrl) {
  const [messages, setMessages]   = useState([
    // 초기 안내 메시지
    {
      id: 0,
      role: 'agent',
      content: '안녕하세요! 게시판 AI 에이전트입니다.\n자연어로 게시글을 관리할 수 있어요.\n\n예시:\n📝 "오늘 일기 제목으로 김하영이 작성해줘"\n📋 "게시글 목록 보여줘"\n🔍 "1번 글 조회해줘"',
      time: now(),
    },
  ]);
  const [loading, setLoading] = useState(false);

  // 메시지 추가 헬퍼
  const addMessage = useCallback((role, content) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), role, content, time: now() },
    ]);
  }, []);

  // FastAPI /chat 호출
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;

    // 1) 사용자 메시지 즉시 추가
    addMessage('user', text);
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, thread_id: THREAD_ID }),
      });

      if (!res.ok) {
        const err = await res.json();
        addMessage('agent', `❌ 오류: ${err.detail || '서버 오류가 발생했습니다'}`);
        return { ok: false };
      }

      const data = await res.json();
      // 2) 에이전트 응답 추가
      addMessage('agent', data.result);
      return { ok: true, text };

    } catch (e) {
      addMessage('agent', `❌ 서버에 연결할 수 없습니다.\nAPI URL을 확인해주세요: ${apiUrl}`);
      return { ok: false, error: e };
    } finally {
      setLoading(false);
    }
  }, [apiUrl, loading, addMessage]);

  return { messages, loading, sendMessage };
}

// 현재 시각 포맷 헬퍼
function now() {
  return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}