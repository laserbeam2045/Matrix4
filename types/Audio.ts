
/**
 * DBから取得したレコードの型定義
*/
export interface Record {
  path: string
  fileName: string
  extension: string
  volume: number
  label: string
}

/**
 * APIから取得されるデータ型
*/
export interface ResponseData {
  status: number
  data: Record[]
}
