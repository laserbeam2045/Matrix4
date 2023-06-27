<template>
  <!-- 最初のモーダル -->
  <AppWindowModal
    :is-visible="modalWindows.includes(WINDOW_KIND.MAIN)"
    :legend="about?.progeniesCount ? `${about.progeniesCount + 1} Items` : 'Item'"
    @close="buttonEvent.press(0)"
  >
    <div class="container">
      <div class="body">
        <h1 class="title">{{ about.txt }}</h1>
        <AppSlider
          v-model:tabIndex="tabIndexMain"
          :tabs="Object.keys(tableState)"
          class="mt-6"
        >
          <div
            v-for="(items, key) in tableState"
            :key="key"
            class="flex flex-row items-center justify-center"
          >
            <table>
              <tr v-for="(item) in items" :key="item.thText">
                <th>
                  <p class="head">{{ item.thText }}</p>
                </th>
                <td>
                  <p class="text">{{ item.tdText }}</p>
                </td>
                <td v-if="key === 'ID'">
                  <AppCopy :value="item.tdText" @copy="onCopy" />
                </td>
              </tr>
            </table>
          </div>
        </AppSlider>
      </div>
      <div class="buttons">
        <transition-group name="fade" mode="out-in">
          <AppButton
            v-for="button in mainButtons"
            :key="button.buttonId"
            class="button"
            @end.self="buttonEvent.press(button.buttonId)"
          >
            {{ button.buttonText }}
          </AppButton>
        </transition-group>
      </div>
    </div>
  </AppWindowModal>

  <!-- 新規作成モーダル -->
  <AppWindowModal
    :is-visible="modalWindows.includes(WINDOW_KIND.INSERT)"
    legend="Insert"
    @close="buttonEvent.press(0)"
  >
    <div class="container">
      <div class="body -mt-5 mb-7">
        <table>
          <tr>
            <td>
              <AppInputTextTwo
                v-model:value="stateValues.insert.txt"
                v-focus
                height="38px"
                list="tokyo"
                name="text"
                placeholder="Text"
                @keydown.ctrl.enter="buttonEvent.press(2)"
                @keydown.ctrl.delete="buttonEvent.press(1)"
              />
              <!-- <datalist id="tokyo">
                <option value="渋谷" />
                <option value="新宿" />
                <option value="池袋" />
              </datalist> -->
            </td>
          </tr>
          <tr>
            <td class="pt-2">
              <AppInputTextTwo
                v-model:value="stateValues.insert.link"
                height="38px"
                placeholder="Link"
                @keydown.ctrl.enter="buttonEvent.press(2)"
                @keydown.ctrl.delete="buttonEvent.press(1)"
              />
            </td>
          </tr>
        </table>
      </div>
      <div class="buttons">
        <AppButton class="button" @end.self="buttonEvent.press(1)">Cancel</AppButton>
        <AppButton class="button" @end.self="buttonEvent.press(2)">Insert</AppButton>
      </div>
    </div>
  </AppWindowModal>

  <!-- 編集モーダル -->
  <AppWindowModal
    :is-visible="modalWindows.includes(WINDOW_KIND.UPDATE)"
    legend="Update"
    @close="buttonEvent.press(0)"
  >
    <div class="container">
      <div class="body -mt-5 mb-7">
        <AppSlider
          v-model:tabIndex="tabIndexUpdate"
          :tabs="['MAIN', 'FLAG']"
          class="mt-6"
        >
          <div style="width: 260px;">
            <div class="mt-8">
              <AppInputTextTwo
                v-model:value="stateValues.update.txt"
                height="38px"
                placeholder="Text"
                style="width: 260px;"
                @keydown.ctrl.enter="buttonEvent.press(2)"
                @keydown.ctrl.delete="buttonEvent.press(1)"
              />
            </div>
            <div class="mt-8">
              <AppInputTextTwo
                v-model:value="stateValues.update.link"
                height="38px"
                placeholder="Link"
                style="width: 260px;"
                @keydown.ctrl.enter="buttonEvent.press(2)"
                @keydown.ctrl.delete="buttonEvent.press(1)"
              />
            </div>
          </div>
          <div style="width: 260px;">
            <div
              class="flex justify-center align-center"
              style="height: 24px; margin: 16px 0 0;"
            >
              <span style="line-height: 24px; margin: 0px 8px 0;">Group:</span><AppInputCheckbox v-model:checked="stateValues.update.isGroup" />
            </div>
          </div>
        </AppSlider>
      </div>
      <div class="buttons">
        <AppButton class="button" @end.self="buttonEvent.press(1)">Cancel</AppButton>
        <AppButton class="button" @end.self="buttonEvent.press(2)">Update</AppButton>
      </div>
    </div>
  </AppWindowModal>

  <!-- 確認ダイアログ -->
  <AppWindowModal
    :is-visible="modalWindows.includes(WINDOW_KIND.CONFIRM)"
    :legend="confirmState.legend"
    @close="buttonEvent.press(0)"
  >
    <div class="container">
      <div class="body mb-8">
        <pre class="info">{{ confirmState.message }}</pre>
      </div>
      <AppInputKey
        v-if="!isSupportTouch"
        @delete="buttonEvent.press(1)"
        @enter="buttonEvent.press(2)"
      />
      <div class="buttons">
        <AppButton v-if="confirmState.buttonRefuse" @end.self="buttonEvent.press(1)">{{ confirmState.buttonRefuse }}</AppButton>
        <AppButton @end.self="buttonEvent.press(2)">{{ confirmState.buttonAccept }}</AppButton>
      </div>
    </div>
  </AppWindowModal>

  <!-- メッセージダイアログ -->
  <AppWindowModal
    :is-visible="modalWindows.includes(WINDOW_KIND.MESSAGE)"
    legend="Result"
    @close="buttonEvent.press(0)"
  >
    <div class="container">
      <div class="body mb-8">
        <p class="info">{{ messageState }}</p>
      </div>
      <AppInputKey
        v-if="!isSupportTouch"
        @enter="buttonEvent.press(1)"
      />
      <div class="buttons">
        <AppButton @end.self="buttonEvent.press(1)">OK</AppButton>
      </div>
    </div>
  </AppWindowModal>
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ref } from 'vue'

