export default () => {
  const isSupportTouch = useState('isSupportTouch', () => false)

  const mouseTouchEvent = computed(() => ({
    CLICK: isSupportTouch.value ? 'click'      : 'click',
    START: isSupportTouch.value ? 'touchstart' : 'mousedown',
    MOVE : isSupportTouch.value ? 'touchmove'  : 'mousemove',
    END  : isSupportTouch.value ? 'touchend'   : 'mouseup',
    LEAVE: isSupportTouch.value ? 'touchleave' : 'mouseleave',
  }))

  const dragEvent = computed(() => ({
    DRAGGING: isSupportTouch.value ? 'touchmove' : 'drag',
    DRAG_END: isSupportTouch.value ? 'touchend' : 'dragend',
  }))

  const client = useState('client')

  if (client.value === 'client') {
    if (document && 'ontouchend' in document) {
      isSupportTouch.value = true
    }
  }

  return {
    isSupportTouch,
    mouseTouchEvent,
    dragEvent,
  }
}
