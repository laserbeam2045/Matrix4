// DBから取得したレコードの型定義
type Record = {
  path: string
  fileName: string
  extension: string
  volume: number
  label: string
}

// Audioインスタンスを辞書式に管理するためのオブジェクトの型定義
type Data = {
  [key: string]: {
    audio: object
    record: object
  }
}

type State = {
  error: object | null
}

// storeを作成する関数(一度だけ実行されます)
export default function useAudio() {
  const config = useRuntimeConfig()
  const API_PATH = config.public.API_PATH
  const ASSETS_PATH = config.public.ASSETS_PATH

  const data = useState('audioData', () => ({})) as Ref<Data>
  const isSoundOn = useState('isSoundOn') as Ref<boolean>

  const state: State = reactive({
    error  : null,
  })

  // エラーをコンソールで監視する
  watch(() => state.error, e => console.error(e))

  /**
   * 引数(=ラベル)のデータが存在しないときにTrueを返す関数
   * @param label 対象のAudioのラベル
   */
  const isNotExists = (label: string): boolean => (
    data.value[label] === undefined
  )

  /**
   * 引数のAudioインスタンスが、再生可能な状態のときにTrueを返す関数
   * @param audio Audioインスタンス
   */
  const isReady = (audio: HTMLAudioElement) => (
    audio?.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA
  )

  // APIリクエストの前処理を行う関数
  const labels2csv = (input: string | Array<string> | object) => {
    if (typeof(input) === 'string') {
      // まだ引数(=ラベル)のデータが存在しなければ、引数をそのまま返す
      return isNotExists(input) ? input : null
    } else
    if (Array.isArray(input)) {
      // データが存在しないラベルに絞った文字列(csv)または、空文字を返す
      return input.filter(label => isNotExists(label)).join(',')
    } else
    if (typeof(input) === 'object') {
      // データが存在しないラベルに絞った文字列(csv)または、空文字を返す
      return Object.values(input).filter(label => isNotExists(label)).join(',')
    } else {
      state.error = Error('Unexpected argument.')
    }
  }

  /**
   * audio要素を作り、再生の準備をする関数
   * @param audioData DBから取得したレコード
   * @return          Audioインスタンス
   */
  const createAudio = (audioData: Record) => {
    const { path, fileName, extension, volume } = audioData
    if (fileName === 'AlanWalker') {
      const paths = `${ASSETS_PATH}/audios/etc/AlanWalker.mp3`
      const audio = new Audio(paths)
      audio.volume = volume
      audio.load()
      return audio
    }
    const paths = `${ASSETS_PATH}/audios/${path}${fileName}.${extension}`
    const audio = new Audio(paths)
    audio.volume = volume
    audio.load()
    return audio
  }

  /**
   * 指定されたラベルのaudioを返す関数
   * @param label     取得するAudioのラベル
   * @param execLoad  Audioが存在しない時にloadするかどうか
   * @return {object | null}
   */
  const getAudio = async (label: string, execLoad = false): Promise<object | null> => {
    if (data.value[label]) {
      return data.value[label].audio
    } else if (execLoad) {
      alert(label)
      await loadAudio(label)
      return getAudio(label, false)
    } else {
      alert(label)
      return null
    }
  }

  /**
   * サーバーからfilePathを取得し、データを読み込む関数
   * @param {string | array | object} labels ロードするAudioのラベル
   */
  const loadAudio = async (labels: string | Array<string> | object): Promise<void> => {
    const audioLabels: string | null | undefined = labels2csv(labels)
    if (audioLabels) {
      try {
        const url = `${API_PATH}/audios/select/index.php`
        const option = { audioLabels }
        const result = await useFetch(url, { params: option })
        JSON.parse(result.data.value as string).forEach((record: Record) => {
          const audio = createAudio(record)
          data.value[record.label] = { audio, record }
        })
      } catch (e) {
        state.error = e
      } finally {
        // state.loading = false
      }
    }
  }

  /**
   * 効果音を再生する関数
   * @param label ラベル
   */
  const playAudio = async (label: string): Promise<void> => {
    if (!isSoundOn.value) return Promise.resolve()

    const audio = await getAudio(label, true)

    return new Promise((resolve) => {
      if (audio instanceof Audio) {
        // 再生可能ならば再生させる
        if (isReady(audio)) {
          audio.currentTime = 0
          audio.muted = false
          audio.play()
          // const { record } = data.value[label]
          // const nextAudio = createAudio(record as Record)
          // data.value[label] = {
          //   record,
          //   audio: nextAudio,
          // }
          // nextAudio.muted = true
          // nextAudio.play()
          resolve()
        } else {
          audio.addEventListener('canplaythrough', function fn() {
            audio.removeEventListener('canplaythrough', fn)
            audio.currentTime = 0
            audio.muted = false
            audio.play()
            // const { record } = data.value[label]
            // const nextAudio = createAudio(record as Record)
            // data.value[label] = {
            //   record,
            //   audio: nextAudio,
            // }
            // nextAudio.muted = true
            // nextAudio.play()
            resolve()
          })
        }
      } else {
        state.error = Error(`Audio error(${label})`)
        resolve()
      }
    })
  }

  /**
   * 効果音を停止する関数
   * @param label 停止するAudioのラベル
   */
  const stopAudio = async (label: string): Promise<void> => {
    if (!isSoundOn.value) return Promise.resolve()

    const audio = await getAudio(label, false)

    return new Promise((resolve) => {
      if (audio instanceof Audio) {
        // audio.pause()
        audio.muted = true
        resolve()
      } else {
        state.error = Error(`Audio error(${label})`)
        resolve()
      }
    })
  }

  const AUDIOS = {
    // Quiz系
    QUIZ: {
      // QUESTION    : 'QUIZ_QUESTION',
      QUESTION    : 'DECISION_5',
      COUNT_DOWN  : 'QUIZ_COUNT_DOWN',
      PRESS_BUTTON: 'QUIZ_PRESS_BUTTON',
      CORRECT     : 'QUIZ_CORRECT',
      WRONG       : 'QUIZ_WRONG',
    },
    // // Avalon系
    // AVALON: {
    //   DROP_MOVE: 'AVALON_DROP_MOVE',
    //   COMBO_1  : 'AVALON_COMBO_1',
    //   COMBO_2  : 'AVALON_COMBO_2',
    //   COMBO_3  : 'AVALON_COMBO_3',
    //   COMBO_4  : 'AVALON_COMBO_4',
    //   COMBO_5  : 'AVALON_COMBO_5',
    //   COMBO_6  : 'AVALON_COMBO_6',
    //   COMBO_7  : 'AVALON_COMBO_7',
    //   COMBO_8  : 'AVALON_COMBO_8',
    //   COMBO_9  : 'AVALON_COMBO_9',
    //   COMBO_10 : 'AVALON_COMBO_10',
    //   COMBO_11 : 'AVALON_COMBO_11',
    //   COMBO_12 : 'AVALON_COMBO_12',
    //   COMBO_13 : 'AVALON_COMBO_13',
    //   COMBO_14 : 'AVALON_COMBO_14',
    //   COMBO_15 : 'AVALON_COMBO_15',
    //   COMBO_16 : 'AVALON_COMBO_16',
    //   COMBO_17 : 'AVALON_COMBO_17',
    //   COMBO_18 : 'AVALON_COMBO_18',
    // },
    // その他
    ETC: {
      AlanWalker : 'AlanWalker',
      ETC_BOOT   : 'ETC_BOOT',
      ETC_TYPE   : 'ETC_TYPE',
      POP_1      : 'POP_1',
      POP_2      : 'POP_2',
      POP_3      : 'POP_3',
      WARNING_1  : 'WARNING_1',
      WARNING_2  : 'WARNING_2',
      WARNING_3  : 'WARNING_3',
      CYBER_02_1 : 'CYBER_02_1',
      CYBER_03_2 : 'CYBER_03_2',
      CYBER_04_1 : 'CYBER_04_1',
      CYBER_05_1 : 'CYBER_05_1',
      CYBER_05_2 : 'CYBER_05_2',
      CYBER_05_3 : 'CYBER_05_3',
      CYBER_06_3 : 'CYBER_06_3',
      CYBER_06_4 : 'CYBER_06_4',
      CYBER_14_1 : 'CYBER_14_1',
      CYBER_15_1 : 'CYBER_15_1',
      CYBER_15_2 : 'CYBER_15_2',
      CYBER_15_3 : 'CYBER_15_3',
      CYBER_15_4 : 'CYBER_15_4',
      CYBER_16_1 : 'CYBER_16_1',
      CYBER_16_2 : 'CYBER_16_2',
      CYBER_17_1 : 'CYBER_17_1',
      CYBER_17_2 : 'CYBER_17_2',
      CYBER_18_1 : 'CYBER_18_1',
      CYBER_18_2 : 'CYBER_18_2',
      CYBER_21_1 : 'CYBER_21_1',
      CYBER_21_2 : 'CYBER_21_2',
      DECISION_1 : 'DECISION_1',
      DECISION_2 : 'DECISION_2',
      DECISION_3 : 'DECISION_3',
      DECISION_4 : 'DECISION_4',
      DECISION_5 : 'DECISION_5',
      DECISION_6 : 'DECISION_6',
      DECISION_7 : 'DECISION_7',
      DECISION_8 : 'DECISION_8',
      DECISION_9 : 'DECISION_9',
      DECISION_21: 'DECISION_21',
      DECISION_22: 'DECISION_22',
      DECISION_23: 'DECISION_23',
      DECISION_24: 'DECISION_24',
      DECISION_25: 'DECISION_25',
      DECISION_26: 'DECISION_26',
      DECISION_27: 'DECISION_27',
      DECISION_30: 'DECISION_30',
      DECISION_33: 'DECISION_33',
      DECISION_34: 'DECISION_34',
      DECISION_35: 'DECISION_35',
      DECISION_37: 'DECISION_37',
      DECISION_40: 'DECISION_40',
      DECISION_41: 'DECISION_41',
      DECISION_42: 'DECISION_42',
      DECISION_43: 'DECISION_43',
      DECISION_46: 'DECISION_46',
    },
    // 英単語
    // const ENGLISH = {
    //   abandon: {
    //     id: 'sound-english-a-abandon',
    //     filePath: 'voice/a/abandon.mp3',
    //   },
    //   able: {
    //     id: 'sound-english-a-able',
    //     filePath: 'voice/a/able.mp3',
    //   },
    //   abroad: {
    //     id: 'sound-english-a-abroad',
    //     filePath: 'voice/a/abroad.mp3',
    //   },
    // }
  }

  return {
    AUDIOS,
    loadAudio,
    playAudio,
    stopAudio,
  }
}

// type LoadAudio = {
//   (labels: string | Array<string> | object): Promise<void>
// }
// type PlayAudio = {
//   (label: string): Promise<void>
// }
// type StopAudio = {
//   (label: string): Promise<void>
// }
