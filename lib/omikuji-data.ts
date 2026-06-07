export type FortuneLevel = 1 | 2 | 3 | 4

export type OmikujiBoxKey =
  | "pachi"
  | "slot"
  | "keiba"
  | "keirin"
  | "boatrace"
  | "fx"
  | "autorace"
  | "oripa"
  | "takarakuji"
  | "onlinecasino"
  | "mahjong"
  | "cranegame"

export interface OmikujiBox {
  id: number
  key: OmikujiBoxKey
  name: string
  shortName: string
  imageUrl: string
  baseLossAmount: number
}

export interface FortuneResult {
  id: number
  title: string
  description: string
  imageUrl: string
  level: FortuneLevel
}

export const omikujiBoxes: OmikujiBox[] = [
  { id: 1, key: "pachi", name: "パチンコおみくじ箱", shortName: "パチンコ", imageUrl: "/omikuji/boxes/1.png", baseLossAmount: 200000 },
  { id: 2, key: "slot", name: "スロットおみくじ箱", shortName: "スロット", imageUrl: "/omikuji/boxes/2.png", baseLossAmount: 200000 },
  { id: 3, key: "keiba", name: "競馬おみくじ箱", shortName: "競馬", imageUrl: "/omikuji/boxes/3.png", baseLossAmount: 300000 },
  { id: 4, key: "keirin", name: "競輪おみくじ箱", shortName: "競輪", imageUrl: "/omikuji/boxes/4.png", baseLossAmount: 300000 },
  { id: 5, key: "boatrace", name: "ボートレースおみくじ箱", shortName: "ボートレース", imageUrl: "/omikuji/boxes/5.png", baseLossAmount: 300000 },
  { id: 6, key: "fx", name: "FXおみくじ箱", shortName: "FX", imageUrl: "/omikuji/boxes/6.png", baseLossAmount: 1000000 },
  { id: 7, key: "autorace", name: "オートレースおみくじ箱", shortName: "オートレース", imageUrl: "/omikuji/boxes/7.png", baseLossAmount: 300000 },
  { id: 8, key: "oripa", name: "オリパおみくじ箱", shortName: "オリパ", imageUrl: "/omikuji/boxes/8.png", baseLossAmount: 500000 },
  { id: 9, key: "takarakuji", name: "宝くじおみくじ箱", shortName: "宝くじ", imageUrl: "/omikuji/boxes/9.png", baseLossAmount: 50000 },
  { id: 10, key: "onlinecasino", name: "オンラインカジノおみくじ箱", shortName: "オンラインカジノ", imageUrl: "/omikuji/boxes/10.png?v=2", baseLossAmount: 300000 },
  { id: 11, key: "mahjong", name: "麻雀おみくじ箱", shortName: "麻雀", imageUrl: "/omikuji/boxes/11.png?v=2", baseLossAmount: 50000 },
  { id: 12, key: "cranegame", name: "クレーンゲームおみくじ箱", shortName: "クレーンゲーム", imageUrl: "/omikuji/boxes/12.png", baseLossAmount: 10000 },
]

export const levelWeights: Record<FortuneLevel, number> = {
  1: 45,
  2: 35,
  3: 15,
  4: 5,
}

export const levelMultipliers: Record<FortuneLevel, number> = {
  1: 0.3,
  2: 0.5,
  3: 0.7,
  4: 1,
}

export const fortuneLevelGroups: Record<FortuneLevel, number[]> = {
  1: [2, 8, 9, 20, 21, 26, 27, 28, 29],
  2: [1, 7, 10, 11, 12, 17, 18, 22, 30, 31, 37],
  3: [4, 5, 6, 13, 14, 15, 16, 23, 34, 36, 38, 39, 41, 43],
  4: [3, 19, 24, 25, 32, 33, 35, 40, 42],
}