import type {
  TreeData,
  DeleteNode,
  DeleteTree,
  TreeMethods,
} from '@/composables/useTree'

import useEvent from '@/composables/useEvent'
import useMatrix from '@/composables/useMatrix'
import useTeleport from '@/composables/useTeleport'
import useModalWindow from '@/composables/useModalWindow'

const props = defineProps<{
  treeMethods: TreeMethods
}>()

const {
  insertNode,
  insertClone,
  updateNode,
  sparseTree,
  deleteNode,
  deleteTree,
  movingTree,
  changeRoot,
} = props.treeMethods

const emit = defineEmits<{
  (event: 'update', update?: boolean): void,
  (event: 'finish'): void,
  (event: 'cancel'): void,
}>()

const { setInfo } = useMatrix()

const { isSupportTouch } = useEvent()

const { AUDIOS, playAudio } = useAudio()

const { teleportInfo, resetTeleportInfo } = useTeleport()

const ROOT_ID = useState('TREE_ROOT_ID').value as string

console.table({ ROOT_ID })

const about = useState('about') as Ref<TreeData | null>

// 親がrootではないときにtrue
const isValidParent = computed(() => about.value.parent?.length === 16 && about.value.parent !== ROOT_ID)

const stateValues = reactive({
  insert: {
    txt: '',
    link: '',
  },
  update: {
    txt: '',
    link: '',
    isGroup: true,
  },
  delete: {
    id: '',
    progeniesCount: 0,
  },
})

// メインウィンドウに表示するデータ
const tableState = reactive({
  ID: [
    {
      thText: 'ID',
      tdText: computed(() => about.value.id),
    },
    {
      thText: 'Link',
      tdText: computed(() => about.value.link),
    },
    {
      thText: 'Parent',
      tdText: computed(() => isValidParent.value ? about.value.parent : ''),
    },
  ],
  META: [
    {
      thText: 'Children',
      tdText: computed(() => about.value.childrenCount),
    },
    {
      thText: 'Progenies',
      tdText: computed(() => about.value.progeniesCount),
    },
    {
      thText: 'NestLevel',
      tdText: computed(() => about.value.level),
    },
    // {
    //   thText: 'Lft',
    //   tdText: computed(() => about.value.lft % 1 ? about.value.lft : Math.floor(about.value.lft)),
    // },
    // {
    //   thText: 'Rgt',
    //   tdText: computed(() => about.value.rgt % 1 ? about.value.rgt : Math.floor(about.value.rgt)),
    // },
  ],
  AUTH: [
    {
      thText: 'Author',
      tdText: 'May Satsuki',
    },
    {
      thText: 'Created',
      tdText: computed(() => about.value.createdAt),
    },
    {
      thText: 'Updated',
      tdText: computed(() => about.value.updatedAt),
    },
  ],
})

