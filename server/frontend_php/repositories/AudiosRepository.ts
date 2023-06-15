import Repository from './Repository'

import { ResponseData } from '@/types/Audio'

const resource = '/api/audios'
// const resource = '/api_stg/audios'

const audioMethods = {
  fetchAudios: (payload: { audioLabels: string }): Promise<ResponseData | undefined> => Repository.get(`${resource}/select/index.php`, { params: payload }),
}

export default audioMethods
