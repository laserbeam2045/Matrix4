import { Ref, ComputedRef } from 'vue'

import type { DragMode } from '@/types/Draggable'

import type { SelectNodeArguments } from '@/server/api/tree/select-node'
import type { SelectTreeArguments } from '@/server/api/tree/select-tree'
import type { SelectUpdatedArguments } from '@/server/api/tree/select-updated'
import type { SearchNodesArguments } from '@/server/api/tree/search-nodes'
import type { InsertNodeArguments } from '@/server/api/tree/insert-node'
import type { InsertCloneArguments } from '@/server/api/tree/insert-clone'
import type { UpdateNodeArguments } from '@/server/api/tree/update-node'
import type { UpdateOpenArguments } from '@/server/api/tree/update-open'
import type { UpdateGroupArguments } from '@/server/api/tree/update-group'
import type { SparseTreeArguments } from '@/server/api/tree/sparse-tree'
import type { DeleteNodeArguments } from '@/server/api/tree/delete-node'
import type { DeleteTreeArguments } from '@/server/api/tree/delete-tree'
import type { MovingNodeArguments } from '@/server/api/tree/moving-node'
import type { MovingTreeArguments } from '@/server/api/tree/moving-tree'

/**
 * DBから取得されるデータ型
*/
export interface SetResponse {
  id: string              // 主キー
  txt: string             // ラベル
  text: string            // テキスト
  link: string            // リンク
  level: number           // 階層（1 <= n）
  opened: number          // 開いているか
  isGroup: number         // グループ線を表示するかどうか
  parent: string | null   // 親のid
  progeniesCount: number  // 子孫の数
  lft: number
  rgt: number
  updatedType: number
  createdAt: string
  updatedAt: string
}

/**
 * DBのデータを再帰的な構造に拡張したデータ型
 */
export interface TreeData extends SetResponse {
  index: number           // 位置（0 <= n）
  children?: TreeData[]   // 子の配列
  childrenCount: number   // 子の数
}

/**
 * Treeコンポーネントに渡すプロパティ
 */
export interface TreeOptions {
  dragMode: DragMode
  handleSelector?: string
  draggableSelector?: string
}

// footer
export interface TreeState {
  search: {
    showWindow: boolean,
    filters: [
      boolean,
      boolean,
    ],
    word: string,
    result: SetResponse[],
  },
  display: {
    factions: [
      boolean,
      boolean,
      boolean,
      boolean,
      boolean,
      boolean,
    ],
    jumpTunnels: [
      boolean,
      boolean,
      boolean,
    ],
    sensors: 'lifeforms' | 'economy' | 'crime',
  },
}

export type SelectNode = (args: SelectNodeArguments) => Promise<SetResponse>
export type SelectTree = (args: SelectTreeArguments) => Promise<SetResponse[]>
export type SelectUpdated = (args: SelectUpdatedArguments) => Promise<{ updatedAt: string, updatedType }>
export type SearchNodes = (args: SearchNodesArguments) => Promise<SetResponse[]>
export type InsertNode = (args: InsertNodeArguments) => Promise<{ id: string }>
export type InsertClone = (args: InsertCloneArguments) => Promise<{ id: string }>
export type UpdateNode = (args: UpdateNodeArguments) => Promise<void>
export type UpdateOpen = (args: UpdateOpenArguments) => Promise<void>
export type UpdateGroup = (args: UpdateGroupArguments) => Promise<void>
export type SparseTree = (args: SparseTreeArguments) => Promise<void>
export type DeleteNode = (args: DeleteNodeArguments) => Promise<void>
export type DeleteTree = (args: DeleteTreeArguments) => Promise<void>
export type MovingNode = (args: MovingNodeArguments) => Promise<void>
export type MovingTree = (args: MovingTreeArguments) => Promise<void>
export type ChangeRoot = (id: string) => Promise<void>
export type UpdateData = (loading?: boolean) => Promise<void>
export type ChangeOpen = (args: { id: string }) => Promise<void>

/**
 * ツリーデータの操作メソッドを持つオブジェクト
 */
export type TreeMethods = {
  selectNode: SelectNode
  selectTree: SelectTree
  selectUpdated: SelectUpdated
  searchNodes: SearchNodes
  insertNode: InsertNode
  insertClone: InsertClone
  updateNode: UpdateNode
  updateOpen: UpdateOpen
  updateGroup: UpdateGroup
  sparseTree: SparseTree
  deleteNode: DeleteNode
  deleteTree: DeleteTree
  movingNode: MovingNode
  movingTree: MovingTree
  changeRoot: ChangeRoot
  updateData: UpdateData
  changeOpen: ChangeOpen
}

