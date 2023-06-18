// import { API_PATH } from '../../db'
const config = useRuntimeConfig()
const API_PATH = config.public.API_PATH

const endpoint = `${API_PATH}/sets/delete/node.php`

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

export default defineEventHandler(async (event) => {
  try {
    const id = encodeURI(getQuery(event).id as string)
    const query = `?id=${id}`
    const response = await $fetch(endpoint + query)
    
    return JSON.parse(response as string) as DeleteNodeResponse
  } catch (err) {
    console.log(err)
    
    return { result: 1 }
  }
})