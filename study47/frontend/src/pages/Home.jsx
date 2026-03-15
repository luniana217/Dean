import React, { useState } from 'react';

const Home2 = () => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 1. 메시지 전송 로직
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setAnswer("");

    try {
      const WEBHOOK_URL = 'http://aiedu.tplinkdns.com:7210/webhook-test/app';

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: inputValue }),
      });

      const data = await response.json();
      setAnswer(data.answer); // n8n에서 넘겨준 answer 필드 표시
    } catch (error) {
      console.error("연결 오류:", error);
      setAnswer("서버와 연결할 수 없습니다. n8n 워크플로우를 확인해주세요.");
    } finally {
      setIsLoading(false);
      setInputValue(""); // 전송 후 입력창 비우기
    }
  };

  // 2. 스타일 정의 (함수 내부 return 이전에 위치하거나 함수 외부에 위치해야 함)
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafd',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const answerAreaStyle = {
    width: '100%',
    maxWidth: '700px',
    padding: '20px',
    marginBottom: '20px',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    fontSize: '17px',
    color: '#3c4043'
  };

  const searchBoxStyle = {
    width: '100%',
    maxWidth: '700px',
    backgroundColor: '#ffffff',
    borderRadius: '28px',
    border: isFocused ? '1px solid #dfe1e5' : '1px solid #f0f4f9',
    boxShadow: isFocused 
      ? '0 4px 12px rgba(60,64,67,0.15)' 
      : '0 1px 6px rgba(32,33,36,0.05)',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    padding: '12px'
  };

  const textareaStyle = {
    width: '100%',
    padding: '10px 16px',
    fontSize: '18px',
    color: '#3c4043',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    resize: 'none',
    minHeight: '44px',
    lineHeight: '1.5'
  };

  const toolbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 8px'
  };

  const footerStyle = {
    marginTop: '24px',
    fontSize: '12px',
    color: '#70757a',
    textAlign: 'center'
  };

  // 3. 실제 화면 렌더링 (단 한 번의 return만 존재해야 함)
  return (
    <div style={containerStyle}>
      {/* 답변 표시 영역 추가 */}
      {(answer || isLoading) && (
        <div style={answerAreaStyle}>
          {isLoading ? "AI가 생각 중입니다..." : answer}
        </div>
      )}

      {/* 입력창 본체 */}
      <div style={searchBoxStyle}>
        <textarea
          rows="1"
          placeholder="무엇이든 물어보세요"
          style={textareaStyle}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />

        <div style={toolbarStyle}>
          <button style={{ 
            backgroundColor: 'transparent', 
            border: 'none', 
            fontSize: '24px', 
            color: '#5f6368',
            cursor: 'pointer' 
          }}>+</button>
          
          <button 
            onClick={handleSendMessage}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#1a73e8',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {isLoading ? "..." : "전송"}
          </button>
        </div>
      </div>

      <div style={footerStyle}>
        Gemini는 실수할 수 있습니다. 중요한 정보는 확인이 필요합니다.
      </div>
    </div>
  );
};

export default Home2;