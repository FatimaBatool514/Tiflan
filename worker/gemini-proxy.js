// Cloudflare Worker: keeps your Gemini key secret. Paste into the Cloudflare dashboard editor.
// Secrets/variables to add: GEMINI_API_KEY (secret), optional MODEL, optional ALLOWED_ORIGIN (your site URL).
export default {
  async fetch(req, env) {
    const cors = { "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST,OPTIONS" };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST") return new Response("POST only", { status: 405, headers: cors });
    let body; try { body = await req.json(); } catch { return new Response("bad json", { status: 400, headers: cors }); }
    const { system = "", prompt = "" } = body;
    if (!prompt || prompt.length > 2000) return new Response("bad request", { status: 400, headers: cors });
    const model = env.MODEL || "gemini-2.5-flash";
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 400, temperature: 0.4 } })
    });
    const j = await r.json();
    const text = (j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts[0].text) || "";
    return new Response(JSON.stringify({ text }), { headers: { ...cors, "Content-Type": "application/json" } });
  }
};
