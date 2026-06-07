import { NextResponse } from "next/server"

const OPENAI_API_URL = "https://api.openai.com/v1/responses"
const MODEL = process.env.OPENAI_OMIKUJI_MODEL ?? "gpt-4.1-mini"

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

function pickOutputText(payload: unknown): string {
  if (!payload || typeof payload !== "object") return ""

  const maybeOutputText = (payload as { output_text?: unknown }).output_text
  if (typeof maybeOutputText === "string") return maybeOutputText

  const output = (payload as { output?: unknown }).output
  if (!Array.isArray(output)) return ""

  for (const item of output) {
    if (!item || typeof item !== "object") continue
    const content = (item as { content?: unknown }).content
    if (!Array.isArray(content)) continue

    for (const part of content) {
      if (!part || typeof part !== "object") continue
      const text = (part as { text?: unknown }).text
      if (typeof text === "string") return text
    }
  }

  return ""
}

function normalizeMessages(value: unknown): AiOmikujiMessages | null {
  if (!value || typeof value !== "object") return null

  const dangerKeyword = (value as { dangerKeyword?: unknown }).dangerKeyword
  const oracle = (value as { oracle?: unknown }).oracle
  const luckyItem = (value as { luckyItem?: unknown }).luckyItem

  if (typeof dangerKeyword !== "string" || typeof oracle !== "string" || typeof luckyItem !== "string") {
    return null
  }

  return {
    dangerKeyword: dangerKeyword.trim().slice(0, 24),
    oracle: oracle.trim().slice(0, 220),
    luckyItem: luckyItem.trim().slice(0, 24),
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not set" }, { status: 500 })
  }

  const body = (await request.json()) as GenerateRequest
  const boxName = body.boxName ?? "おみくじ箱"
  const boxShortName = body.boxShortName ?? boxName
  const fortuneTitle = body.fortuneTitle ?? "大凶"
  const fortuneDescription = body.fortuneDescription ?? ""
  const fortuneLevel = body.fortuneLevel ?? 1
  const lossAmount = body.lossAmount ?? 0

  const prompt = `大凶おみくじアプリの結果ページに表示する文言を生成してください。

前提:
- このアプリはギャンブルに行かないきっかけ作りのセルフヘルプコンテンツです。
- ユーザーを責めず、少し笑えるが、最終的には「今日は距離を置こう」と思える文にしてください。
- 医療・治療・診断を名乗らないでください。
- 出力は必ずJSONだけにしてください。
- 毎回違いが出るように、定型文を避けてください。

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
  "luckyItem": "今日のラッキーアイテム。12文字以内。身近で健全なもの。"
}`

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
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
    const errorText = await response.text()
    return NextResponse.json({ error: errorText || "OpenAI request failed" }, { status: response.status })
  }

  const payload = await response.json()
  const outputText = pickOutputText(payload)
  let parsedJson: unknown

  try {
    parsedJson = JSON.parse(outputText)
  } catch {
    return NextResponse.json({ error: "OpenAI response was not JSON" }, { status: 502 })
  }

  const parsed = normalizeMessages(parsedJson)

  if (!parsed) {
    return NextResponse.json({ error: "Invalid OpenAI response" }, { status: 502 })
  }

  return NextResponse.json(parsed)
}