const clipboardData = useState('clipboardData')

// コピー時のイベントハンドラ
const onCopy = (payload: string) => {
  clipboardData.value = payload
}

const tabIndexMain = ref(0)
const tabIndexUpdate = ref(0)

// Windowの種類
const WINDOW_KIND = {
  MAIN: 'MAIN',
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  CONFIRM: 'CONFIRM',
  MESSAGE: 'MESSAGE',
} as const

// MainWindowの状態（こちらは型）
type WindowKind = typeof WINDOW_KIND[keyof typeof WINDOW_KIND]

// MainWindowの状態
const WINDOW_MODE = {
  EDIT: 'EDIT',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  DELETE_NODE: 'DELETE_NODE',
  DELETE_TREE: 'DELETE_TREE',
  DELETE_TREE_YES: 'DELETE_TREE_YES',
  DELETE_TREE_YES_YES: 'DELETE_TREE_YES_YES',
  TELEPORT_THIS: 'TELEPORT_THIS',
  TELEPORT_OTHER: 'TELEPORT_OTHER',
} as const

// MainWindowの状態（こちらは型）
type WindowMode = typeof WINDOW_MODE[keyof typeof WINDOW_MODE]

// 新規作成時の入力情報を初期化する関数
const resetInsertValues = () => {
  stateValues.insert.txt = ''
  stateValues.insert.link = ''
}

// 編集時の入力情報を初期化する関数
const resetUpdateValues = () => {
  stateValues.update.txt = about.value.txt
  stateValues.update.link = about.value.link
  stateValues.update.isGroup = !!about.value.isGroup
}

// 削除するための情報を記録する関数
const resetDeleteValues = () => {
  stateValues.delete.id = about.value?.id ?? ''
  stateValues.delete.progeniesCount = about.value?.progeniesCount ?? 0
}

// モーダルのスタック
const {
  modalWindows,
  pushWindow,
  popWindow,
} = useModalWindow()

// ウィンドウモード
const windowMode = ref<WindowMode>(WINDOW_MODE.EDIT)

const mainButtons = computed(() => {
  if (windowMode.value === WINDOW_MODE.EDIT) {
    return [
      { buttonId: 3, buttonText: 'Create' },
      { buttonId: 4, buttonText: 'Update' },
      { buttonId: 5, buttonText: 'Delete' },
    ]
  }
  if (windowMode.value === WINDOW_MODE.CREATE) {
    return [
      { buttonId: 6, buttonText: 'Insert' },
      { buttonId: 7, buttonText: 'Clone' },
    ]
  }
  if (windowMode.value === WINDOW_MODE.DELETE) {
    return [
      { buttonId: 8, buttonText: 'Only this' },
      { buttonId: 9, buttonText: 'With children' },
    ]
  }
  return []
})

