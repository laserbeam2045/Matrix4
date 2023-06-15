export default () => {
  const matrix = useState('matrix', () => ({
    info: {
      text: '',
      time: new Date(),
    },
    isLoading: false,
  }))

  const setInfo = (info: string) => {
    matrix.value.info.text = info
    matrix.value.info.time = new Date()
  }

  const setLoading = (flag: boolean) => {
    matrix.value.isLoading = flag
  }

  return {
    matrix: readonly(matrix),
    setInfo,
    setLoading,
  }
}
