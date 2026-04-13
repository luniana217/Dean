import React, { useState } from 'react';
import './Home.css'; // 작성하신 CSS 파일명이 Home2.css라고 가정합니다.

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [answer, setAnswer] = useState(""); // AI 답변 저장
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setAnswer(""); // 새 질문 시 이전 답변 초기화

    try {
      const WEBHOOK_URL = 'http://aiedu.tplinkdns.com:7210/webhook-test/app';

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: inputValue }),
      });

      const data = await response.json();
      
      // n8n에서 넘겨준 answer 필드를 화면에 표시
      setAnswer(data.answer); 
    } catch (error) {
      console.error("연결 오류:", error);
      setAnswer("서버와 연결할 수 없습니다. n8n 워크플로우를 확인해주세요.");
    } finally {
      setIsLoading(false);
      setInputValue(""); // 전송 후 입력창 비우기
    }
  };

  return (
    <div className="container">
      {/* 답변 표시 영역 (필요 시 CSS에 .answer-area 추가) */}
      {(answer || isLoading) && (
        <div className="answer-area" style={answerAreaTempStyle}>
          {isLoading ? "AI가 답변을 생성 중입니다..." : answer}
        </div>
      )}

      {/* 입력창 본체: 기존 CSS 클래스 적용 */}
      <div className="search-box">
        <textarea
          className="search-textarea"
          placeholder="무엇이든 물어보세요"
          rows="1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />

        <div style={toolbarStyle}>
          {/* 플러스 버튼 유지 */}
          <button className="plus-button">+</button>
          
          {/* 전송 버튼 추가 (plus-button 스타일 활용 가능) */}
          <button 
            onClick={handleSendMessage} 
            disabled={isLoading}
            className="plus-button" // 버튼 스타일 통일을 위해 클래스 공유
            style={{ fontSize: '16px', width: 'auto', padding: '0 15px', color: '#1a73e8' }}
          >
            {isLoading ? "..." : "전송"}
          </button>
        </div>
      </div>

      <div className="footer">
        Gemini는 실수할 수 있습니다. 중요한 정보는 확인이 필요합니다.
      </div>
    </div>
  );
};

// 답변 영역을 위한 임시 스타일 (나중에 CSS 파일로 옮기셔도 됩니다)
const answerAreaTempStyle = {
  width: '100%',
  maxWidth: '700px',
  padding: '20px',
  marginBottom: '20px',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap',
  fontSize: '17px',
  color: '#3c4043'
};

const toolbarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 8px'
};

export default Home;