import type { IncomingMessage } from 'http'
// import * as url from 'url'

import { API_PATH } from '../../db'

/**
 * リクエストに必要なパラメータ
 */
export type DeleteNodeArguments = {
  id: string
}

/**
 * APIから取得されるデータ型
*/
export type DeleteNodeResponse = {
  result: 0 | 1
}

// export default async (req: IncomingMessage) => {
  // const queryObject = url.parse(req.url as string, true).query
  // let data = {
  //   result: 1,
  // }

  // const { id } = queryObject

  // if (id) {
  //   data = await $fetch(`${API_PATH}/sets/delete/node.php?id=${id}`)
  // }

  // res.writeHead(200, { 'Content-Type': 'application/json' })
  // res.write(JSON.stringify(data))
  // console.log(data, id, req.url)
  // res.end()

//   try {
//     const response: string = await $fetch(`${API_PATH}/sets/delete/node.php` + req.url)
//     return JSON.parse(response) as DeleteNodeResponse
//   } catch (err) {
//     console.log(err)
//     return { result: 1 }
//   }
// }

const endpoint = `${API_PATH}/sets/delete/node.php`

export default defineEventHandler(async (event) => {
  try {
    const id = getQuery(event).id

    const response = await $fetch(`${endpoint}?id=${id}`)
    return JSON.parse(response as string) as DeleteNodeResponse
  } catch (err) {
    console.log(err)
    return { result: 1 }
  }
})