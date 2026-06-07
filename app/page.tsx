"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  boxTextSeeds,
  fortuneResults,
  levelMultipliers,
  levelWeights,
  omikujiBoxes,
  type FortuneLevel,
  type FortuneResult,
  type OmikujiBox,
} from "@/lib/omikuji-data"

type Step = "welcome" | "select" | "result"

interface DrawResult {
  fortune: FortuneResult
  level: FortuneLevel
  lossAmount: number
  purchaseItemName: string
  dangerKeyword: string
  oracle: string
  luckyItem: string
}

interface PurchaseExampleGroup {
  maxAmount: number
  items: string[]
}

const yenFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
})

const purchaseExampleGroups: PurchaseExampleGroup[] = [
  {
    maxAmount: 500,
    items: ["コンビニスイーツ", "缶コーヒー数本", "アイスクリーム", "子どものお菓子", "ハンバーガーセット", "ノート", "ボールペン"],
  },
  {
    maxAmount: 1000,
    items: ["牛丼", "ラーメン", "本1冊", "子どものおもちゃ", "お弁当", "入浴剤セット", "花束"],
  },
  {
    maxAmount: 2000,
    items: ["映画鑑賞", "ピザ", "回転寿司", "絵本", "カフェランチ", "日帰り温泉", "Tシャツ"],
  },
  {
    maxAmount: 3000,
    items: ["家族で回転寿司", "焼肉ランチ", "動物園", "水族館", "子どもの運動靴", "高級スイーツ", "ビジネス書数冊", "ボードゲーム", "観葉植物", "日帰り温泉入浴券"],
  },
  {
    maxAmount: 5000,
    items: ["焼肉ランチ", "水族館入場券", "動物園入場券", "ボードゲーム", "子どもの絵本セット", "高級スイーツ", "カフェ巡り", "ビジネス書セット", "旅行ガイドブック", "スマホアクセサリー"],
  },
  {
    maxAmount: 10000,
    items: ["家族で外食", "高級焼肉", "テーマパーク入場券", "美容院", "スニーカー", "リュック", "ワイヤレスイヤホン", "ブランド財布", "家族写真撮影", "日帰り旅行"],
  },
  {
    maxAmount: 30000,
    items: ["子ども用自転車", "Nintendo Switch", "高級炊飯器", "スーツ", "テレビゲーム機", "温泉旅行", "掃除機", "ホテル宿泊", "ブランドバッグ", "学習教材"],
  },
  {
    maxAmount: 50000,
    items: ["電動キックボード", "iPad", "Apple Watch", "テーマパーク旅行", "高級ホテル宿泊", "家族旅行", "ゴルフクラブ", "高級炊飯器", "デスクチェア", "スマートフォン"],
  },
  {
    maxAmount: 80000,
    items: ["最新スマートフォン", "ノートパソコン", "冷蔵庫", "洗濯機", "電動アシスト自転車の頭金", "高級旅館宿泊", "ゲーミングモニター", "テレビ", "ソファ", "学習机"],
  },
  {
    maxAmount: 100000,
    items: ["iPhone Pro", "ドラム式洗濯乾燥機の頭金", "沖縄旅行", "家族旅行", "高級腕時計", "エアコン", "電動アシスト自転車", "ノートパソコン", "カメラ", "ベビーカー一式"],
  },
  {
    maxAmount: 150000,
    items: ["電動アシスト自転車", "ドラム式洗濯乾燥機", "最新ノートパソコン", "家族で温泉旅行", "大型テレビ", "冷蔵庫", "エアコン買い替え", "高級旅館宿泊", "学習机一式", "入学準備一式"],
  },
  {
    maxAmount: 200000,
    items: ["ドラム式洗濯乾燥機", "沖縄旅行", "海外旅行", "大型冷蔵庫", "ハイエンドPC", "電動自転車", "ブランド腕時計", "カメラ機材", "ソファセット", "ベッド"],
  },
  {
    maxAmount: 250000,
    items: ["家族で沖縄旅行", "ドラム式洗濯乾燥機", "MacBook Air", "大型テレビ", "冷蔵庫", "ベッド一式", "電動アシスト自転車", "リフォーム資金", "高級ソファ", "学習環境一式"],
  },
  {
    maxAmount: 300000,
    items: ["家族で沖縄旅行", "MacBook Pro", "冷蔵庫＋洗濯機", "ハイエンドPC", "電動自転車", "高級旅館宿泊", "海外旅行", "ソファセット", "ダイニングセット", "子どもの教育資金"],
  },
  {
    maxAmount: 400000,
    items: ["家族で海外旅行", "軽自動車の頭金", "ハイエンドPC", "MacBook Pro", "大型テレビ", "高級カメラ", "リフォーム資金", "家具一式", "家電一式", "学費積立"],
  },
  {
    maxAmount: 500000,
    items: ["家族で海外旅行", "軽自動車の頭金", "結婚指輪", "ハイエンドPC環境", "バイク", "大型家電一式", "リフォーム", "教育資金", "家具買い替え", "投資資金"],
  },
  {
    maxAmount: 600000,
    items: ["軽自動車の頭金", "新婚旅行", "家族で海外旅行", "バイク", "リフォーム", "家電総入れ替え", "高級時計", "教育資金", "投資資金", "住宅設備"],
  },
  {
    maxAmount: 700000,
    items: ["軽自動車の頭金", "海外旅行", "リフォーム", "バイク", "学費", "家具家電一式", "高級腕時計", "投資資金", "結婚式費用の一部", "住宅資金"],
  },
  {
    maxAmount: 800000,
    items: ["軽自動車の購入資金", "家族で海外旅行", "学費", "リフォーム", "バイク", "家具家電一式", "結婚式資金", "住宅頭金", "投資資金", "教育資金"],
  },
  {
    maxAmount: 900000,
    items: ["軽自動車", "家族で海外旅行", "結婚式資金", "リフォーム", "学費", "家具家電一式", "住宅頭金", "バイク", "投資資金", "教育資金"],
  },
  {
    maxAmount: 1000000,
    items: ["軽自動車", "普通車の頭金", "家族でハワイ旅行", "結婚式費用", "マイホーム頭金", "子どもの大学資金", "リフォーム", "投資資金", "教育資金", "老後資金"],
  },
]

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function drawFortuneLevel(): FortuneLevel {
  const entries = Object.entries(levelWeights) as [string, number][]
  const totalWeight = entries.reduce((total, [, weight]) => total + weight, 0)
  let cursor = Math.random() * totalWeight

  for (const [level, weight] of entries) {
    cursor -= weight
    if (cursor < 0) return Number(level) as FortuneLevel
  }

  return 1
}

