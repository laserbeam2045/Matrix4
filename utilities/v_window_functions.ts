/**
 * window.promptをPromiseでラップした関数
 * @param text 表示する文言
 */
export const promptPromise = (text: string, value = ''): Promise<string> => (
  new Promise((resolve, reject) => {
    const result = window.prompt(text.replace(/ {2}/g, ''), value)
    if (result !== null) {
      resolve(result)
    } else {
      reject  // FIXME: エラーハンドリング
      // reject(new Error('User cancelled'))
    }
  })
)
