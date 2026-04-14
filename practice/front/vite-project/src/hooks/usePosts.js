// hooks/usePosts.js
// 게시글 목록 불러오기 및 서버 연결 상태를 담당하는 커스텀 훅
import { useState, useCallback, useEffect } from 'react';

export function usePosts(apiUrl) {
  const [posts,    setPosts]    = useState([]);          // 게시글 목록
  const [online,   setOnline]   = useState(null);        // 서버 상태 (null=확인중)
  const [fetching, setFetching] = useState(false);       // 목록 로딩 상태
  const [toast,    setToast]    = useState(null);        // 토스트 메시지

  // 토스트 표시 헬퍼 (2.5초 후 자동 제거)
  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  // 서버 헬스체크
  const checkServer = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/`);
      setOnline(res.ok);
    } catch {
      setOnline(false);
    }
  }, [apiUrl]);

  // 게시글 목록 불러오기 (/chat 으로 자연어 요청)
  const fetchPosts = useCallback(async () => {
    setFetching(true);
    try {
      const res = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '게시글 목록 보여줘', thread_id: 'list_refresh' }),
      });

      if (!res.ok) throw new Error('서버 오류');

      const data = await res.json();
      setOnline(true);

      // 응답 텍스트에서 JSON 배열 추출 시도
      const match = data.result.match(/\[.*\]/s);
      if (match) {
        const parsed = JSON.parse(match[0]);
        setPosts(parsed);
        showToast(`${parsed.length}개의 게시글을 불러왔습니다`);
      } else {
        // JSON 파싱 불가 시 빈 배열 (텍스트 응답은 채팅에서 확인)
        setPosts([]);
        showToast('게시글 목록을 불러왔습니다');
      }
    } catch {
      setOnline(false);
      showToast('목록 불러오기 실패', 'error');
    } finally {
      setFetching(false);
    }
  }, [apiUrl, showToast]);

  // 컴포넌트 마운트 시 서버 상태 확인
  useEffect(() => { checkServer(); }, [checkServer]);

  return { posts, online, fetching, toast, fetchPosts, showToast };
}