// 確認ダイアログに表示する文言
const confirmState = computed(() => {
  // Delete -> Only this
  if (windowMode.value === WINDOW_MODE.DELETE_NODE) {
    return {
      legend: 'Delete Item',
      message: 'Are you sure?',
      buttonRefuse: 'Cancel',
      buttonAccept: 'Yes',
    }
  // Delete -> With children
  } else if (windowMode.value === WINDOW_MODE.DELETE_TREE) {
    return {
      legend: 'Warning',
      message: `This item contains ${stateValues.delete.progeniesCount} other items,\nso they will all be removed.\nDo you still do it?`,
      buttonRefuse: 'Cancel',
      buttonAccept: 'OK',
    }
  // Delete -> With children -> Accept
  } else if (windowMode.value === WINDOW_MODE.DELETE_TREE_YES) {
    return {
      legend: `Delete ${stateValues.delete.progeniesCount + 1} items`,
      message: '...Are you sure ?',
      buttonRefuse: 'Cancel',
      buttonAccept: 'Yes',
    }
  // Delete -> With children -> Accept -> Accept
  } else if (windowMode.value === WINDOW_MODE.DELETE_TREE_YES_YES) {
    return {
      legend: 'Last Question',
      message: '...final answer ??',
      buttonRefuse: 'Cancel',
      buttonAccept: 'Final answer',
    }
  // Teleport -> Item -> This item
  } else if (windowMode.value === WINDOW_MODE.TELEPORT_THIS) {
    // return {
    //   legend: 'Teleport',
    //   message: `This item ${itemTextX}\nwill teleport from item ${itemTextY}\nto item ${itemTextZ}. Is it OK?`,
    //   buttonRefuse: 'Cancel',
    //   buttonAccept: 'OK',
    // }
    return {
      legend: 'Confirm',
      message: 'Are you sure?',
      buttonRefuse: 'Cancel',
      buttonAccept: 'Yes',
    }
  // Teleport -> Item -> Other item
  } else if (windowMode.value === WINDOW_MODE.TELEPORT_OTHER) {
    return {
      legend: 'Teleport',
      message: 'Item X\n will be teleport from item Y\n to this item Z. Is it OK?',
      buttonRefuse: 'Cancel',
      buttonAccept: 'OK',
    }
  }
  return {
    legend: 'Confirm',
    message: 'Are you sure?',
    buttonRefuse: 'Cancel',
    buttonAccept: 'Yes',
  }
})

// メッセージダイアログに表示する文言
const messageState = ref('Succeeded')

type Button = {
  press: (flag: number) => void
  knock: (reason?: any) => void
}

// モーダルウィンドウのボタンのイベントハンドラ
const buttonEvent: Button = reactive({
  press: (flag: number) => { Promise.resolve(flag) },
  knock: (reason?: any) => { Promise.reject(reason) },
})

// WINDOWの状態を初期化する関数
const initializeWindow = () => {
  resetInsertValues()
  resetUpdateValues()
  resetDeleteValues()
  windowMode.value = WINDOW_MODE.EDIT
}

// ダイアログを表示させる関数
const displayDialog = (
  dialogName: WindowKind | WindowMode,
  option: { push: boolean, pop: boolean}
)
: Promise<number> => {
  // MEMO: 新しいPromiseオブジェクトを生成して返すことで、
  //   ->: ユーザーのアクション(ここではボタン押下)を待機する
  return new Promise((resolve, reject) => {
    buttonEvent.press = (value: number) => {
      resolve(value)
      if (option.pop) popWindow(dialogName)
    }
    buttonEvent.knock = (reason?: any) => {
      reject(reason)
      if (option.pop) popWindow(dialogName)
    }
    // pushフラグがtrueならウィンドウを追加
    if (option.push) pushWindow(dialogName)
  })
}

// メッセージダイアログを表示させる関数
const displayMessageDialog = async (message: string) => {
  messageState.value = message
  displayDialog(WINDOW_KIND.MESSAGE, { push: true, pop: true })
}

// 何らかの処理が成功した時のコールバック関数
const ok = (result?: any) => {
  emit('update')
  setInfo('Succeeded')
  playAudio(AUDIOS.ETC.DECISION_30)
}

// 何らかの処理が成功した時のコールバック関数
const okb = (result?: any) => {
  emit('update', false)
  setInfo('Succeeded')
  playAudio(AUDIOS.ETC.DECISION_30)
}

// 何らかの処理が失敗した時のコールバック関数
const ng = (err?: string) => {
  playAudio(AUDIOS.ETC.CYBER_06_4)
  emit('update')
  emit('cancel')
  if (typeof err === 'string') {
    setInfo(err)
  } else {
    displayMessageDialog('Failed')
  }
}

