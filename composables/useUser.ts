export interface User {
  uid: string
  codeName: string
  createdAt: {
    seconds: number
    nanoseconds: number
  }
  updatedAt: {
    seconds: number
    nanoseconds: number
  }
}

export default () => {
  const user = useState('user', () => ({
    uid: '',
    codeName: '',
    createdAt: {
      seconds: 0,
      nanoseconds: 0,
    },
    updatedAt: {
      seconds: 0,
      nanoseconds: 0,
    },
  }))

  const setUid = (uid: string) => user.value.uid = uid

  const setCodeName = (codeName: string) => user.value.codeName = codeName

  const setUser = (payload: User) => user.value = payload

  return {
    user: readonly(user),
    setUid,
    setCodeName,
    setUser,
  }
}