function drawFortuneByLevel(level: FortuneLevel): FortuneResult {
  const candidates = fortuneResults.filter((fortune) => fortune.level === level)
  return pickRandom(candidates.length > 0 ? candidates : fortuneResults)
}

function getRandomLossMultiplier(): number {
  return (Math.floor(Math.random() * 10) + 1) / 10
}

function roundUpToHundred(amount: number): number {
  return Math.ceil(amount / 100) * 100
}

function getPurchaseExample(lossAmount: number): string {
  const group =
    purchaseExampleGroups.find((exampleGroup) => lossAmount <= exampleGroup.maxAmount) ??
    purchaseExampleGroups[purchaseExampleGroups.length - 1]

  return pickRandom(group.items)
}

function generateBoxMessages(box: OmikujiBox, fortune: FortuneResult) {
  const seed = boxTextSeeds[box.key]
  const dangerKeyword = pickRandom(seed.dangerKeywords)
  const oracleHint = pickRandom(seed.oracleHints)

  return {
    dangerKeyword,
    oracle: `${box.shortName}の気配が強い日です。「${dangerKeyword}」という言葉が頭に浮かんだら、${fortune.title}が近くにいます。${oracleHint}`,
    luckyItem: pickRandom(seed.luckyItems),
  }
}

function drawResult(box: OmikujiBox): DrawResult {
  const level = drawFortuneLevel()
  const fortune = drawFortuneByLevel(level)
  const lossAmount = roundUpToHundred(box.baseLossAmount * levelMultipliers[level] * getRandomLossMultiplier())
  const messages = generateBoxMessages(box, fortune)

  return {
    fortune,
    level,
    lossAmount,
    purchaseItemName: getPurchaseExample(lossAmount),
    ...messages,
  }
}

