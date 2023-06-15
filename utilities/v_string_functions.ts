/* eslint-disable array-element-newline */

/* 文字列処理全般の関数群 */

// 平仮名／片仮名の、開始／終了の、文字コードの値
export const CHAR_CODE_HIRAGANA_BEGIN = 0x3041   // 12353
export const CHAR_CODE_HIRAGANA_END   = 0x3096   // 12438
export const CHAR_CODE_KATAKANA_BEGIN = 0x30a1   // 12449
export const CHAR_CODE_KATAKANA_END   = 0x30fa   // 12538

// 改行コード（\を使えない処理系のために使用）
export const CR   = String.fromCharCode(13)      // 古いMac OS
export const LF   = String.fromCharCode(10)      // Unix系OS, Mac OS（全てこれに統一する）
export const CRLF = String.fromCharCode(13, 10)  // Windows系OS

// 置換用の正規表現オブジェクト
export const regExpCR   = new RegExp(CR, 'g')
export const regExpLF   = new RegExp(LF, 'g')
export const regExpCRLF = new RegExp(CRLF, 'g')

// 平仮名 全86文字
export const HIRAGANA = [
  'ぁ', 'あ', 'ぃ', 'い', 'ぅ', 'う', 'ぇ', 'え', 'ぉ', 'お',
  'か', 'が', 'き', 'ぎ', 'く', 'ぐ', 'け', 'げ', 'こ', 'ご',
  'さ', 'ざ', 'し', 'じ', 'す', 'ず', 'せ', 'ぜ', 'そ', 'ぞ',
  'た', 'だ', 'ち', 'ぢ', 'っ', 'つ', 'づ', 'て', 'で', 'と', 'ど',
  'な', 'に', 'ぬ', 'ね', 'の',
  'は', 'ば', 'ぱ', 'ひ', 'び', 'ぴ', 'ふ', 'ぶ', 'ぷ', 'へ', 'べ', 'ぺ', 'ほ', 'ぼ', 'ぽ',
  'ま', 'み', 'む', 'め', 'も',
  'ゃ', 'や', 'ゅ', 'ゆ', 'ょ', 'よ',
  'ら', 'り', 'る', 'れ', 'ろ',
  'ゎ', 'わ', 'ゐ', 'ゑ', 'を', 'ん',
  'ゔ', 'ゕ', 'ゖ',
]

// 片仮名 全90文字
export const KATAKANA = [
  'ァ', 'ア', 'ィ', 'イ', 'ゥ', 'ウ', 'ェ', 'エ', 'ォ', 'オ',
  'カ', 'ガ', 'キ', 'ギ', 'ク', 'グ', 'ケ', 'ゲ', 'コ', 'ゴ',
  'サ', 'ザ', 'シ', 'ジ', 'ス', 'ズ', 'セ', 'ゼ', 'ソ', 'ゾ',
  'タ', 'ダ', 'チ', 'ヂ', 'ッ', 'ツ', 'ヅ', 'テ', 'デ', 'ト', 'ド',
  'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
  'ハ', 'バ', 'パ', 'ヒ', 'ビ', 'ピ', 'フ', 'ブ', 'プ', 'ヘ', 'ベ', 'ペ', 'ホ', 'ボ', 'ポ',
  'マ', 'ミ', 'ム', 'メ', 'モ',
  'ャ', 'ヤ', 'ュ', 'ユ', 'ョ', 'ヨ',
  'ラ', 'リ', 'ル', 'レ', 'ロ',
  'ヮ', 'ワ', 'ヰ', 'ヱ', 'ヲ', 'ン',
  'ヴ', 'ヵ', 'ヶ',
  'ヷ', 'ヸ', 'ヹ', 'ヺ',
]

