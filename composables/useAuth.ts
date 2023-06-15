import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase/auth'

export const useAuth = () => {
  const loginWithAnonymously = async () => {
    const auth = getAuth()

    try {
      await signInAnonymously(auth)
      console.log('%clogin', 'color: green')
    } catch (err) {
      console.error(err)
    }
  }

  const getUid = () => new Promise((resolve) => {
    const auth = getAuth()

    onAuthStateChanged(auth, (user) => {
      resolve(user?.uid)
    })
  })

  return { loginWithAnonymously, getUid }
}