/**
 * ツリーデータの履歴を操作するメソッドを持つオブジェクト
 */
export type TreeHistory = {
  isExistsPrev: ComputedRef<boolean>
  isExistsNext: ComputedRef<boolean>
  backToThePrev: () => void
  forwardToTheNext: () => void
}

// ツリーデータを扱うモジュール
export default function useTree(): {
  rootId: Ref<string>,
  treeData: ComputedRef<TreeData | null>,
  treeMethods: TreeMethods,
  treeHistory: TreeHistory,
  isTreeLoading: Ref<boolean>
  isTreeOldData: Ref<boolean>
  } {
  const isTreeLoading = useState('isTreeLoading', () => false)

  const isTreeOldData = useState('isTreeOldData', () => true)

  const isTreeMoving = useState('isTreeMoving', () => false)

  // ルートID
  const rootId = useState('treeRootId', () => '')

  const updatedAt = useState('updatedAt', () => '')

  // 遷移履歴
  const history: Ref<string[]> = useState('treeHistory', () => [])

  // 履歴中の現在の位置
  const currentPosition = useState('currentPosition', () => -1)

  // APIから取得したままのデータ
  const table: Ref<SetResponse[]> = useState('treeTable', () => [])

  // ルートノード
  const root: ComputedRef<SetResponse | null> = computed(() => table?.value?.[0] ?? null)

  // 再帰的な構造のオブジェクト
  const treeData: ComputedRef<TreeData | null> = computed(() => root.value ? assemble(root.value, 0) : null)

  // テーブルのデータ(配列)を木構造(オブジェクト)に再構築する関数
  const assemble = (setData: SetResponse, index: number): TreeData => {
    let childrenCount = 0
    const children = table.value
      .filter(child => child.parent === setData.id)
      .map(child => assemble(child, childrenCount++))

    return {
      index,
      children,
      childrenCount,
      ...setData,
    }
  }

  // データを操作するメソッドを持つオブジェクト
  const treeMethods: TreeMethods = {

    selectNode: async (params) => {
      isTreeLoading.value = true
      const { data, error } = await useFetch('/api/tree/select-node', { params })
      isTreeLoading.value = false

      return error.value
        ? Promise.reject(error.value)
        : Promise.resolve(data.value.result[0])
    },

    selectTree: async (params) => {
      isTreeLoading.value = true
      const { data, error } = await useFetch('/api/tree/select-tree', { params })
      isTreeLoading.value = false

      return error.value
        ? Promise.reject(error.value)
        : Promise.resolve(data.value.result)
    },

    selectUpdated: async (params) => {
      const { data, error } = await useFetch('/api/tree/select-updated', { params })

      return error.value
        ? Promise.reject(error.value)
        : Promise.resolve(data.value.result)
    },

    searchNodes: async (params) => {
      isTreeLoading.value = true
      const { data, error } = await useFetch('/api/tree/search-nodes', { params })
      isTreeLoading.value = false

      return error.value
        ? Promise.reject(error.value)
        : Promise.resolve(data.value.result)
    },

    insertNode: async (params) => {
      isTreeLoading.value = true
      const { data, error } = await useFetch('/api/tree/insert-node', { params })

      return error.value
        ? Promise.reject(error.value)
        : Promise.resolve(data.value)
    },

    insertClone: async (params) => {
      isTreeLoading.value = true
      const { data, error } = await useFetch('/api/tree/insert-clone', { params })

      return error.value
        ? Promise.reject(error.value)
        : Promise.resolve(data.value)
    },

    updateNode: async (params) => {
      isTreeLoading.value = true
      const { error } = await useFetch('/api/tree/update-node', { params })

      return error.value
        ? Promise.reject(error.value)
        : Promise.resolve()
    },

    updateOpen: async (params) => {
      const { error } = await useFetch('/api/tree/update-open', { params })

      return error.value
        ? Promise.reject(error.value)
        : Promise.resolve()
    },

    updateGroup: async (params) => {
      const { error } = await useFetch('/api/tree/update-group', { params })

      return error.value
        ? Promise.reject(error.value)
        : Promise.resolve()
    },

    sparseTree: async (params) => {
      isTreeLoading.value = true
      const { error } = useFetch('/api/tree/sparse-tree', { params })
      isTreeLoading.value = false

      return error.value
        ? Promise.reject(error.value)
        : Promise.resolve()
    },

    deleteNode: async (params) => {
      isTreeLoading.value = true
      const { error } = await useFetch('/api/tree/delete-node', { params })

      return error.value
        ? Promise.reject(error.value)
        : Promise.resolve()
    },

    deleteTree: async (params) => {
      isTreeLoading.value = true
      const { error } = await useFetch('/api/tree/delete-tree', { params })

      return error.value
        ? Promise.reject(error.value)
        : Promise.resolve()
    },

    movingNode: async (params) => {
      isTreeLoading.value = true
      const { data } = await useFetch('/api/tree/moving-node', { params })
      isTreeLoading.value = false

      switch (data.value.result) {
      case 0 : return Promise.resolve()
      case 1 : return Promise.reject('Invalid params')
      case 2 : return Promise.reject('Internal Server Error???')
      default: return Promise.reject('Something was wrong...')
      }
    },

    movingTree: async (params) => {
      isTreeLoading.value = true
      const { data } = await useFetch('/api/tree/moving-tree', { params })

      switch (data.value.result) {
      case 0 : return Promise.resolve()
      case 1 : return Promise.reject('Invalid params')
      case 2 : return Promise.reject('Internal Server Error???')
      default: return Promise.reject('Something was wrong...')
      }
    },

    changeRoot: (id) => {
      if (id.length !== 16) {
        return Promise.reject('Invalid id')
      }
      rootId.value = id
      return Promise.resolve()
    },

    updateData: async function(loading = true) {
      if (!rootId.value) {
        return Promise.reject('No tree data')
      }
      if (loading) {
        isTreeLoading.value = true
      }
      const params = { id: rootId.value }
      const { data, error } = await useFetch('/api/tree/select-tree', { params })

      if (error.value) {
        isTreeLoading.value = false
        return Promise.reject(error.value)
      }

      table.value = data.value?.result ?? []
      isTreeLoading.value = false
      isTreeOldData.value = false
      updatedAt.value = root.value?.updatedAt ?? ''
      isTreeMoving.value = false
      return Promise.resolve()
    },

    changeOpen: (params) => {
      const node = table.value.find((node) => node.id === params.id)
      node.opened = Number(!node.opened)
      return Promise.resolve()
    },
  }

  // 一つ前の状態があるときにtrue
  const isExistsPrev = computed(() => {
    return !!history.value[currentPosition.value - 1]
  })

  // 一つ次の状態があるときにtrue
  const isExistsNext = computed(() => {
    return !!history.value[currentPosition.value + 1]
  })

  // 一つ前の状態に戻る
  const backToThePrev = () => {
    if (isExistsPrev.value) {
      isTreeOldData.value = true
      currentPosition.value--
      rootId.value = history.value[currentPosition.value]
    }
  }

  // 一つ次の状態に進む
  const forwardToTheNext = () => {
    if (isExistsNext.value) {
      isTreeOldData.value = true
      currentPosition.value++
      rootId.value = history.value[currentPosition.value]
    }
  }

  // 履歴に関する算出プロパティ・メソッド
  const treeHistory: TreeHistory = {
    isExistsPrev,
    isExistsNext,
    backToThePrev,
    forwardToTheNext,
  }

  watch(rootId, async (id) => {
    if (id !== history.value[currentPosition.value]) {
      history.value.push(id)
      currentPosition.value++
      isTreeOldData.value = true
      isTreeMoving.value = true
    }
  })

  const intervalId = ref(null)

  onMounted(async () => {
    intervalId.value = setInterval(async () => {
      if (!rootId.value) return
      if (isTreeOldData.value || isTreeLoading.value || isTreeMoving.value) {
        return
      }

      const response = await treeMethods.selectUpdated({ id: rootId.value })
      if (typeof response?.updatedAt === 'string') {
        console.log(`%c${response.updatedAt}`, 'color: green')
        if (
            updatedAt.value !== response.updatedAt
          ) {
          if (
            response.updatedType !== 1 &&
            response.updatedType !== 2
          ) {
            console.table({ response })
            treeMethods.updateData()
          } else {
            console.table({ response })
            treeMethods.updateData(false)
          }
          updatedAt.value = response.updatedAt
          console.log('%cData has been Updated', 'color: blue')
        }
      }
    }, 1000)
  })

  onUnmounted(() => {
    if (intervalId.value) {
      clearInterval(intervalId.value)
    }
  })

  return {
    rootId,
    treeData,
    treeMethods,
    treeHistory,
    isTreeLoading,
    isTreeOldData,
  }
}
