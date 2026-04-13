"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const send = async () => {
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();

    setMessages((prev) => [...prev, "🧑 " + input, "🤖 " + data.response]);
    setInput("");
  };

  return (
    <div>
      <div>
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={send}>전송</button>
    </div>
  );
}