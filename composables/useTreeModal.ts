import type { Ref } from 'vue'
import type { TreeData, TreeMethods } from '@/composables/useTree'

/**
 * ツリーモーダルの操作を管理するcomposable
 */
export function useTreeModal() {
  /**
   * アイテムのInsert処理
   */
  const handleInsert = async (
    params: {
      pID: string
      txt: string
      text: string
      link: string
    },
    treeMethods: TreeMethods,
    callbacks: {
      onSuccess: (result: { id: string }) => void
      onError: (err?: string) => void
      onChangeRoot: (id: string) => void
    }
  ) => {
    const { pID, txt, text, link } = params

    if (txt === 'root') {
      callbacks.onChangeRoot(pID)
      return
    }

    if (txt === '秘密の部屋') {
      try {
        const result = await treeMethods.insertNode({ pID, txt, text, link })
        callbacks.onSuccess(result)
        callbacks.onChangeRoot(result.id)
      } catch (err) {
        callbacks.onError(err as string)
      }
      return
    }

    if (txt === 'sparse') {
      try {
        await treeMethods.sparseTree({})
        callbacks.onSuccess({ id: '' })
      } catch (err) {
        callbacks.onError(err as string)
      }
      return
    }

    try {
      const result = await treeMethods.insertNode({ pID, txt, text, link })
      callbacks.onSuccess(result)
    } catch (err) {
      callbacks.onError(err as string)
    }
  }

  /**
   * アイテムのClone処理
   */
  const handleClone = async (
    id: string,
    maxCount: number,
    treeMethods: TreeMethods,
    callbacks: {
      onSuccess: () => void
      onError: (message: string) => void
      onChangeRoot: (id: string) => void
    }
  ) => {
    if (maxCount > 150) {
      callbacks.onError('Too many items to clone.')
      return
    }

    try {
      const response = await treeMethods.insertClone({ id })

      if (response.id) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        callbacks.onChangeRoot(response.id)
        await new Promise(resolve => setTimeout(resolve, 1000))
        callbacks.onSuccess()
      } else {
        callbacks.onError('Clone failed')
      }
    } catch (err) {
      callbacks.onError(typeof err === 'string' ? err : 'Clone failed')
    }
  }

  /**
   * アイテムのUpdate処理
   */
  const handleUpdate = async (
    params: {
      id: string
      txt: string
      text: string
      link: string
      isGroup: number
    },
    treeMethods: TreeMethods,
    callbacks: {
      onSuccess: () => void
      onError: (err?: string) => void
    }
  ) => {
    try {
      await treeMethods.updateNode(params)
      callbacks.onSuccess()
    } catch (err) {
      callbacks.onError(err as string)
    }
  }

  /**
   * アイテムのDelete処理
   */
  const handleDelete = async (
    id: string,
    deleteMethod: (args: { id: string }) => Promise<void>,
    callbacks: {
      onSuccess: () => void
      onError: (err?: string) => void
    }
  ) => {
    try {
      await deleteMethod({ id })
      callbacks.onSuccess()
    } catch (err) {
      callbacks.onError(err as string)
    }
  }

  /**
   * Teleport処理
   */
  const handleTeleport = async (
    params: {
      cID: string
      pID: string
      idx: number
    },
    treeMethods: TreeMethods,
    callbacks: {
      onSuccess: () => void
      onError: (err?: string) => void
      onCancel: () => void
    }
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      treeMethods.movingTree(params)
        .then(() => {
          callbacks.onSuccess()
          resolve()
        })
        .catch((err) => {
          callbacks.onError(err as string)
          reject(err)
        })
    })
  }

  return {
    handleInsert,
    handleClone,
    handleUpdate,
    handleDelete,
    handleTeleport,
  }
}
