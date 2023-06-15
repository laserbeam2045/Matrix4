/**
 * APIから取得されるデータ型
*/
export interface SetId {
  id: number
  setId: string
  createdAt: string
  updatedAt: string
}

/**
 * APIから取得されるデータ型
*/
export interface ResponseData {
  status: number
  data: SetId[]
}
