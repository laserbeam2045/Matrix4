import { Ref } from 'vue'

// モーダルウィンドウを扱うモジュール
export default function useModalWindow() {
  const modalWindows: Ref<string[]> = useState('modalWindows', () => [])

  const pushWindow = (name: string) => modalWindows.value.push(name)

  const popWindow = (name?: string) => modalWindows.value.pop()

  return {
    modalWindows,
    pushWindow,
    popWindow,
  }
}