export const boxTextSeeds: Record<OmikujiBoxKey, { dangerKeywords: string[]; oracleHints: string[]; luckyItems: string[] }> = {
  pachi: {
    dangerKeywords: ["新台初日", "激アツ演出", "あと千円だけ"],
    oracleHints: ["光と音が強い日ほど、財布は静かな場所を求めています。", "当たりそうという感覚は、今日は大凶の変装です。"],
    luckyItems: ["耳栓", "小銭を入れない財布", "寄り道しない靴"],
  },
  slot: {
    dangerKeywords: ["天井目前", "高設定っぽい", "ゾーン狙い"],
    oracleHints: ["数字の並びに意味を見つけすぎると、大凶が席を温めます。", "今日は回転数より帰宅時間を数える日です。"],
    luckyItems: ["腕時計", "温かいお茶", "帰宅ルートのメモ"],
  },
  keiba: {
    dangerKeywords: ["鉄板レース", "穴狙い", "取り返しの最終"],
    oracleHints: ["走るのは馬、減るのはあなたの残高です。", "最後の直線より、家へ帰る直線を信じましょう。"],
    luckyItems: ["散歩用の靴", "買わない予想メモ", "折りたたみ傘"],
  },
  keirin: {
    dangerKeywords: ["ライン読み", "固い決着", "一発逆転"],
    oracleHints: ["風を読む前に、自分の財布の悲鳴を読みましょう。", "今日は脚ではなく、距離を置く判断力が勝ち筋です。"],
    luckyItems: ["水筒", "早めの夕食", "予定表"],
  },
  boatrace: {
    dangerKeywords: ["イン逃げ", "展示タイム", "万舟狙い"],
    oracleHints: ["水面が荒れる日は、心の波も高くなります。", "今日の舟券は、買う前から大凶の港に着いています。"],
    luckyItems: ["タオル", "深呼吸", "未開封の封筒"],
  },
  fx: {
    dangerKeywords: ["全力ロング", "ナンピン", "雇用統計前"],
    oracleHints: ["チャートの上下に心まで連れていかれないでください。", "今日の最強ポジションはノーポジです。"],
    luckyItems: ["通知オフ", "白い紙", "温かいスープ"],
  },
  autorace: {
    dangerKeywords: ["試走一番時計", "本命崩し", "雨走路"],
    oracleHints: ["エンジン音が大きいほど、冷静さは小さくなりがちです。", "今日の勝負は発走前に離れることで終わります。"],
    luckyItems: ["イヤホンケース", "帰りの時刻表", "ミントタブレット"],
  },
  oripa: {
    dangerKeywords: ["ラストワン", "高還元", "神引き報告"],
    oracleHints: ["誰かの神引きは、あなたの保証ではありません。", "封を開ける前の期待こそ、大凶が一番好きな時間です。"],
    luckyItems: ["未開封のままの箱", "家計簿アプリ", "透明なクリアファイル"],
  },
  takarakuji: {
    dangerKeywords: ["当たれば人生逆転", "連番追加", "夢を買う"],
    oracleHints: ["夢は買わなくても育ちます。今日は現金を手元に残す日です。", "大きな当たりより、小さな支出停止が味方です。"],
    luckyItems: ["貯金箱", "赤ペン", "レシート入れ"],
  },
  onlinecasino: {
    dangerKeywords: ["ボーナス消化", "倍プッシュ", "今だけ還元"],
    oracleHints: ["画面の向こうの誘惑は、閉じるボタンで急に弱くなります。", "今日はログインしないだけで、かなり勝っています。"],
    luckyItems: ["ブラウザの閉じるボタン", "充電器", "本棚の一冊"],
  },
  mahjong: {
    dangerKeywords: ["ラス回避", "もう半荘", "流れが来てる"],
    oracleHints: ["流れが来ていると思った時ほど、席を立つ力が試されています。", "今日は配牌より予定を整える日です。"],
    luckyItems: ["目薬", "早寝のアラーム", "白いハンカチ"],
  },
  cranegame: {
    dangerKeywords: ["あと一手", "橋渡し", "店員アシスト"],
    oracleHints: ["惜しい位置ほど、追加投入の罠が深くなります。", "景品より、使わなかった千円の方が今日は輝きます。"],
    luckyItems: ["空のエコバッグ", "百円玉を作らない財布", "深呼吸"],
  },
}

