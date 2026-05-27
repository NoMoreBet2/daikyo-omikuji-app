"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

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
    oracle: "今日は"少しだけ"が一番危険。近づかないだけで、今日はもう勝ちです。",
    avoidanceAction: "帰り道を一本変えて、パチンコ屋の前を通らない。",
    imageUrl: "/images/daikyo.jpg",
  },
  {
    id: "chokyo",
    name: "超凶",
    dangerWord: "給料日",
    oracle: "財布に余裕がある日ほど危険。今日は使わない選択が吉です。",
    avoidanceAction: "現金を持ち歩かず、必要な用事だけ済ませて帰る。",
    imageUrl: "/images/chokyo.jpg",
  },
  {
    id: "gokukyo",
    name: "極凶",
    dangerWord: "取り返す",
    oracle: "今日は"取り返す"という言葉が出た時点で警戒日。深追いは財布も心も削ります。",
    avoidanceAction: "パチンコ屋に近づかず、まっすぐ帰る。",
    imageUrl: "/images/gokukyo.jpg",
  },
]

// ランダムに結果を選択
function getRandomFortune(): FortuneResult {
  const index = Math.floor(Math.random() * fortuneResults.length)
  return fortuneResults[index]
}

// シェアURL生成
function getShareText(result: FortuneResult): string {
  return `【${result.name}】今日の危険ワード「${result.dangerWord}」\n\n${result.oracle}\n\n#大凶おみくじ #ギャンブル回避`
}

function getTwitterShareUrl(result: FortuneResult): string {
  const text = encodeURIComponent(getShareText(result))
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
      {/* 紫の煙 - 複数のレイヤー */}
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
      {/* 金色の角装飾 */}
      <div className="fixed top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary opacity-60" />
      <div className="fixed top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-primary opacity-60" />
      <div className="fixed bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-primary opacity-60" />
      <div className="fixed bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-primary opacity-60" />
    </>
  )
}

// 結果モーダルコンポーネント
function ResultModal({
  result,
  onClose,
}: {
  result: FortuneResult
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md mx-4 mb-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="relative bg-card rounded-2xl border-2 border-primary/50 overflow-hidden">
          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>

          {/* カード内容 */}
          <div className="p-6 space-y-5">
            {/* ヘッダー */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground tracking-widest mb-2">本日のギャンブル運</p>
              <h2 className="font-serif text-5xl font-bold text-accent tracking-wider">{result.name}</h2>
            </div>

            {/* 画像エリア */}
            <div className="relative aspect-video bg-secondary/50 rounded-lg overflow-hidden border border-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="font-serif text-2xl text-accent">凶</span>
                  </div>
                  <p className="text-xs text-muted-foreground">※画像準備中</p>
                </div>
              </div>
              {/* 実際の画像がある場合 */}
              {/* <Image src={result.imageUrl} alt={result.name} fill className="object-cover" /> */}
            </div>

            {/* 危険ワード */}
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">今日の危険ワード</p>
              <p className="font-serif text-2xl text-accent font-bold">「{result.dangerWord}」</p>
            </div>

            {/* お告げ */}
            <div className="space-y-2">
              <p className="text-xs text-primary tracking-widest">お告げ</p>
              <p className="text-foreground leading-relaxed">{result.oracle}</p>
            </div>

            {/* 回避行動 */}
            <div className="bg-secondary/50 rounded-lg p-4 border-l-4 border-primary">
              <p className="text-xs text-primary mb-2">今日の回避行動</p>
              <p className="text-foreground leading-relaxed">{result.avoidanceAction}</p>
            </div>

            {/* アクションボタン */}
            <div className="space-y-3 pt-2">
              <Button
                onClick={onClose}
                className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow"
              >
                今日は行かない
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12 border-green-600/50 text-green-500 hover:bg-green-600/10 hover:text-green-400"
                  onClick={() => window.open(getLineShareUrl(), "_blank")}
                >
                  LINEで送る
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-12 border-sky-500/50 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300"
                  onClick={() => window.open(getTwitterShareUrl(result), "_blank")}
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
        </div>
      </motion.div>
    </motion.div>
  )
}

// メインページコンポーネント
export default function Home() {
  const [showResult, setShowResult] = useState(false)
  const [currentResult, setCurrentResult] = useState<FortuneResult | null>(null)

  const handleDrawFortune = () => {
    const result = getRandomFortune()
    setCurrentResult(result)
    setShowResult(true)
  }

  const handleCloseResult = () => {
    setShowResult(false)
  }

  return (
    <main className="relative min-h-screen flex flex-col">
      {/* 背景エフェクト */}
      <SmokeBackground />
      <Decorations />

      {/* メインコンテンツ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-sm w-full space-y-8 text-center">
          {/* タイトルセクション */}
          <div className="space-y-4">
            {/* 赤い警告印風の装飾 */}
            <div className="inline-block">
              <div className="relative">
                <div className="absolute -inset-3 bg-accent/20 rounded-full blur-xl" />
                <div className="relative w-20 h-20 mx-auto rounded-full border-4 border-accent flex items-center justify-center">
                  <span className="font-serif text-3xl text-accent font-bold">凶</span>
                </div>
              </div>
            </div>

            {/* タイトル */}
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-wider">
              <span className="text-primary">大凶</span>
              <span className="text-foreground">おみくじ</span>
            </h1>

            {/* キャッチコピー */}
            <p className="text-lg text-foreground/90 leading-relaxed text-balance">
              今日だけ行かない理由を、
              <br />
              運勢のせいにしよう。
            </p>
          </div>

          {/* 説明文 */}
          <p className="text-muted-foreground text-sm leading-relaxed">
            悪い結果しか出ない、
            <br />
            ギャンブル回避おみくじ。
          </p>

          {/* おみくじを引くボタン */}
          <div className="pt-4">
            <Button
              onClick={handleDrawFortune}
              size="lg"
              className="w-full h-16 text-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg animate-pulse-glow transition-all duration-300 hover:scale-[1.02]"
            >
              おみくじを引く
            </Button>
          </div>

          {/* ラベル */}
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <span className="px-3 py-1 rounded-full bg-secondary/50 border border-border">
              1日1回
            </span>
            <span className="px-3 py-1 rounded-full bg-secondary/50 border border-border">
              完全無料
            </span>
            <span className="px-3 py-1 rounded-full bg-secondary/50 border border-border">
              ギャンブル回避
            </span>
          </div>
        </div>
      </div>

      {/* フッター注意書き */}
      <footer className="relative z-10 py-6 px-4 text-center">
        <p className="text-xs text-muted-foreground/60 max-w-xs mx-auto leading-relaxed">
          ※これは医療サービスではありません。
          <br />
          「今日だけ行かないきっかけ作り」を目的としたセルフヘルプコンテンツです。
        </p>
      </footer>

      {/* 結果モーダル */}
      <AnimatePresence>
        {showResult && currentResult && (
          <ResultModal result={currentResult} onClose={handleCloseResult} />
        )}
      </AnimatePresence>
    </main>
  )
}