export const HANKAKU_KATAKANA = [
  'ｦ',
  'ｧ', 'ｨ', 'ｩ', 'ｪ', 'ｫ',
  'ｬ', 'ｭ', 'ｮ', 'ｯ', 'ｰ',
  'ｱ', 'ｲ', 'ｳ', 'ｴ', 'ｵ',
  'ｶ', 'ｷ', 'ｸ', 'ｹ', 'ｺ',
  'ｻ', 'ｼ', 'ｽ', 'ｾ', 'ｿ',
  'ﾀ', 'ﾁ', 'ﾂ', 'ﾃ', 'ﾄ',
  'ﾅ', 'ﾆ', 'ﾇ', 'ﾈ', 'ﾉ',
  'ﾊ', 'ﾋ', 'ﾌ', 'ﾍ', 'ﾎ',
  'ﾏ', 'ﾐ', 'ﾑ', 'ﾒ', 'ﾓ',
  'ﾔ', 'ﾕ', 'ﾖ',
  'ﾗ', 'ﾘ', 'ﾙ', 'ﾚ', 'ﾛ',
  'ﾜ', 'ﾝ',
]

// アルファベット(小文字)
export const ALPHABETS = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g',
  'h', 'i', 'j', 'k', 'l', 'm', 'n',
  'o', 'p', 'q', 'r', 's', 't', 'u',
  'v', 'w', 'x', 'y', 'z',
]

// 数字('0' ~ '9')
export const NUMERICS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
]

/**
 * 引数の文字が、平仮名であるかどうか
*/
export const isHiragana = (char: string) => {
  const code = char.charCodeAt(0)
  return (CHAR_CODE_HIRAGANA_BEGIN <= code && code <= CHAR_CODE_HIRAGANA_END)
}

/**
 * 引数の文字が、片仮名であるかどうか
*/
export const isKatakana = (char: string) => {
  const code = char.charCodeAt(0)
  return (CHAR_CODE_KATAKANA_BEGIN <= code && code <= CHAR_CODE_KATAKANA_END)
}

/**
 * 引数の文字列が、アルファベットであるかどうか
*/
export const isAlphabet = (data: string) => {
  return !!(typeof(data) === 'string' && data.match(/^[a-zA-Zａ-ｚＡ-Ｚ]+$/))
}

/**
 * 引数の文字列が、数字(数値)であるかどうか
*/
export const isNumeric = (data: string) => {
  return !!(typeof(data) === 'number' || data.match(/^[0-9０-９]+$/))
}

/**
 * 引数の文字列が、空白文字のみであるかどうか
*/
export const isOnlyBlank = (str: string) => {
  const exp = str.match(/\s+/)
  return !!(exp && exp[0].length === str.length)
}

/**
 * snake_case -> lowerCamelCase
*/
export const snake2lowerCamel = (str: string) => (
  str.replace(/_./g, m => m.charAt(1).toUpperCase())
)

/**
 * snake_case -> UpperCamelCase
*/
export const snake2UpperCamel = (str: string) => (
  str.replace(/^.|_./g, m => m.slice(-1).toUpperCase())
)

/**
 * CamelCase -> snake_case
*/
export const camel2snake = (str: string) => (
  str
    .replace(/^[A-Z]/, m => m.toLowerCase())
    .replace(/[A-Z]/g, m => '_' + m.toLowerCase())
)

/**
 * 全角英数字 -> 半角英数字
*/
export const zenkaku2hankaku = (str: string) => (
  str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, m =>
    String.fromCharCode(m.charCodeAt(0) - 0xFEE0)
  )
)

/**
 * 半角英数字 -> 全角英数字
*/
export const hankaku2zenkaku = (str: string) => (
  str.replace(/[A-Za-z0-9]/g, m =>
    String.fromCharCode(m.charCodeAt(0) + 0xFEE0)
  )
)

/**
 * 全角ひらがな -> 全角カタカナ
*/
export const hira2kata = (str: string) => (
  str.replace(/[\u3041-\u3096]/g, m =>
    String.fromCharCode(m.charCodeAt(0) + 0x60)
  )
)

/**
 * 全角カタカナ -> 全角ひらがな
*/
export const kata2hira = (str: string) => (
  str.replace(/[\u30a1-\u30f6]/g, m =>
    String.fromCharCode(m.charCodeAt(0) - 0x60)
  )
)

