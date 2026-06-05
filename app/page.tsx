"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// ステップ型
type Step = "welcome" | "select" | "result"

// 結果データ型
interface FortuneResult {
  id: string
  name: string
  dangerWord: string
  oracle: string
  avoidanceAction: string
  imageUrl: string
}

// 3種類の結果データ
const fortuneResults: FortuneResult[] = [
  {
    id: "daikyo",
    name: "大凶",
    dangerWord: "少しだけ",
    oracle: "",
    avoidanceAction: "帰り道を一本変えて、パチンコ屋の前を通らない。",
    imageUrl: "/images/daikyo.jpg",
  },
  {
    id: "chokyo",
    name: "超凶",
    dangerWord: "給料日",
    oracle: "",
    avoidanceAction: "現金を持ち歩かず、必要な用事だけ済ませて帰る。",
    imageUrl: "/images/chokyo.jpg",
  },
  {
    id: "gokukyo",
    name: "極凶",
    dangerWord: "取り返す",
    oracle: "",
    avoidanceAction: "パチンコ屋に近づかず、まっすぐ帰る。",
    imageUrl: "/images/gokukyo.jpg",
  },
]

// フォールバックのお告げ
const FALLBACK_ORACLE = "今日は近づかない日。行かないだけで、今日の勝ちは守れます。"

// ランダムに結果を選択
function getRandomFortune(): FortuneResult {
  const index = Math.floor(Math.random() * fortuneResults.length)
  return fortuneResults[index]
}

// シェアURL生成
function getShareText(result: FortuneResult, oracle: string): string {
  return `【${result.name}】今日の危険ワード「${result.dangerWord}」\n\n${oracle}\n\n#大凶おみくじ #ギャンブル回避`
}

function getTwitterShareUrl(result: FortuneResult, oracle: string): string {
  const text = encodeURIComponent(getShareText(result, oracle))
  const url = encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")
  return `https://twitter.com/intent/tweet?text=${text}&url=${url}`
}

function getLineShareUrl(): string {
  const url = encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")
  return `https://social-plugins.line.me/lineit/share?url=${url}`
}

// 背景の煙エフェクトコンポーネント
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

// 装飾要素コンポーネント
function Decorations() {
  return (
    <>
      <div className="fixed top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary opacity-60" />
      <div className="fixed top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-primary opacity-60" />
      <div className="fixed bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-primary opacity-60" />
      <div className="fixed bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-primary opacity-60" />
    </>
  )
}

// ページ遷移アニメーション用wrapper
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

// 1. ようこそページ
function WelcomePage({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col items-center justify-center px-6 py-12"
    >
      <div className="max-w-sm w-full space-y-8 text-center">
        {/* 神社風の鳥居アイコン */}
        <div className="inline-block">
          <div className="relative">
            <div className="absolute -inset-4 bg-accent/20 rounded-full blur-xl" />
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
                <path
                  d="M10 35 L10 30 L90 30 L90 35 L80 35 L80 90 L70 90 L70 35 L30 35 L30 90 L20 90 L20 35 Z"
                  fill="currentColor"
                />
                <path d="M5 25 L95 25 L93 30 L7 30 Z" fill="currentColor" />
                <path d="M0 20 L100 20 L98 25 L2 25 Z" fill="currentColor" />
                <path d="M35 45 L65 45 L65 50 L35 50 Z" fill="currentColor" opacity="0.7" />
              </svg>
            </div>
          </div>
        </div>

        {/* タイトル */}
        <div className="space-y-3">
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wider text-foreground">
            賭内神社へようこそ
          </h1>
          <p className="text-lg text-foreground/90 leading-relaxed text-balance">
            今日だけ行かない理由を、
            <br />
            運勢のせいにしよう。
          </p>
        </div>

        {/* ヒーロー画像エリア */}
        <div className="relative aspect-[4/3] bg-secondary/30 rounded-xl overflow-hidden border border-border">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 mx-auto rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                <span className="font-serif text-4xl text-accent font-bold">凶</span>
              </div>
              <p className="text-sm text-muted-foreground">悪い結果しか出ない、<br />ギャンブル回避おみくじ</p>
            </div>
          </div>
        </div>

        {/* おみくじを引くボタン */}
        <div className="pt-4">
          <Button
            onClick={onStart}
            size="lg"
            className="w-full h-16 text-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg animate-pulse-glow transition-all duration-300 hover:scale-[1.02]"
          >
            おみくじを引く
          </Button>
        </div>

        {/* ラベル */}
        <div className="flex justify-center gap-3 text-xs text-muted-foreground">
          <span className="px-3 py-1 rounded-full bg-secondary/50 border border-border">1日1回</span>
          <span className="px-3 py-1 rounded-full bg-secondary/50 border border-border">完全無料</span>
          <span className="px-3 py-1 rounded-full bg-secondary/50 border border-border">ギャンブル回避</span>
        </div>
      </div>
    </motion.div>
  )
}

