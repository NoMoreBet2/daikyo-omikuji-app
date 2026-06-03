export async function onRequestPost(context: any) {
  const apiKey = context.env.OPENAI_API_KEY

  if (!apiKey) {
    return Response.json(
      {
        text: "今日は近づかない日。行かないだけで、今日の勝ちは守れます。",
        error: "OPENAI_API_KEY is not set",
      },
      { status: 200 }
    )
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content:
              "あなたは『大凶おみくじ』の短いお告げ文だけを書くAIです。目的は、今日ギャンブル・パチンコに行かないきっかけを作ることです。医療診断、治療助言、依存症判定、借金判断、破産判断はしません。ユーザーを断定せず、恐怖を過度に煽らず、短く印象的なおみくじ風の文章を書いてください。",
          },
          {
            role: "user",
            content:
              "80字以内で、大凶おみくじのお告げ文を1つ作ってください。テーマは『取り返そうとしない』『今日は行かないだけで勝ち』です。",
          },
        ],
        max_output_tokens: 160,
      }),
    })

    if (!response.ok) {
      return Response.json(
        {
          text: "今日は近づかない日。取り返すより、財布を閉じる方が強い日です。",
          error: "OpenAI API error",
        },
        { status: 200 }
      )
    }

    const data: any = await response.json()

    const text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "今日は近づかない日。行かないだけで、今日の勝ちは守れます。"

    return Response.json({ text })
  } catch (error) {
    return Response.json(
      {
        text: "今日は近づかない日。行かない選択が、明日の自分を守ります。",
        error: "Unexpected error",
      },
      { status: 200 }
    )
  }
}
