fetch("http://localhost:4000/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: [{ role: "user", content: "Hi" }] })
}).then(r => r.text()).then(t => console.log(typeof t, t.trim().slice(0, 1000)));
