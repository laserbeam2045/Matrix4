export type BookMark = {
  text: string
  id: string
}

export default () => {
  const bookMarks = useState<BookMark[]>('bookMarks', () => ([
    {
      text: 'ミラティブ学園',
      id: 'ozmkiRCEBnh7ZT83',
    },
    {
      text: 'HomeRoom',
      id: 'GEO0PuwvgrXdnXVx',
    },
    {
      text: '生物',
      id: 'SiEBuCsBGkm/UUUe',
    },
  ]))

  const deleteBookMark = (id: string) => {
    const index = bookMarks.value.findIndex(bookMark => bookMark.id === id)
    bookMarks.value.splice(index, 1)
  }

  const addBookMark = (record: BookMark) => {
    bookMarks.value.push(record)
  }

  return {
    bookMarks: readonly(bookMarks),
    deleteBookMark,
    addBookMark,
  }
}