async function generateAiMessages(box: OmikujiBox, result: DrawResult) {
  const response = await fetch("/api/ai-omikuji", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      boxName: box.name,
      boxShortName: box.shortName,
      fortuneTitle: result.fortune.title,
      fortuneDescription: result.fortune.description,
      fortuneLevel: result.level,
      lossAmount: result.lossAmount,
    }),
  })

  if (!response.ok) {
    throw new Error("AI message generation failed")
  }

  return (await response.json()) as Pick<DrawResult, "dangerKeyword" | "oracle" | "luckyItem">
}

function getShareText(result: DrawResult, selectedBox: OmikujiBox | null): string {
  const boxText = selectedBox ? `\n箱：${selectedBox.name}` : ""

  return `【${result.fortune.title}】${boxText}
レベル：${result.level}
本日の想定負け金額：${yenFormatter.format(result.lossAmount)}
買えたもの：${result.purchaseItemName}
ラッキーアイテム：${result.luckyItem}

${result.fortune.description}

${result.oracle}

#大凶おみくじ #ギャンブル回避`
}

function getTwitterShareUrl(result: DrawResult, selectedBox: OmikujiBox | null): string {
  const text = encodeURIComponent(getShareText(result, selectedBox))
  const url = encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")
  return `https://twitter.com/intent/tweet?text=${text}&url=${url}`
}

function getLineShareUrl(result: DrawResult, selectedBox: OmikujiBox | null): string {
  const url = typeof window !== "undefined" ? window.location.href : ""
  const text = encodeURIComponent(`${getShareText(result, selectedBox)}\n${url}`)
  return `https://line.me/R/msg/text/?${text}`
}

function SmokeBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] rounded-full animate-smoke opacity-30"
        style={{
          background: "radial-gradient(ellipse at center, oklch(0.35 0.12 280 / 0.4) 0%, transparent 70%)",
          animationDelay: "0s",
        }}
      />
      <div
        className="absolute top-1/4 -right-1/4 w-[120%] h-[120%] rounded-full animate-smoke opacity-25"
        style={{
          background: "radial-gradient(ellipse at center, oklch(0.3 0.15 290 / 0.35) 0%, transparent 60%)",
          animationDelay: "2s",
        }}
      />
      <div
        className="absolute -bottom-1/4 left-1/4 w-[100%] h-[100%] rounded-full animate-smoke opacity-20"
        style={{
          background: "radial-gradient(ellipse at center, oklch(0.4 0.1 275 / 0.3) 0%, transparent 55%)",
          animationDelay: "4s",
        }}
      />
    </div>
  )
}

function Decorations() {
  return (
    <>
      <div className="fixed top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary opacity-60" />
      <div className="fixed top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-primary opacity-60" />
    </>
  )
}

function ResultFrame({
  title,
  children,
  className = "",
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`relative overflow-hidden px-5 py-5 ${className}`}
      style={{
        backgroundImage: "url('/omikuji/frames/img_frame.png')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      }}
    >
      <div className="relative z-10 space-y-3">
        <p className="text-xs text-primary tracking-widest font-medium">{title}</p>
        {children}
      </div>
    </section>
  )
}

const pageVariants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0.96, y: -8 },
}

