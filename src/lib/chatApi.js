/**
 * chatApi.js — talks to POST /api/chat on the SPTIS backend.
 * The AI key lives on the server; nothing secret is shipped to the browser.
 */
const BASE = import.meta.env.VITE_API_BASE || '';

/**
 * Streams one reply.
 *   onEvent('token',    { text })
 *   onEvent('thinking', { tools })
 *   onEvent('journeys', { journeys })
 *   onEvent('done' | 'error', ...)
 */
export async function sendChat({ messages, lang = 'en', signal, onEvent }) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, lang }),
    signal
  });

  if (!res.ok || !res.body) {
    let message = 'The assistant is unavailable right now.';
    try { message = (await res.json()).error || message; } catch { /* not json */ }
    onEvent('error', { message });
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by a blank line
    const frames = buffer.split('\n\n');
    buffer = frames.pop();
    for (const frame of frames) {
      let event = 'message';
      let data = '';
      frame.split('\n').forEach((line) => {
        if (line.startsWith('event: ')) event = line.slice(7).trim();
        else if (line.startsWith('data: ')) data += line.slice(6);
      });
      if (!data) continue;
      try { onEvent(event, JSON.parse(data)); } catch { /* ignore a partial frame */ }
    }
  }
}
