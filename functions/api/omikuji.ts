// Cloudflare Pages Functions: POST /api/omikuji
// OpenAI APIを使用してお告げを生成

interface Env {
  OPENAI_API_KEY: string
}

const SYSTEM_PROMPT = `あなたは「大凶おみくじ」のお告げを生成するAIです。
ギャンブル（パチンコ・スロット）に行きたくなった人に対して、「今日だけ行かない理由」を与えるお告げを生成してください。

ルール:
- 必ず凶の結果として、今日はギャンブルに行くべきではないという内容にする
- 説教臭くならず、運勢のせいにする形で自然に諦めさせる
- 2〜3文で簡潔に
- 優しく、でも説得力のある言葉で
- 「今日は」という言葉を含める

例:
「今日は『少しだけ』が一番危険。近づかないだけで、今日はもう勝ちです。」
「財布に余裕がある日ほど危険。今日は使わない選択が吉です。」
「今日は『取り返す』という言葉が出た時点で警戒日。深追いは財布も心も削ります。」`

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env } = context

  // CORS headers
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }

  // APIキーの確認
  if (!env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OpenAI API key is not configured" }),
      { status: 500, headers }
    )
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: "今日のお告げを1つ生成してください。" },
        ],
        max_tokens: 200,
        temperature: 0.9,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("OpenAI API error:", errorData)
      return new Response(
        JSON.stringify({ error: "Failed to generate fortune" }),
        { status: 500, headers }
      )
    }

    const data = await response.json() as {
      choices: Array<{ message: { content: string } }>
    }
    const text = data.choices[0]?.message?.content?.trim() || ""

    return new Response(
      JSON.stringify({ data: { text } }),
      { status: 200, headers }
    )
  } catch (error) {
    console.error("Error generating fortune:", error)
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers }
    )
  }
}

// OPTIONS リクエスト対応（CORS preflight）
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
