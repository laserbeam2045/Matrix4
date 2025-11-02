/**
 * ゲーム関連の型定義
 */

/**
 * スペルモード
 */
export type SpellMode = 'none' | 'hit' | 'blow'

/**
 * スペル（単一文字）
 */
export interface Spell {
  character: string
  mode: SpellMode
}

/**
 * 単語（スペルの配列）
 */
export type Word = Spell[]