// アイテムクリック時の処理
const onClickItem = async () => {
  const mainProcess = async () => {
    initializeWindow()
    playAudio(AUDIOS.ETC.DECISION_33)
    const option = { push: true, pop: false }
    const buttonId = await displayDialog(WINDOW_KIND.MAIN, option)
    switch (buttonId) {
    case 0:
    case 1: onClickCancel(); break
    case 3: onClickCreate(); break
    case 4: onClickUpdate(); break
    case 5: onClickDelete(); break
    }
  }

  // Cancel
  const onClickCancel = () => {
    playAudio(AUDIOS.ETC.CYBER_04_1)
    popWindow('Main')
    emit('finish')
  }

  // Create
  const onClickCreate = () => {
    const mainProcess = async () => {
      playAudio(AUDIOS.ETC.DECISION_22)
      windowMode.value = WINDOW_MODE.CREATE
      const option = { push: false, pop: true }
      const buttonId = await displayDialog(windowMode.value, option)
      switch (buttonId) {
      case 0:
      case 1: onClickCancel(); break
      case 6: onClickInsert(); break
      case 7: onClickClone(); break
      }
    }

    // Create -> Cancel
    const onClickCancel = () => {
      playAudio(AUDIOS.ETC.CYBER_04_1)
      emit('finish')
    }

    // Create -> Insert
    const onClickInsert = () => {
      const mainProcess = async () => {
        playAudio(AUDIOS.ETC.DECISION_22)
        const option = { push: true, pop: true }
        const buttonId = await displayDialog(WINDOW_KIND.INSERT, option)
        switch (buttonId) {
        case 0:
        case 1: onClickCancel(); break
        case 2: onClickInsert(); break
        }
      }

      // Insert -> Cancel
      const onClickCancel = () => {
        playAudio(AUDIOS.ETC.CYBER_04_1)
        emit('finish')
      }

      // Insert -> Insert
      const onClickInsert = async () => {
        const { id: pID } = about.value
        const { txt, link } = stateValues.insert

        playAudio(AUDIOS.ETC.DECISION_22)

        if (txt === 'root') {
          askChangeRoot(ROOT_ID)
          emit('finish')
          return
        }
        if (txt === '秘密の部屋') {
          const pID = ROOT_ID
          const ok = ({ id }: { id: string }) => {
            playAudio(AUDIOS.ETC.DECISION_30)
            askChangeRoot(id)
          }
          // console.table({pID, txt, link})
          insertNode({ pID, txt, link }).then(ok).catch(ng)
        } else if (txt === 'sparse') {
          sparseTree({}).then(okb).catch(ng)
        } else {
          insertNode({ pID, txt, link }).then(ok).catch(ng)
        }
      }
      mainProcess()
    }

    // Create -> Clone
    const onClickClone = async () => {
      // popWindow('Main')
      // displayMessageDialog('Coming soon...')
      if (about.value.progeniesCount > 150) {
        playAudio(AUDIOS.ETC.WARNING_1)
        return displayMessageDialog('Too many items to clone.')
      }

      playAudio(AUDIOS.ETC.DECISION_22)

      const { id } = about.value

      try {
        const response = await insertClone({ id })

        if (response.id) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          askChangeRoot(response.id)
          await new Promise(resolve => setTimeout(resolve, 1000))
          setInfo('Succeeded')
          playAudio(AUDIOS.ETC.DECISION_30)
        } else {
          ng()
        }
      } catch (err) {
        if (typeof err === 'string') {
          setInfo(err)
        }
      }
    }
    mainProcess()
  }

  // Update
  const onClickUpdate = () => {
    const mainProcess = async () => {
      playAudio(AUDIOS.ETC.DECISION_22)
      popWindow('Main')
      windowMode.value = WINDOW_MODE.UPDATE
      const option = { push: true, pop: true }
      const buttonId = await displayDialog(WINDOW_KIND.UPDATE, option)
      switch (buttonId) {
      case 0:
      case 1: onClickCancel(); break
      case 2: onClickUpdate(); break
      }
    }

    // Update -> Cancel
    const onClickCancel = () => {
      playAudio(AUDIOS.ETC.CYBER_04_1)
      emit('finish')
    }

    // Update -> Update
    const onClickUpdate = () => {
      const { id, opened } = about.value
      const { txt, link, isGroup } = stateValues.update
      updateNode({ id, txt, link, opened, isGroup: Number(isGroup) }).then(ok).catch(ng)
      playAudio(AUDIOS.ETC.DECISION_22)
      emit('finish')
    }
    mainProcess()
  }

  // Delete
  const onClickDelete = () => {
    const mainProcess = async () => {
      // 内包するItemが存在しない場合
      if (about.value.progeniesCount === 0) {
        playAudio(AUDIOS.ETC.DECISION_22)
        popWindow('Main')
        windowMode.value = WINDOW_MODE.DELETE_NODE
        onClickOnlyThisItem()
      // 内包するItemが存在する場合
      } else {
        playAudio(AUDIOS.ETC.DECISION_22)
        windowMode.value = WINDOW_MODE.DELETE
        const option = { push: false, pop: true }
        const buttonId = await displayDialog(WINDOW_MODE.DELETE, option)
        switch (buttonId) {
        case 0:
        case 1: onClickCancel(); break
        case 8: onClickOnlyThisItem(); break
        case 9: onClickWithChildren(); break
        }
      }
    }

    // Delete -> Cancel
    const onClickCancel = () => {
      emit('finish')
      playAudio(AUDIOS.ETC.CYBER_04_1)
    }

    // Delete -> Only this
    const onClickOnlyThisItem = () => {
      const mainProcess = async () => {
        playAudio(AUDIOS.ETC.DECISION_22)
        windowMode.value = WINDOW_MODE.DELETE_NODE
        const option = { push: true, pop: true }
        const buttonId = await displayDialog(WINDOW_KIND.CONFIRM, option)
        switch (buttonId) {
        case 0:
        case 1: onClickCancel(); break
        case 2: onClickAccept(); break
        }
      }

      // Delete -> Only this -> Cancel
      const onClickCancel = () => {
        emit('finish')
        playAudio(AUDIOS.ETC.CYBER_04_1)
      }

      // Delete -> Only this -> OK
      const onClickAccept = () => {
        deleteSomething(deleteNode)
        playAudio(AUDIOS.ETC.DECISION_22)
      }
      mainProcess()
    }

    // Delete -> With children
    const onClickWithChildren = () => {
      const mainProcess = async () => {
        playAudio(AUDIOS.ETC.DECISION_22)
        windowMode.value = WINDOW_MODE.DELETE_TREE
        const option = { push: true, pop: true }
        const buttonId = await displayDialog(WINDOW_KIND.CONFIRM, option)
        switch (buttonId) {
        case 0:
        case 1: onClickCancel(); break
        case 2: onClickAccept(); break
        }
      }

      // Delete -> With children -> Cancel
      const onClickCancel = () => {
        emit('finish')
        playAudio(AUDIOS.ETC.CYBER_04_1)
      }

      // Delete -> With children -> OK
      const onClickAccept = () => {
        const mainProcess = async () => {
          playAudio(AUDIOS.ETC.DECISION_22)
          windowMode.value = WINDOW_MODE.DELETE_TREE_YES
          const option = { push: true, pop: true }
          await new Promise(resolve => setTimeout(resolve, 200))
          const buttonId = await displayDialog(WINDOW_KIND.CONFIRM, option)
          switch (buttonId) {
          case 0:
          case 1: onClickCancel(); break
          case 2: onClickAccept(); break
          }
        }

        // Delete -> With children -> OK -> Cancel
        const onClickCancel = () => {
          emit('finish')
          playAudio(AUDIOS.ETC.CYBER_04_1)
        }

        // Delete -> With children -> OK -> OK
        const onClickAccept = () => {
          const mainProcess = async () => {
            playAudio(AUDIOS.ETC.DECISION_22)
            windowMode.value = WINDOW_MODE.DELETE_TREE_YES_YES
            const option = { push: true, pop: true }
            await new Promise(resolve => setTimeout(resolve, 300))
            const buttonId = await displayDialog(WINDOW_KIND.CONFIRM, option)
            switch (buttonId) {
            case 0:
            case 1: onClickCancel(); break
            case 2: onClickAccept(); break
            }
          }

          // Delete -> With children -> OK -> OK -> Cancel
          const onClickCancel = () => {
            emit('finish')
            playAudio(AUDIOS.ETC.CYBER_04_1)
          }

          // Delete -> With children -> OK -> OK -> OK
          const onClickAccept = () => {
            deleteSomething(deleteTree)
            playAudio(AUDIOS.ETC.DECISION_22)
          }
          mainProcess()
        }
        mainProcess()
      }
      mainProcess()
    }
    mainProcess()
  }
  mainProcess()
}

