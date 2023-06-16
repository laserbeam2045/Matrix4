import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  DocumentReference,
  DocumentData,
} from 'firebase/firestore'

import { User } from '@/composables/useUser'

export const useFirestore = () => {

  // ユーザーを取得する関数
  const fetchUser = async (uid: string): Promise<User | null> => {
    const db = getFirestore()
    const q = query(
      collection(db, 'users'),
      where('uid', '==', uid)
    )
    const querySnapshot = await getDocs(q)

    return new Promise((resolve) => {
      if (querySnapshot.empty) {
        resolve(null)
      } else {
        querySnapshot.forEach((doc) => {
          // console.table({ doc })
          const d = doc.data()
          // console.table({ d })
          resolve(doc.data() as User)
        })
      }
    })
  }

  type RegisterProps = { uid: string, codeName: string }
  type UpdateProps = { uid: string, email: string }
  type RegisterResponse = Promise<DocumentReference<DocumentData>>

  // ユーザーを登録する関数
  const registerUser = ({ uid, codeName }: RegisterProps): RegisterResponse => {
    const db = getFirestore()
    const now = new Date()
    const createdAt = now
    const updatedAt = now

    return addDoc(
      collection(db, 'users'), {
        uid,
        codeName,
        createdAt,
        updatedAt,
      }
    )
  }

  // ユーザーを更新する関数
  const updateUser = async ({ uid, email }: UpdateProps): Promise<void> => {
    const db = getFirestore()
    const now = new Date()
    const updatedAt = now

    const q = query(
      collection(db, 'users'),
      where('uid', '==', uid)
    )
    const querySnapshot = await getDocs(q)

    return new Promise((resolve) => {
      if (querySnapshot.empty) {
        resolve(null)
      } else {
        querySnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, {
            email,
            updatedAt,
          })
          resolve()
        })
        resolve()
      }
    })
  }

  return { fetchUser, registerUser, updateUser }
}
