const express = require('express');
const cors = require('cors');
const axios = require('axios');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

const OLLAMA_URL = 'http://localhost:11434/api/chat';
const MODEL = 'gemma4:e4b';

const SYSTEM_PROMPT = `
You are a helpful assistant that extracts information from a user's natural language prompt to perform CRUD operations on a bulletin board.
You MUST respond ONLY with a valid JSON object.

Fields to extract:
- action: "CREATE", "UPDATE", "DELETE", or "UNKNOWN"
- data: {
    id: (optional integer for update/delete),
    name: (string),
    title: (string),
    content: (string)
  }

Examples:
1. User: "게시글 작성해줘. 이름은 홍길동, 제목은 반가워요, 내용은 오늘 날씨 좋네요"
   Response: {"action": "CREATE", "data": {"name": "홍길동", "title": "반가워요", "content": "오늘 날씨 좋네요"}}

2. User: "1번 게시글 삭제해줘"
   Response: {"action": "DELETE", "data": {"id": 1}}

3. User: "2번 게시글 수정해. 제목을 공지사항으로 바꿔줘"
   Response: {"action": "UPDATE", "data": {"id": 2, "title": "공지사항"}}

Wait for the instruction and respond with JSON ONLY.
`;

app.post('/api/prompt', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(OLLAMA_URL, {
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      stream: false,
      format: 'json'
    });

    const result = JSON.parse(response.data.message.content);

    if (result.action === 'CREATE') {
      const { name, title, content } = result.data;
      const info = db.prepare('INSERT INTO posts (name, title, content) VALUES (?, ?, ?)').run(name, title, content);
      return res.json({ success: true, action: 'CREATE', id: info.lastInsertRowid });
    } 
    
    if (result.action === 'DELETE') {
      const { id } = result.data;
      db.prepare('DELETE FROM posts WHERE id = ?').run(id);
      return res.json({ success: true, action: 'DELETE' });
    }

    if (result.action === 'UPDATE') {
      const { id, name, title, content } = result.data;
      const current = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
      if (!current) return res.status(404).json({ error: 'Post not found' });

      db.prepare('UPDATE posts SET name = ?, title = ?, content = ? WHERE id = ?').run(
        name || current.name,
        title || current.title,
        content || current.content,
        id
      );
      return res.json({ success: true, action: 'UPDATE' });
    }

    res.status(400).json({ error: 'Could not understand action', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ollama processing failed', detail: error.message });
  }
});

app.get('/api/posts', (req, res) => {
  const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (post) res.json(post);
  else res.status(404).json({ error: 'Post not found' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
