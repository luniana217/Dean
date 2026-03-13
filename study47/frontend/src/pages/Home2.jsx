import React, { useState, useEffect } from 'react';
import { api } from '@utils/network.js'
import './Home2.css';

const Home2 = () => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // --- 스타일 정의 ---
 


  return (
    <div style={containerStyle}>
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
        />

        <div style={toolbarStyle}>
          {/* 왼쪽: 플러스 버튼만 유지 */}
         
            
         
        </div>
      </div>

      <div style={footerStyle}>
        
      </div>
    </div>
  );
};

export default Home2;