// ドラッグ＆ドロップでItemをTeleportする関数
const teleportItemWithDnD = ({ cID, pID, idx }) => {
  return new Promise((resolve, reject) => {

    const mainProcess = async () => {
      playAudio(AUDIOS.ETC.DECISION_42)
      const option = { push: true, pop: true }
      const buttonId = await displayDialog(WINDOW_KIND.CONFIRM, option)
      switch (buttonId) {
      case 0:
      case 1: onClickCancel(); break
      case 2: onClickAccept(); break
      }
    }

    const onClickCancel = () => {
      emit('cancel')
      emit('finish')
      reject('Cancel')
    }

    const onClickAccept = () => {
      playAudio(AUDIOS.ETC.DECISION_22)
      movingTree({ cID, pID, idx })
        .then(() => {
          resolve(ok())
        })
        .catch((err) => {
          reject(ng(err))
        })
    }
    mainProcess()
  })
}

// Rootを変更する関数
const askChangeRoot = (id: string) => {
  playAudio(AUDIOS.ETC.DECISION_43)
  popWindow('some')
  changeRoot(id)
  return Promise.resolve()
  // displayMessageDialog('Invalid ID')
}

// Item または Branch を削除する関数
const deleteSomething = (method: DeleteNode | DeleteTree) => {
  const { id } = stateValues.delete
  method({ id }).then(ok).catch(ng)
}

