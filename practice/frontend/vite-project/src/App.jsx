// App.jsx
// 최상위 컴포넌트: 훅에서 상태를 가져오고 컴포넌트에 props로 내려줌
import React, { useState, useEffect } from 'react';

import Header       from './components/Header';
import ChatSection  from './components/ChatSection';
import SidePanel    from './components/SidePanel';
import Toast        from './components/Toast';

import { useChat }  from './hooks/useChat';
import { usePosts } from './hooks/usePosts';

import './index.css';

// keyframe 애니메이션을 동적으로 주입 (CSS-in-JS 방식)
const injectKeyframes = () => {
  if (document.getElementById('app-keyframes')) return;
  const style = document.createElement('style');
  style.id = 'app-keyframes';
  style.textContent = `
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.3; }
    }
    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40%           { transform: translateY(-6px); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
};

export default function App() {
  // API URL 상태 (SidePanel 입력창에서 수정 가능)
  const [apiUrl, setApiUrl] = useState('/api');

  // 채팅 훅 - 메시지 목록, 로딩 상태, 전송 함수
  const { messages, loading, sendMessage } = useChat(apiUrl);

  // 게시글 훅 - 목록, 서버 상태, fetch 함수, 토스트
  const { posts, online, fetching, toast, fetchPosts } = usePosts(apiUrl);

  // keyframe 애니메이션 주입 (최초 1회)
  useEffect(() => { injectKeyframes(); }, []);

  // 채팅 전송 후 목록 자동 갱신 (작성/삭제/수정 키워드 감지)
  const handleSend = async (text) => {
    const result = await sendMessage(text);
    if (result?.ok && /작성|삭제|수정|목록|리스트/.test(text)) {
      setTimeout(fetchPosts, 600);  // 약간의 딜레이 후 갱신
    }
  };

  const appStyle = {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const mainStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    flex: 1,
    overflow: 'hidden',
  };

  return (
    <div style={appStyle}>
      {/* 상단 헤더 */}
      <Header online={online} />

      {/* 메인 레이아웃 */}
      <main style={mainStyle}>
        {/* 좌측: 채팅 영역 */}
        <ChatSection
          messages={messages}
          loading={loading}
          onSend={handleSend}
        />

        {/* 우측: 게시글 목록 사이드 패널 */}
        <SidePanel
          posts={posts}
          fetching={fetching}
          onFetch={fetchPosts}
          onSelectPost={handleSend}   // 카드 클릭 시 채팅으로 조회 명령 전송
          apiUrl={apiUrl}
          onApiUrlChange={setApiUrl}
        />
      </main>

      {/* 토스트 알림 */}
      <Toast toast={toast} />
    </div>
  );
}