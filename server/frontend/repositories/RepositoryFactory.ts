import Repository from './Repository'
import SetsRepository from './SetsRepository'

export type RepositoryName = 'sets'

export type Repository = typeof SetsRepository

const repositories = {
  sets: SetsRepository,
}

export const RepositoryFactory = {
  get: (name: RepositoryName): Repository => repositories[name],
}
