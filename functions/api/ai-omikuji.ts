const OPENAI_API_URL = "https://api.openai.com/v1/responses"

interface GenerateRequest {
  boxName?: string
  boxShortName?: string
  fortuneTitle?: string
  fortuneDescription?: string
  fortuneLevel?: number
  lossAmount?: number
}

interface AiOmikujiMessages {
  dangerKeyword: string
  oracle: string
  luckyItem: string
}

function pickOutputText(payload: any): string {
  return payload?.output_text || payload?.output?.[0]?.content?.[0]?.text || ""
}

function normalizeMessages(value: any): AiOmikujiMessages | null {
  if (!value || typeof value !== "object") return null

  if (
    typeof value.dangerKeyword !== "string" ||
    typeof value.oracle !== "string" ||
    typeof value.luckyItem !== "string"
  ) {
    return null
  }

  return {
    dangerKeyword: value.dangerKeyword.trim().slice(0, 24),
    oracle: value.oracle.trim().slice(0, 220),
    luckyItem: value.luckyItem.trim().slice(0, 24),
  }
}

function fallbackMessages(boxShortName: string, fortuneTitle: string): AiOmikujiMessages {
  const fallbackLuckyItems = [
    "イヤホンケース",
    "帰り道の地図",
    "白いハンカチ",
    "小さなメモ帳",
    "通知オフ設定",
    "早寝のアラーム",
    "空の封筒",
    "散歩用の靴",
  ]

  return {
    dangerKeyword: "あと一回だけ",
    oracle: `${boxShortName}の誘惑が強い日です。${fortuneTitle}が出た今日は、勝負よりも距離を置く判断がいちばん強いお守りになります。`,
    luckyItem: fallbackLuckyItems[Math.floor(Math.random() * fallbackLuckyItems.length)],
  }
}

export async function onRequestPost(context: any) {
  const apiKey = context.env.OPENAI_API_KEY
  const model = context.env.OPENAI_OMIKUJI_MODEL || "gpt-4.1-mini"

  const body = (await context.request.json()) as GenerateRequest
  const boxName = body.boxName || "おみくじ箱"
  const boxShortName = body.boxShortName || boxName
  const fortuneTitle = body.fortuneTitle || "大凶"
  const fortuneDescription = body.fortuneDescription || ""
  const fortuneLevel = body.fortuneLevel || 1
  const lossAmount = body.lossAmount || 0

  if (!apiKey) {
    return Response.json({
      ...fallbackMessages(boxShortName, fortuneTitle),
      error: "OPENAI_API_KEY is not set",
    })
  }

  const prompt = `大凶おみくじアプリの結果ページに表示する文言を生成してください。

前提:
- このアプリはギャンブルに行かないきっかけ作りのセルフヘルプコンテンツです。
- ユーザーを責めず、少し笑えるが、最終的には「今日は距離を置こう」と思える文にしてください。
- 医療・治療・診断を名乗らないでください。
- 出力は必ずJSONだけにしてください。
- 毎回違いが出るように、定型文を避けてください。
- ラッキーアイテムは飲み物・本に偏らないでください。
- ラッキーアイテムは、持ち物、行動のきっかけ、家にある小物、外出を避ける道具、スマホ設定、衣類、文具、財布まわり、休息グッズなどから幅広く選んでください。
- ラッキーアイテムにギャンブルを連想させるもの、購入を促すもの、高額なものは出さないでください。

選択された箱: ${boxName}
箱の短い名前: ${boxShortName}
おみくじ結果: ${fortuneTitle}
おみくじ説明: ${fortuneDescription}
おみくじレベル: ${fortuneLevel}
本日の想定負け金額: ${lossAmount}円

生成するJSON:
{
  "dangerKeyword": "今日避けたい危険キーワード。12文字以内。ギャンブル種別に合う言葉。",
  "oracle": "お告げ。80〜140文字。${boxShortName}と${fortuneTitle}に触れ、今日行かない理由になる文章。",
  "luckyItem": "今日のラッキーアイテム。12文字以内。飲み物と本以外を優先し、具体的で身近なもの。"
}`

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: prompt,
        text: {
          format: {
            type: "json_schema",
            name: "ai_omikuji_messages",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                dangerKeyword: { type: "string" },
                oracle: { type: "string" },
                luckyItem: { type: "string" },
              },
              required: ["dangerKeyword", "oracle", "luckyItem"],
            },
          },
        },
        temperature: 0.95,
      }),
    })

    if (!response.ok) {
      return Response.json({
        ...fallbackMessages(boxShortName, fortuneTitle),
        error: "OpenAI API error",
      })
    }

    const payload = await response.json()
    const outputText = pickOutputText(payload)
    const parsed = normalizeMessages(JSON.parse(outputText))

    return Response.json(parsed || fallbackMessages(boxShortName, fortuneTitle))
  } catch (error) {
    return Response.json({
      ...fallbackMessages(boxShortName, fortuneTitle),
      error: "Unexpected error",
    })
  }
}