// アイテムクリック／アイテム開閉を監視
watch(about, (newValue) => {
  if (newValue) {
    try {
      onClickItem()
    } catch (e) {
      console.error(e)
      popWindow('some')
      popWindow('some')
      popWindow('some')
      displayMessageDialog('Error occurred')
    }
  }
})

// Teleportイベントを監視
watch(() => teleportInfo.value.state, async (state) => {
  if (state === 'SENDABLE') {
    teleportInfo.value.state = 'SENDING'

    try {
      const { index, departure, destination } = teleportInfo.value

      if (departure.length === 16) {
        const idx = index
        const cID = departure
        const pID = destination
        windowMode.value = WINDOW_MODE.TELEPORT_THIS
        await teleportItemWithDnD({ cID, pID, idx })
        // await askChangeRoot(destination)
      } else {
        await askChangeRoot(destination)
      }
      resetTeleportInfo()
    } catch (err) {
      teleportInfo.value.state = 'PRESEND'
      console.log(err)
    }
  }
})

watch(() => modalWindows.value.length, (newValue) => {
  if (newValue === 0) emit('finish')
})
</script>

<style lang="scss" scoped>
.container {
  padding: 16px 24px 24px;

  .body {
    min-width: 260px;

    > * {
      width: 260px;
    }

    .title {
      font-size: 1.2rem;
      font-family: $fontFamily9;
      @include textStyleC;
    }

    p.info,
    pre.info {
      margin: 0 0 16px;
      color: $green-poison;
      font-family: $fontFamily3;
      font-size: 15px;
    }

    table {
      margin: 16px auto 0;
      overflow: visible;

      th {
        padding: 0 8px 0 0;
        text-align: left;
        font-family: $fontFamily5;
        font-size: 14px;
        font-weight: 600;
        color: $green-poison;
        @include unSelectable;
      }

      td {
        padding-left: 8px;
        padding-right: 8px;
        width: 19px;
        height: 24px;
        text-align: left;
        font-family: $fontFamily1;

        &:last-child {
          padding-right: 0;
        }

        .text {
          width: 156px;
          height: 24px;
          color: $textColor1;
          font-size: 14px;
          font-family: $fontFamily9;
          @include textStyleC;
        }

        .icon {
          font-size: 25px;
          height: 21px;
          width: 18px;
        }
      }
    }
  }

  .buttons {
    display: flex;
    justify-content: space-evenly;
    margin: 16px 0px 0px;
    transition: all .5s;

    .button {
      margin: 12px 0px 0;
    }

    .fade-move {
      transition: all 0.5s ease-out;
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: all 0.5s ease-out;
    }

    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }

    .fade-item {
      transition: all 0.8s ease-out;
      display: inline-block;
      margin-right: 10px;
    }

    .fade-enter-from {
      opacity: 0;
      transform: translateX(80px);
    }
    .fade-leave-to {
      opacity: 0;
      transform: translateX(-80px);
    }

    .fade-leave-active {
      position: absolute;
      left: 0;
      // display: none;
    }
  }
}
</style>