/**
 * 全角カタカナ -> 半角ｶﾀｶﾅ
*/
export const zenkana2hankana = (str: string) => {
  const kanaMap = {
    'ガ': 'ｶﾞ', 'ギ': 'ｷﾞ', 'グ': 'ｸﾞ', 'ゲ': 'ｹﾞ', 'ゴ': 'ｺﾞ',
    'ザ': 'ｻﾞ', 'ジ': 'ｼﾞ', 'ズ': 'ｽﾞ', 'ゼ': 'ｾﾞ', 'ゾ': 'ｿﾞ',
    'ダ': 'ﾀﾞ', 'ヂ': 'ﾁﾞ', 'ヅ': 'ﾂﾞ', 'デ': 'ﾃﾞ', 'ド': 'ﾄﾞ',
    'バ': 'ﾊﾞ', 'ビ': 'ﾋﾞ', 'ブ': 'ﾌﾞ', 'ベ': 'ﾍﾞ', 'ボ': 'ﾎﾞ',
    'パ': 'ﾊﾟ', 'ピ': 'ﾋﾟ', 'プ': 'ﾌﾟ', 'ペ': 'ﾍﾟ', 'ポ': 'ﾎﾟ',
    'ヴ': 'ｳﾞ', 'ヷ': 'ﾜﾞ', 'ヺ': 'ｦﾞ',
    'ア': 'ｱ', 'イ': 'ｲ', 'ウ': 'ｳ', 'エ': 'ｴ', 'オ': 'ｵ',
    'カ': 'ｶ', 'キ': 'ｷ', 'ク': 'ｸ', 'ケ': 'ｹ', 'コ': 'ｺ',
    'サ': 'ｻ', 'シ': 'ｼ', 'ス': 'ｽ', 'セ': 'ｾ', 'ソ': 'ｿ',
    'タ': 'ﾀ', 'チ': 'ﾁ', 'ツ': 'ﾂ', 'テ': 'ﾃ', 'ト': 'ﾄ',
    'ナ': 'ﾅ', 'ニ': 'ﾆ', 'ヌ': 'ﾇ', 'ネ': 'ﾈ', 'ノ': 'ﾉ',
    'ハ': 'ﾊ', 'ヒ': 'ﾋ', 'フ': 'ﾌ', 'ヘ': 'ﾍ', 'ホ': 'ﾎ',
    'マ': 'ﾏ', 'ミ': 'ﾐ', 'ム': 'ﾑ', 'メ': 'ﾒ', 'モ': 'ﾓ',
    'ヤ': 'ﾔ', 'ユ': 'ﾕ', 'ヨ': 'ﾖ',
    'ラ': 'ﾗ', 'リ': 'ﾘ', 'ル': 'ﾙ', 'レ': 'ﾚ', 'ロ': 'ﾛ',
    'ワ': 'ﾜ', 'ヲ': 'ｦ', 'ン': 'ﾝ',
    'ァ': 'ｧ', 'ィ': 'ｨ', 'ゥ': 'ｩ', 'ェ': 'ｪ', 'ォ': 'ｫ',
    'ッ': 'ｯ', 'ャ': 'ｬ', 'ュ': 'ｭ', 'ョ': 'ｮ',
    '。': '｡', '、': '､', 'ー': 'ｰ', '「': '｢', '」': '｣', '・': '･',
  }
  type KanaKey = keyof (typeof kanaMap)

  const reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g')

  return str
    .replace(reg, match => kanaMap[match as KanaKey])
    .replace(/゛/g, 'ﾞ')
    .replace(/゜/g, 'ﾟ')
}

