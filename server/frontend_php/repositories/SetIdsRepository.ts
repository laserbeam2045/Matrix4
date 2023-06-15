import Repository from './Repository'

import { ResponseData } from '@/types/Id'

const resource = '/api/set-ids'
// const resource = '/api_stg/set-ids'

const idMethods = {
  fetchIds: (): Promise<ResponseData | undefined> => Repository.get(`${resource}/select/index.php`),
  createId: (payload: { id: string }): Promise<void> => Repository.get(`${resource}/create/index.php`, { params: payload }),
  deleteId: (payload: { id: string }): Promise<void> => Repository.get(`${resource}/delete/index.php`, { params: payload }),
}

export default idMethods