const rawFortuneResults: Omit<FortuneResult, "level">[] = [
  {
    id: 1,
    title: "押し寄せる大凶",
    description:
      "大凶の波が怒涛のように押し寄せる一日。次から次へと不運が押し寄せ、冷静な判断を奪っていく。そんな時に限って「一発逆転」という言葉が甘く聞こえるものだ。しかし、それは大凶の罠である。その波に飲まれてはならない。",
    imageUrl: "/omikuji/fortunes/1.png",
  },
  {
    id: 2,
    title: "大凶",
    description:
      "運勢がこの上なく悪い状態。説明不要の大凶である。本日は何をやっても裏目に出やすい。無理な勝負は避け、静かに過ごすのが賢明だ。ギャンブルなど論外である。",
    imageUrl: "/omikuji/fortunes/2.png",
  },
  {
    id: 3,
    title: "大凶の極み",
    description:
      "量、質ともに極まった大凶。この状態では何をやっても勝てない。勝負運は底を突き抜け、地中深くへと沈んでいる。今日は耐える日である。",
    imageUrl: "/omikuji/fortunes/3.png",
  },
  {
    id: 4,
    title: "天下分け目の大凶",
    description:
      "歴史的な転換点に現れるとされる大凶。その姿は常に敗者の歴史の側にあった。もしこの大凶を見かけたなら、勝負事には近づいてはならない。大凶は敗北の物語を好むのだ。",
    imageUrl: "/omikuji/fortunes/4.png",
  },
  {
    id: 5,
    title: "大凶のとっかえひっかえ",
    description:
      "あらゆる種類の大凶が次々と現れる状態。まさに大凶のエンペラータイムである。どこへ逃げても大凶が待っている。今日は選択肢を増やすほど危険である。",
    imageUrl: "/omikuji/fortunes/5.png",
  },
  {
    id: 6,
    title: "大凶SSR",
    description:
      "眩い光と共に現れる極めて希少な大凶。一見すると幸運に見えるが、それこそが恐ろしい。派手な演出の裏で運気は深刻な状態にある。見た目に騙されてはならない。",
    imageUrl: "/omikuji/fortunes/6.png",
  },
  {
    id: 7,
    title: "大凶のフルオーケストラ",
    description:
      "無数の大凶たちが美しいハーモニーを奏でている。その力強くも繊細な調べは感情を昂らせ、無茶なギャンブルへと誘ってくる。しかし、その誘いに乗ってはならない。演奏が終わる頃には財布も静まり返っているだろう。",
    imageUrl: "/omikuji/fortunes/7.png",
  },
  {
    id: 8,
    title: "両肩に大凶",
    description:
      "右肩にも左肩にも大凶が座っている状態。常に耳元で囁き続け、「今日は勝てる」と甘い言葉を投げかけてくる。しかし、その言葉に耳を貸してはならない。",
    imageUrl: "/omikuji/fortunes/8.png",
  },
  {
    id: 9,
    title: "大凶の三密",
    description:
      "大凶・大凶・大凶。密です。大凶超接近状態である。この状態で勝負を挑むのは、嵐の中で紙飛行機を飛ばすようなもの。結果は最初から決まっている。",
    imageUrl: "/omikuji/fortunes/9.png",
  },
  {
    id: 10,
    title: "阿鼻凶喚",
    description:
      "地獄の底から無数の大凶たちが叫んでいる状態。その声は遠くから聞こえるようでいて、気付けばすぐ隣にいる。油断してはならない。大凶はすでにあなたの心の隙間を見つけている。",
    imageUrl: "/omikuji/fortunes/10.png",
  },
  {
    id: 11,
    title: "凶悦至極",
    description:
      "大凶なのになぜか嬉しくなってしまう状態。危険である。すでにギャンブルの悪魔に心を掴まれているかもしれない。一度立ち止まり、冷静さを取り戻さなければならない。",
    imageUrl: "/omikuji/fortunes/11.png",
  },
  {
    id: 12,
    title: "凶味津々",
    description:
      "甘い声でギャンブルに誘おうとしてくる大凶。気になる。興味も湧く。しかし近づいてはならない。好奇心は時として運気よりも先に財布を失わせる。",
    imageUrl: "/omikuji/fortunes/12.png",
  },
  {
    id: 13,
    title: "凶天動地",
    description:
      "天地を揺るがすほどの大凶。その災いはあなただけでなく、あなたの大切な人々にも及ぶ。ギャンブルによる損失は決して自分一人で完結しないことを忘れてはならない。",
    imageUrl: "/omikuji/fortunes/13.png",
  },
  {
    id: 14,
    title: "凶存凶栄",
    description:
      "すでに大凶と共に歩み始めている状態。あるいは、これから歩もうとしている状態。まだ引き返せる。今なら間に合う。大凶と共に栄える未来など存在しないのだから。",
    imageUrl: "/omikuji/fortunes/14.png",
  },
  {
    id: 15,
    title: "凶喜乱舞",
    description:
      "先日の大敗の余韻も冷めやらぬ中、その負のエネルギーを糧に大凶が踊り狂っている。その舞は人を苛立たせ、「取り返したい」という危険な感情を呼び起こす。しかし、その感情こそが大凶の狙いである。",
    imageUrl: "/omikuji/fortunes/15.png",
  },
  {
    id: 16,
    title: "凶行突破",
    description:
      "すでに何も失うものがないと思い込んだ者の前に現れる大凶。その大凶に取り憑かれた者は、並大抵の精神力では引き返すことができない。しかし本当に失うものがない人間など存在しない。一度立ち止まり、自分の大切なものを思い出さなければならない。",
    imageUrl: "/omikuji/fortunes/16.png",
  },
  {
    id: 17,
    title: "草も生えない凶",
    description:
      "冗談抜きで笑えない大凶。平然と確率を踏み越え、この世の理すら捻じ曲げてくる。その不運の前では「まさか」が日常になる。今日は勝負そのものを避けるべき日である。",
    imageUrl: "/omikuji/fortunes/17.png",
  },
  {
    id: 18,
    title: "犬も食わない凶",
    description:
      "誰からも相手にされなくなった大凶。しかし侮ってはならない。相手にされないのではない。その負の力が強大すぎて、誰も近寄れないだけなのだ。",
    imageUrl: "/omikuji/fortunes/18.png",
  },
  {
    id: 19,
    title: "＼(^o^)／凶",
    description:
      "この大凶に出会ったなら、勝ち負けの概念は捨てるべきである。これは敗北ではない。終焉である。終わりを始めないためには、最初からギャンブルに近づかないことだ。",
    imageUrl: "/omikuji/fortunes/19.png",
  },
  {
    id: 20,
    title: "激おこぷんぷん凶",
    description:
      "大凶が本気で怒っている状態。通常の三倍の不運を引き寄せると言われている。その怒りの矛先に自ら飛び込む必要はない。今日は静かにやり過ごすべきだ。",
    imageUrl: "/omikuji/fortunes/20.png",
  },
  {
    id: 21,
    title: "突如とした大凶",
    description:
      "その大凶は前触れなく現れる。冷静な判断を鈍らせ、一瞬の隙を突いてギャンブルへ誘おうとしてくる。しかし現れると分かっていれば恐れる必要はない。警戒こそ最大の防御である。",
    imageUrl: "/omikuji/fortunes/21.png",
  },
  {
    id: 22,
    title: "大凶過多",
    description:
      "人が一日に浴びられる大凶の許容量を超えた状態。余った大凶は翌日へ持ち越される。放置しても解決しない。連鎖を断ち切るにはギャンブルから距離を置くしかない。",
    imageUrl: "/omikuji/fortunes/22.png",
  },
  {
    id: 23,
    title: "大凶の過剰摂取",
    description:
      "連日の大凶によって完全に許容量を超えてしまった状態。勝負運どころか、日常の選択まで裏目に出始める。助かる方法は一つ。これ以上大凶を呼び込む行動をやめることである。",
    imageUrl: "/omikuji/fortunes/23.png",
  },
  {
    id: 24,
    title: "大凶中毒",
    description:
      "勝てもしないギャンブルを続けてしまった状態。負けても驚かず、「やっぱりな」と呟くようになっている。それは慣れではない。危険信号である。今ならまだやり直せる。",
    imageUrl: "/omikuji/fortunes/24.png",
  },
  {
    id: 25,
    title: "初代大凶",
    description:
      "人々が「大凶」と呼ぶようになる遥か以前から存在していた始祖たる大凶。その力は世界に根付き、この世の理の一部となっている。しかし恐れることはない。大凶は人の選択によって封じることができるのだ。",
    imageUrl: "/omikuji/fortunes/25.png",
  },
  {
    id: 26,
    title: "目、鼻、口、凶！",
    description:
      "あらゆる隙間から入り込もうとする大凶。その執念は凄まじく、気付けば思考の中にまで侵入してくる。一度受け入れてしまえば追い出すのは容易ではない。警戒を怠ってはならない。",
    imageUrl: "/omikuji/fortunes/26.png",
  },
  {
    id: 27,
    title: "大凶が主張してくる",
    description:
      "自らの存在を積極的に主張してくる大凶。朝から晩まで囁き続け、「今日は勝てる」と言い続ける。しかしその声に従った先にあるのは後悔だけである。",
    imageUrl: "/omikuji/fortunes/27.png",
  },
  {
    id: 28,
    title: "4年に一度の大凶",
    description:
      "周期的に現れる希少な大凶。その珍しさに心を奪われてはならない。レアだからといって安全なわけではない。結局のところ、大凶は大凶なのである。",
    imageUrl: "/omikuji/fortunes/28.png",
  },
  {
    id: 29,
    title: "負けられない大凶がある",
    description:
      "4年に一度の大凶と共に現れることが多い特殊な大凶。滅多に現れないからこそ必死に誘惑してくる。その誘いに打ち勝つには日頃から心の準備をしておかなければならない。",
    imageUrl: "/omikuji/fortunes/29.png",
  },
  {
    id: 30,
    title: "興奮の大凶",
    description:
      "大凶が異様なほど興奮している状態。何に興奮しているのかは誰にも分からない。ただ一つ確かなのは、その興奮が私たちにとって良い知らせではないということだ。",
    imageUrl: "/omikuji/fortunes/30.png",
  },
  {
    id: 31,
    title: "大凶爆弾",
    description:
      "触れると爆発する大凶。爆発の規模は運気に比例する。危険だと分かっているなら近づかなければいい。それだけの話である。",
    imageUrl: "/omikuji/fortunes/31.png",
  },
  {
    id: 32,
    title: "原初の大凶",
    description:
      "世界が始まる以前から存在していたと言われる大凶。この世の理そのものと呼ぶ者もいる。しかし諦める必要はない。大凶は選択によって回避できる存在でもあるのだ。",
    imageUrl: "/omikuji/fortunes/32.png",
  },
  {
    id: 33,
    title: "大凶による支配",
    description:
      "大凶によって自我が侵食され、正常な判断力を失った状態。勝てる根拠もないのに勝てる気がしてしまう。それは自信ではない。支配である。",
    imageUrl: "/omikuji/fortunes/33.png",
  },
  {
    id: 34,
    title: "大凶絶好調",
    description:
      "テンション絶好調の大凶。通常の五倍の運気低下効果を持つとされる。つまり今日は何をやっても勝負事に向かない。無理に抗う必要はない。",
    imageUrl: "/omikuji/fortunes/34.png",
  },
  {
    id: 35,
    title: "大凶大魔王",
    description:
      "大凶界の頂点に君臨する存在。あらゆる大凶を従え、その負のエネルギーを糧としている。人々がギャンブルで失った希望や後悔こそが、大魔王の力の源泉なのである。",
    imageUrl: "/omikuji/fortunes/35.png",
  },
  {
    id: 36,
    title: "大凶一筋",
    description:
      "気付けば長年付きまとっている大凶。それはまるで腐れ縁のように人生へ居座り続ける。しかし縁は切れる。切る意思さえあれば。",
    imageUrl: "/omikuji/fortunes/36.png",
  },
  {
    id: 37,
    title: "大凶からのモテ期",
    description:
      "異性にモテるのではない。大凶から異常なほど好かれている状態である。大凶が次から次へと寄ってくる。つまり運気は最低レベルにある。",
    imageUrl: "/omikuji/fortunes/37.png",
  },
  {
    id: 38,
    title: "大凶螺旋丸",
    description:
      "大凶が風遁チャクラを取り込み、螺旋状に回転している状態。触れた者の運気を根こそぎ削り取る。その威力は絶大であり、まともな勝負が成立する余地すら残さない。",
    imageUrl: "/omikuji/fortunes/38.png",
  },
  {
    id: 39,
    title: "大凶玉",
    description:
      "この世の不幸を少しずつ集め、一つの巨大な球体となった大凶。その内部には無数の後悔と絶望が詰め込まれている。ゆっくり近づいてくるからといって油断してはならない。",
    imageUrl: "/omikuji/fortunes/39.png",
  },
  {
    id: 40,
    title: "無限大凶月詠",
    description:
      "強力な幻術を操る大凶。「今度こそ勝てる」という幻想を見せ、ギャンブルへ誘い込む。その目を見てはいけない。見た瞬間から術は始まっているのだから。",
    imageUrl: "/omikuji/fortunes/40.png",
  },
  {
    id: 41,
    title: "口寄せ『大凶』",
    description:
      "自分の意思で呼ぶのではない。気付けば勝手に呼び寄せてしまっているのだ。その大凶は一度現れると簡単には帰ってくれない。",
    imageUrl: "/omikuji/fortunes/41.png",
  },
  {
    id: 42,
    title: "転生したら大凶だった件",
    description:
      "新しい人生を歩もうとした者の前に現れる大凶。過去を清算したつもりでも油断した瞬間に現れる。しかし過去に負ける必要はない。再出発は何度でもできる。",
    imageUrl: "/omikuji/fortunes/42.png",
  },
  {
    id: 43,
    title: "大凶の瞬間最大風速",
    description:
      "瞬間的な不運の出力だけなら歴代最高クラス。その暴風は一瞬で周囲を荒野と化し、何も残さない。最初から近づかない。それこそが唯一にして最善の対策である。",
    imageUrl: "/omikuji/fortunes/43.png",
  },
]

const fortuneLevelById = Object.entries(fortuneLevelGroups).reduce<Record<number, FortuneLevel>>(
  (levels, [level, ids]) => {
    ids.forEach((id) => {
      levels[id] = Number(level) as FortuneLevel
    })
    return levels
  },
  {},
)

export const fortuneResults: FortuneResult[] = rawFortuneResults.map((fortune) => ({
  ...fortune,
  level: fortuneLevelById[fortune.id] ?? 1,
}))