/**
 * 半角ｶﾀｶﾅ -> 全角カタカナ
*/
export const hankana2zenkana = (str: string) => {
  const kanaMap = {
    'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
    'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
    'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
    'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
    'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
    'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
    'ｱ' : 'ア', 'ｲ' : 'イ', 'ｳ' : 'ウ', 'ｴ' : 'エ', 'ｵ' : 'オ',
    'ｶ' : 'カ', 'ｷ' : 'キ', 'ｸ' : 'ク', 'ｹ' : 'ケ', 'ｺ' : 'コ',
    'ｻ' : 'サ', 'ｼ' : 'シ', 'ｽ' : 'ス', 'ｾ' : 'セ', 'ｿ' : 'ソ',
    'ﾀ' : 'タ', 'ﾁ' : 'チ', 'ﾂ' : 'ツ', 'ﾃ' : 'テ', 'ﾄ' : 'ト',
    'ﾅ' : 'ナ', 'ﾆ' : 'ニ', 'ﾇ' : 'ヌ', 'ﾈ' : 'ネ', 'ﾉ' : 'ノ',
    'ﾊ' : 'ハ', 'ﾋ' : 'ヒ', 'ﾌ' : 'フ', 'ﾍ' : 'ヘ', 'ﾎ' : 'ホ',
    'ﾏ' : 'マ', 'ﾐ' : 'ミ', 'ﾑ' : 'ム', 'ﾒ' : 'メ', 'ﾓ' : 'モ',
    'ﾔ' : 'ヤ', 'ﾕ' : 'ユ', 'ﾖ' : 'ヨ',
    'ﾗ' : 'ラ', 'ﾘ' : 'リ', 'ﾙ' : 'ル', 'ﾚ' : 'レ', 'ﾛ' : 'ロ',
    'ﾜ' : 'ワ', 'ｦ' : 'ヲ', 'ﾝ' : 'ン',
    'ｧ' : 'ァ', 'ｨ' : 'ィ', 'ｩ' : 'ゥ', 'ｪ' : 'ェ', 'ｫ' : 'ォ',
    'ｯ' : 'ッ', 'ｬ' : 'ャ', 'ｭ' : 'ュ', 'ｮ' : 'ョ',
    '｡' : '。', '､' : '、', 'ｰ' : 'ー', '｢' : '「', '｣' : '」', '･' : '・',
  }
  type KanaKey = keyof (typeof kanaMap)

  const reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g')

  return str
    .replace(reg, match => kanaMap[match as KanaKey])
    .replace(/ﾞ/g, '゛')
    .replace(/ﾟ/g, '゜')
}

/**
 * 文字列中の数字部分だけを数値型として返す関数
 * (※無ければ0が返る)
*/
export const str2num = (val: string | number) => {
  if (typeof val === 'number')
    return val
  else
    return Number(val.match(/[0-9.]*/)?.[0])
}

/**
 * LF(\n)以外の改行コードをLFに変換する関数
*/
export const convert2LF = (str: string) => {
  return str
    .replace(regExpCRLF, LF)
    .replace(regExpCR,   LF)
}

/**
 * テキストの末尾に改行コードが1つだけ残っている場合に取り除く関数
*/
export const trimLastLF = (str: string) => {
  const match = str.match(/\s+$/)
  if (match && match[0] === LF) {
    str = str.slice(0, -1)
  }
  return str
}

/**
 * テキストの末尾に改行コードが1つだけ残っている場合に2つに増やす関数
*/
export const doubleLastLF = (str: string) => {
  const match = str.match(/\s+$/)
  if (match && match[0] === LF) {
    str += LF
  }
  return str
}

/**
 * 文字列を空白文字により分割した配列を返す関数
*/
export const splitByBlank = (str: string) => {
  return str.split(/\s/).filter(piece => piece)
}

/**
 * HTML用にXSSのリスクがある記号をエスケープする関数
*/
export const escapeHTML = (str: string) => {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * HTML用にエスケープした文字列をデコードする関数
*/
export const unescapeHTML = (str: string) => {
  return str
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&amp;/g,  '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, '\'')
}

/**
 * 正規表現用に文字列をエスケープする関数
*/
export const escapeRegExp = (str: string) => {
  return str
    .replace('\\', '\\\\')
    .replace('\'', '\\\'')
    .replace('"', '\\"')
    .replace('.', '\\.')
    .replace('*', '\\*')
    .replace('+', '\\+')
    .replace('?', '\\?')
    .replace('^', '\\^')
    .replace('$', '\\$')
    .replace('-', '\\-')
    .replace('|', '\\|')
    .replace('/', '\\/')
    .replace('{', '\\{')
    .replace('}', '\\}')
    .replace('(', '\\(')
    .replace(')', '\\)')
    .replace('[', '\\[')
    .replace(']', '\\]')
}

// ランダムな文字列を生成して返す関数
export const makeID = (n = 16) => {
  return btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(n)))
  ).substring(0, n)
}
