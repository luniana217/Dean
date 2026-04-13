import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Sparkles, 
  X, 
  User, 
  Calendar, 
  Send, 
  MessageSquare, 
  Terminal,
  Activity,
  ArrowRight
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [posts, setPosts] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [threadId] = useState(`session_${Math.random().toString(36).substr(2, 9)}`);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchPosts();
    // Auto focus on load
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    }
  };

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setAiResponse(null);
    try {
      const res = await axios.post(`${API_BASE}/prompt`, { 
        prompt,
        thread_id: threadId
      });
      
      setAiResponse({
        text: res.data.response,
        agent: res.data.agent
      });
      
      setPrompt('');
      fetchPosts();
    } catch (err) {
      setAiResponse({
        text: "Error: AI processing failed. Make sure Ollama and the backend are running.",
        agent: "System"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Antigravity Swarm Board</h1>
        <p>Using natural language to control the world</p>
      </header>

      <section className="prompt-section">
        <form className="prompt-wrapper" onSubmit={handlePromptSubmit}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
             <Sparkles size={20} color="#38bdf8" />
          </div>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Type your command (e.g., 'Create a post...', 'Delete #5', 'Hello!')" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? <div className="loading-spinner" /> : <>Run <ArrowRight size={18} /></>}
          </button>
        </form>

        {aiResponse && (
          <div className="ai-response">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className={`agent-badge agent-${aiResponse.agent.toLowerCase().replace('agent', '')}`}>
                {aiResponse.agent}
              </span>
              <Activity size={12} className="pulse" />
            </div>
            <p>{aiResponse.text}</p>
          </div>
        )}
      </section>

      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Terminal size={24} /> Recent Posts
      </h2>

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)', border: '2px dashed var(--glass-border)', borderRadius: '2rem' }}>
          No posts found. Use the prompt above to create the first one!
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post.id} className="post-card" onClick={() => setSelectedPost(post)}>
              <div style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                POST #{post.id}
              </div>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <div className="post-footer">
                <div className="user-tag">
                  <User size={14} /> <span>{post.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPost(null)}>
              <X size={32} />
            </button>
            <div style={{ marginBottom: '2rem' }}>
               <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold', letterSpacing: '0.1em' }}>
                ARTICLE #{selectedPost.id}
               </span>
               <h2 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.1', marginTop: '1rem' }}>
                 {selectedPost.title}
               </h2>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '2rem' }}>
               <div className="user-tag" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)' }}>
                 <User size={18} /> <strong style={{ marginLeft: '5px' }}>{selectedPost.name}</strong>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)' }}>
                 <Calendar size={18} /> {new Date(selectedPost.created_at).toLocaleString()}
               </div>
            </div>

            <div style={{ 
              fontSize: '1.25rem', 
              lineHeight: '1.8', 
              color: '#e2e8f0', 
              whiteSpace: 'pre-wrap'
            }}>
              {selectedPost.content}
            </div>

            <div style={{ 
              marginTop: '4rem', 
              padding: '2rem', 
              borderRadius: '1.5rem', 
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <MessageSquare size={24} color="var(--accent-primary)" />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                You can manage this post by typing things like <strong>"Delete post #{selectedPost.id}"</strong> or <strong>"Edit post #{selectedPost.id}"</strong> in the main prompt bar.
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .pulse { animation: pulse 2s infinite; margin-left: 10px; color: #38bdf8; }
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

export default App;
