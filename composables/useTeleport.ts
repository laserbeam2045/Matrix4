import { Ref } from 'vue'

export type TeleportState = 'PRESEND' | 'SENDABLE' | 'SENDING' | 'SENT'

export type TeleportInfo = {
  state: TeleportState
  index: number
  departure: string
  destination: string
  departureTxt: string
  destinationTxt: string
}

export default () => {
  const teleportInfo: Ref<TeleportInfo> =
    useState('teleportInfo', () => ({
      state: 'PRESEND',
      index: -1,
      departure: '',
      destination: '',
      departureTxt: '',
      destinationTxt: '',
    }))

  const isSendable = computed(() => {
    if (
      teleportInfo.value.state === 'PRESEND' &&
      teleportInfo.value.destination.length === 16
    ) {
      return true
    }
    return false
  })

  const resetTeleportInfo = () => {
    teleportInfo.value.state = 'PRESEND'
    teleportInfo.value.index = -1
    teleportInfo.value.departure = ''
    teleportInfo.value.destination = ''
    teleportInfo.value.departureTxt = ''
    teleportInfo.value.destinationTxt = ''
  }

  return {
    teleportInfo,
    isSendable,
    resetTeleportInfo,
  }
}