function WelcomePage({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="relative flex-1 flex flex-col items-center justify-end overflow-hidden px-6 pb-16 pt-24"
      style={{
        backgroundImage: "url('/welcome-top.png')",
        backgroundPosition: "center top",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/10 to-background/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,oklch(0.08_0.02_285_/_0.22)_82%)]" />

      <div className="relative z-10 max-w-sm w-full text-center">
        <div className="pt-12">
          <button
            type="button"
            onClick={onStart}
            className="group block w-full transition-transform duration-300 hover:scale-[1.015] active:scale-[0.985]"
          >
            <img
              src="/draw-button.png"
              alt="おみくじを引く"
              className="w-full drop-shadow-[0_0_24px_rgba(214,158,46,0.48)] transition-[filter] duration-300 group-hover:drop-shadow-[0_0_34px_rgba(214,158,46,0.66)]"
            />
            <span className="sr-only">おみくじを引く</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function SelectPage({
  selectedBoxId,
  isLoading,
  onBoxChange,
  onSelect,
}: {
  selectedBoxId: number
  isLoading: boolean
  onBoxChange: (boxId: number) => void
  onSelect: (box: OmikujiBox) => void
}) {
  const selectedBox = omikujiBoxes.find((box) => box.id === selectedBoxId) ?? omikujiBoxes[0]

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="relative flex-1 flex flex-col items-center justify-center overflow-hidden px-4 py-10"
      style={{
        backgroundImage: "url('/select-bg.png')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-background/28" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/55" />

      <div className="relative z-10 max-w-md w-full space-y-7 text-center">
        <div className="space-y-2">
          <p className="text-xs text-primary tracking-[0.3em]">OMIKUJI BOX</p>
          <h2 className="font-serif text-3xl font-bold text-foreground">おみくじ箱を選ぶ</h2>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-16">
            <div className="w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center animate-pulse">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
            </div>
            <p className="text-foreground font-medium">大凶を授かっています...</p>
            <p className="text-sm text-muted-foreground">選ばれた箱から、今日の一枚を引いています</p>
          </div>
        ) : (
          <>
            <Carousel
              opts={{ align: "center", loop: true }}
              className="mx-auto w-full max-w-md overflow-hidden"
              setApi={(api) => {
                if (!api) return
                const updateSelected = () => onBoxChange(api.selectedScrollSnap() + 1)
                updateSelected()
                api.on("select", updateSelected)
              }}
            >
              <CarouselContent className="-ml-4">
                {omikujiBoxes.map((box) => (
                  <CarouselItem key={box.id} className="basis-[56%] pl-4">
                    <button
                      type="button"
                      onClick={() => onSelect(box)}
                      className="group relative block w-full overflow-hidden rounded-lg bg-transparent p-0 transition-all duration-300 active:scale-[0.98]"
                    >
                      <img
                        src={box.imageUrl}
                        alt={`${box.name}の画像`}
                        className="mx-auto aspect-square w-full object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 border-primary/50 bg-background/80 text-primary hover:bg-secondary" />
              <CarouselNext className="right-2 border-primary/50 bg-background/80 text-primary hover:bg-secondary" />
            </Carousel>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">選択中</p>
                <p className="font-serif text-xl text-primary">{selectedBox.name}</p>
              </div>

              <Button
                onClick={() => onSelect(selectedBox)}
                size="lg"
                className="h-16 w-full rounded-[0.625rem] bg-gradient-to-b from-gold via-primary to-gold-dark text-lg font-bold text-primary-foreground shadow-[0_0_24px_rgba(214,158,46,0.36)] hover:scale-[1.01] hover:shadow-[0_0_34px_rgba(214,158,46,0.55)] active:scale-[0.985]"
              >
                今日の運勢を占う
              </Button>

              <p className="text-xs text-muted-foreground">※どの箱を選んでも、良い結果は出ません</p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

function ResultPage({
  result,
  selectedBox,
  onRetry,
}: {
  result: DrawResult
  selectedBox: OmikujiBox | null
  onRetry: () => void
}) {
  const fortune = result.fortune
  const levelImageUrl = `/omikuji/frames/img_level${result.level}.png`

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col items-center py-7 overflow-y-auto"
    >
      <div className="w-full space-y-5">
        <div
          className="relative min-h-[360px] w-full overflow-hidden px-7 py-8"
          style={{
            backgroundImage: "url('/omikuji/frames/img_frame_kuji.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
          }}
        >
          <img
            src={fortune.imageUrl}
            alt={`${fortune.title}のおみくじ画像`}
            className="relative z-10 mx-auto aspect-square w-full max-w-[290px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.55)]"
          />
        </div>

        <div className="mx-auto w-full max-w-md space-y-5 px-4">
          <ResultFrame title="おみくじ説明">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="font-serif text-xl text-accent">大凶レベル{result.level}</p>
                <img src={levelImageUrl} alt={`大凶レベル${result.level}`} className="h-7 w-auto" />
              </div>
              <p className="text-foreground leading-relaxed">{fortune.description}</p>
            </div>
          </ResultFrame>

          <ResultFrame title="本日の想定負け金額">
            <div className="space-y-5">
              <div className="space-y-1">
                <p className="font-serif text-2xl text-accent">{yenFormatter.format(result.lossAmount)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-primary tracking-widest font-medium">この金額で買えたもの</p>
                <p className="font-serif text-2xl text-foreground">{result.purchaseItemName}</p>
              </div>
            </div>
          </ResultFrame>

          <ResultFrame title="お告げ">
            <p className="text-foreground leading-relaxed">{result.oracle}</p>
          </ResultFrame>

          <ResultFrame title="今日のラッキーアイテム">
            <p className="font-serif text-2xl text-foreground">{result.luckyItem}</p>
          </ResultFrame>

          <div className="space-y-4 pt-4">
            <Button
              onClick={onRetry}
              variant="outline"
              size="lg"
              className="w-full h-14 text-lg font-medium border-2 border-border hover:bg-secondary/50 rounded-lg"
            >
              別の箱を選ぶ
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 border-green-600/50 text-green-500 hover:bg-green-600/10 hover:text-green-400 rounded-lg"
                onClick={() => window.open(getLineShareUrl(result, selectedBox), "_blank")}
              >
                LINEで送る
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 border-sky-500/50 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300 rounded-lg"
                onClick={() => window.open(getTwitterShareUrl(result, selectedBox), "_blank")}
              >
                Xでシェア
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const [step, setStep] = useState<Step>("welcome")
  const [selectedBoxId, setSelectedBoxId] = useState(1)
  const [selectedBox, setSelectedBox] = useState<OmikujiBox | null>(null)
  const [currentResult, setCurrentResult] = useState<DrawResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleStart = () => {
    setStep("select")
  }

  const handleSelect = async (box: OmikujiBox) => {
    setSelectedBox(box)
    setCurrentResult(null)
    setIsLoading(true)

    const fallbackResult = drawResult(box)

    try {
      const aiMessages = await generateAiMessages(box, fallbackResult)
      setCurrentResult({
        ...fallbackResult,
        ...aiMessages,
      })
    } catch (error) {
      console.warn("Falling back to local omikuji messages:", error)
      setCurrentResult(fallbackResult)
    } finally {
      setIsLoading(false)
      setStep("result")
    }
  }

  const handleRetry = () => {
    setStep("select")
  }

  return (
    <main className="relative min-h-screen flex flex-col">
      <SmokeBackground />
      {step !== "result" && <Decorations />}

      <div className="relative z-10 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {step === "welcome" && <WelcomePage key="welcome" onStart={handleStart} />}
          {step === "select" && (
            <SelectPage
              key="select"
              selectedBoxId={selectedBoxId}
              isLoading={isLoading}
              onBoxChange={setSelectedBoxId}
              onSelect={handleSelect}
            />
          )}
          {step === "result" && currentResult && (
            <ResultPage
              key="result"
              result={currentResult}
              selectedBox={selectedBox}
              onRetry={handleRetry}
            />
          )}
        </AnimatePresence>
      </div>

    </main>
  )
}
