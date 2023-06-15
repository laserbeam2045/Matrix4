import Repository from './Repository'
import setsRepository from './SetsRepository'
import setIdsRepository from './SetIdsRepository'
import audiosRepository from './AudiosRepository'

export type RepositoryName = 'sets' | 'setIds' | 'audios'

export type SetsRepository = typeof setsRepository
export type SetIdsRepository = typeof setIdsRepository
export type AudiosRepository = typeof audiosRepository

export type Repository = SetsRepository | SetIdsRepository | AudiosRepository

const repositories = {
  sets: setsRepository,
  setIds: setIdsRepository,
  audios: audiosRepository,
}

export const RepositoryFactory = {
  get: (name: RepositoryName): Repository => repositories[name],
}