// 2. おみくじ選択ページ
function SelectPage({
  isLoading,
  onSelect,
}: {
  isLoading: boolean
  onSelect: () => void
}) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col items-center justify-center px-6 py-12"
    >
      <div className="max-w-sm w-full space-y-8 text-center">
        {/* タイトル */}
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-foreground">おみくじを選ぶ</h2>
          <p className="text-muted-foreground">箱をタップして、今日の運勢を引く</p>
        </div>

        {/* おみくじ箱 */}
        <div className="pt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center animate-pulse">
                <Loader2 className="w-10 h-10 text-accent animate-spin" />
              </div>
              <p className="text-foreground font-medium">お告げを授かっています...</p>
              <p className="text-sm text-muted-foreground">しばらくお待ちください</p>
            </div>
          ) : (
            <button
              onClick={onSelect}
              className="group relative w-full aspect-square max-w-[280px] mx-auto transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              {/* おみくじ箱のビジュアル */}
              <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-accent/5 rounded-2xl border-2 border-accent/40 shadow-xl group-hover:border-accent/60 group-hover:shadow-accent/20 transition-all duration-300">
                {/* 箱の装飾 */}
                <div className="absolute inset-4 border border-primary/30 rounded-xl" />
                <div className="absolute inset-8 border border-primary/20 rounded-lg" />

                {/* 中央のアイコン */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="w-20 h-20 mx-auto rounded-full bg-background/80 border-2 border-accent flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <span className="font-serif text-4xl text-accent font-bold">籤</span>
                    </div>
                    <p className="text-sm text-foreground/80 font-medium">タップして引く</p>
                  </div>
                </div>

                {/* 光のエフェクト */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          )}
        </div>

        {/* 注釈 */}
        {!isLoading && (
          <p className="text-xs text-muted-foreground">※どれを引いても、良い結果は出ません</p>
        )}
      </div>
    </motion.div>
  )
}

// 3. 結果ページ
function ResultPage({
  result,
  oracle,
  onRetry,
  onClose,
}: {
  result: FortuneResult
  oracle: string
  onRetry: () => void
  onClose: () => void
}) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col items-center px-4 py-8 overflow-y-auto"
    >
      <div className="max-w-md w-full space-y-6">
        {/* ヘッダー */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground tracking-widest">本日のギャンブル運</p>
          <h2 className="font-serif text-6xl font-bold text-accent tracking-wider">{result.name}</h2>
        </div>

        {/* 結果画像エリア */}
        <div className="relative aspect-video bg-secondary/50 rounded-xl overflow-hidden border-2 border-accent/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
                <span className="font-serif text-3xl text-accent">凶</span>
              </div>
              <p className="text-xs text-muted-foreground">※画像準備中</p>
            </div>
          </div>
        </div>

        {/* 危険ワード */}
        <div className="bg-accent/10 border-2 border-accent/40 rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-2">今日の危険ワード</p>
          <p className="font-serif text-3xl text-accent font-bold">「{result.dangerWord}」</p>
        </div>

        {/* お告げ */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <p className="text-xs text-primary tracking-widest font-medium">お告げ</p>
          <p className="text-foreground leading-relaxed text-lg">{oracle}</p>
        </div>

        {/* 回避行動 */}
        <div className="bg-secondary/50 rounded-xl p-5 border-l-4 border-primary">
          <p className="text-xs text-primary mb-2 font-medium">今日の回避行動</p>
          <p className="text-foreground leading-relaxed">{result.avoidanceAction}</p>
        </div>

        {/* アクションボタン */}
        <div className="space-y-4 pt-4">
          <Button
            onClick={onClose}
            size="lg"
            className="w-full h-16 text-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg animate-pulse-glow"
          >
            今日は行かない
          </Button>

          <Button
            onClick={onRetry}
            variant="outline"
            size="lg"
            className="w-full h-14 text-lg font-medium border-2 border-border hover:bg-secondary/50 rounded-xl"
          >
            もう一度引く
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-12 border-green-600/50 text-green-500 hover:bg-green-600/10 hover:text-green-400 rounded-xl"
              onClick={() => window.open(getLineShareUrl(), "_blank")}
            >
              LINEで送る
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-12 border-sky-500/50 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300 rounded-xl"
              onClick={() => window.open(getTwitterShareUrl(result, oracle), "_blank")}
            >
              Xでシェア
            </Button>
          </div>
        </div>

        {/* 注記 */}
        <p className="text-xs text-center text-muted-foreground pt-2">
          ※結果はあなたを守るために出ています。
        </p>
      </div>
    </motion.div>
  )
}

// メインページコンポーネント
export default function Home() {
  const [step, setStep] = useState<Step>("welcome")
  const [currentResult, setCurrentResult] = useState<FortuneResult | null>(null)
  const [oracle, setOracle] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleStart = () => {
    setStep("select")
  }

  const handleSelect = async () => {
    const result = getRandomFortune()
    setCurrentResult(result)
    setOracle("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/omikuji", { method: "POST" })
      if (!response.ok) {
        throw new Error("API request failed")
      }
      const data = await response.json()
      setOracle(data.text || FALLBACK_ORACLE)
    } catch (error) {
      console.error("Failed to fetch oracle:", error)
      setOracle(FALLBACK_ORACLE)
    } finally {
      setIsLoading(false)
      setStep("result")
    }
  }

  const handleRetry = () => {
    setStep("select")
  }

  const handleClose = () => {
    setStep("welcome")
  }

  return (
    <main className="relative min-h-screen flex flex-col">
      {/* 背景エフェクト */}
      <SmokeBackground />
      <Decorations />

      {/* メインコンテンツ */}
      <div className="relative z-10 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {step === "welcome" && <WelcomePage key="welcome" onStart={handleStart} />}
          {step === "select" && (
            <SelectPage key="select" isLoading={isLoading} onSelect={handleSelect} />
          )}
          {step === "result" && currentResult && (
            <ResultPage
              key="result"
              result={currentResult}
              oracle={oracle}
              onRetry={handleRetry}
              onClose={handleClose}
            />
          )}
        </AnimatePresence>
      </div>

      {/* フッター注意書き */}
      <footer className="relative z-10 py-6 px-4 text-center">
        <p className="text-xs text-muted-foreground/60 max-w-xs mx-auto leading-relaxed">
          ※これは医療サービスではありません。
          <br />
          「今日だけ行かないきっかけ作り」を目的としたセルフヘルプコンテンツです。
        </p>
      </footer>
    </main>
  )
}
