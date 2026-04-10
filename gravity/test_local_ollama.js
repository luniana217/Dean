const fs = require('fs');

async function testLocalOllama() {
  try {
    // 설정 파일 읽기
    const configData = fs.readFileSync('./antigravity.config.json', 'utf8');
    const config = JSON.parse(configData);
    const ollamaConfig = config.models['local-ollama'];

    if (!ollamaConfig) {
      throw new Error('"local-ollama" 설정을 antigravity.config.json에서 찾을 수 없습니다.');
    }

    const { baseUrl, model, apiKey } = ollamaConfig;
    
    // v1 API 규격에 맞는 chat/completions 엔드포인트 URL 생성
    const apiUrl = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
    
    console.log(`📡 Local Ollama API 연결 시도 중...`);
    console.log(`- 접속 URL: ${apiUrl}`);
    console.log(`- 사용 모델: ${model}`);

    // 전송할 페이로드 데이터
    const payload = {
      model: model,
      messages: [
        { role: 'user', content: '안녕! 네가 잘 작동하는지 테스트 중이야. 짧게 10자 이내로 인사해줄래?' }
      ],
      max_tokens: 50,
      temperature: 0.1
    };

    const startTime = Date.now();

    // API 요청
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP 에러 ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const elapsedTime = Date.now() - startTime;
    
    console.log(`\n✅ 테스트 성공! 응답을 받았습니다. (소요 시간: ${elapsedTime}ms)`);
    console.log('\n💬 AI의 응답:');
    console.log(data.choices[0].message.content.trim());

  } catch (error) {
    console.error('\n❌ 테스트 실패:');
    console.error(error.message);
    if (error.cause && error.cause.code === 'ECONNREFUSED') {
      console.error('\n💡 힌트: Ollama 서버가 켜져 있는지 확인해주세요. (명령어: ollama serve)');
    }
  }
}

testLocalOllama();
