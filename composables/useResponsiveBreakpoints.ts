/**
 * レスポンシブブレークポイントを管理するcomposable
 *
 * @returns {object} デバイスサイズごとのブール値を持つオブジェクト
 */
export function useResponsiveBreakpoints() {
  const breakpoints = useBreakpoints({
    tablet: 640,
    laptop: 1024,
    desktop: 1280,
  })

  return {
    phone: breakpoints.smaller('tablet'),
    tablet: breakpoints.between('tablet', 'laptop'),
    laptop: breakpoints.between('laptop', 'desktop'),
    desktop: breakpoints.greater('desktop'),
  }
}
