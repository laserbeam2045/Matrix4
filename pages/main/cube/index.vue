<script lang="ts">
export default {
  layout: 'the-matrix',
}
</script>

<script setup lang="ts">
const { setInfo } = useMatrix()

const { mouseTouchEvent } = useEvent()

const size = ref(25)

const a1 = ref(1)
// const n = ref(Math.floor(Math.random() * 8) + 3)
const d = ref(1)

// const a1 = ref(10)
const n = ref(10)
// const d = ref(0)

type Index = {
  x: number
  y: number
  z: number
  c: number
}

const getCoordinates = () => {
  let array = []
  let prevIndices: Index[] = [
    { x: 0, y: 0, z: -1, c: 0 },
  ]

  let an = a1.value

  for (let z = 0; z < n.value; z++) {
    const currentIndices = [...prevIndices.map(obj => ({ ...obj, z: obj.z + 1 }))]

    for (let i = z ? 0 : 1; i < an; i++) {
      let rand = 0
      let direction = 0
      let box: Index = { x: 0, y: 0, z: 0, c: 0 }
      let newBox: Index = { x: 0, y: 0, z: 0, c: 0 }
      do {
        rand = Math.floor(Math.random() * currentIndices.length)
        box = currentIndices[rand]
        direction = Math.floor(Math.random() * 2)
        newBox = {
          x: box.x + direction,
          y: box.y + (1 - direction),
          z: z,
          c: 0,
        }
      } while (
        2 <= box.c ||
        (direction === 0) && (newBox.x >= 1) && !currentIndices.some(foo => ((newBox.y === foo.y) && (newBox.x - 1 === foo.x))) ||
        (direction === 1) && (newBox.y >= 1) && !currentIndices.some(bar => ((newBox.x === bar.x) && (newBox.y - 1 === bar.y))) ||
        currentIndices.some(fizz => fizz.x === newBox.x && fizz.y === newBox.y)
      )
      currentIndices[rand].c++
      currentIndices.push(newBox)
    }

    array = [...array, ...currentIndices]

    an = an + d.value

    prevIndices = currentIndices
  }

  return array
}

const matrixes = computed(() => {
  return coordinates.value.map((obj, index) => ({
    x: size.value * obj.y,
    y: size.value * obj.z - size.value * index,
    z: size.value * obj.x,
    X: obj.x,
    Y: obj.y,
    Z: obj.z,
  }))
})

const coordinates = ref([])

const maxX = computed(() => matrixes.value.sort((one, two) => two.X - one.X)[0].X)
const maxY = computed(() => matrixes.value.sort((one, two) => two.Y - one.Y)[0].Y)
const maxZ = computed(() => matrixes.value.sort((one, two) => two.Z - one.Z)[0].Z)
const maxIndex = computed(() => Math.max(Math.max(maxX.value, maxY.value), maxZ.value))

const buttons = computed(() => {
  const answer = coordinates.value.length

  switch (Math.floor(Math.random() * 3)) {
  case 0 : return [answer, answer + a1.value * 1, answer + a1.value * 2]
  case 1 : return [answer - a1.value * 1, answer, answer + a1.value * 1]
  default: return [answer - a1.value * 2, answer - a1.value * 1, answer]
  }
})

const remake = (num) => {
  if (num === coordinates.value.length) {
    setInfo('Cool!')

    setTimeout(() => {
      setTimeout(() => {
        a1.value = Math.floor(Math.random() * 10) + 1
        n.value = Math.floor(Math.random() * 8) + 3
        d.value = a1.value === 1 ? 1 : 0
        coordinates.value = getCoordinates()
      }, 2000)
      setInfo('How many cubes?')
    }, 2000)
  } else {
    setInfo('Nope')
  }
}

const rotateX = ref(-30)
const rotateY = ref(45)

const key = ref(null)
const focus = () => key.value.focus()

onMounted(() => {
  const { setInfo } = useMatrix()

  setInfo('How many cubes?')

  setTimeout(() => {
    coordinates.value = getCoordinates()
  }, 2100)
})
</script>

<template>
  <div
    v-if="matrixes.length"
    class="the_cube"
    @click="focus"
  >
    <div class="box_container">
      <div class="cube_container" :style="`transform: rotateX(${rotateX}deg) rotateY(${rotateY}deg);`">
        <div
          v-for="(matrix, index) in matrixes"
          :key="`${index}`"
          class="list-complete-item"
          :style="{ transform: `translate3d(-${matrix.x}px, ${matrix.y}px, ${matrix.z}px)` }"
        >
          <AppCube :size="size" :animation="false" />
        </div>
        <!-- <div
          class="list-complete-item"
          :style="{ transform: `translate3d(-${maxIndex * size}px, ${- size * (matrixes.length + (maxIndex - maxZ))}px, ${size * ((maxIndex) / 2)}px)` }"
        >
          <AppCubeTwo
            :size="size * (maxIndex + 1)"
            :animation="false"
          />
        </div> -->
      </div>
      <!-- <div class="foo" :style="`--maxX: ${(maxX+0) * size}px; --maxY: ${(maxY+0) * size}px; --maxZ: ${(maxZ+0) * size}px;`">
        <div class="bottom_outer">
          <div class="bottom_inner" />
        </div>
      </div> -->
    </div>
    <div class="button_box">
      <!-- {{ maxX }}: {{ maxY }}: {{ maxZ }}
      {{ rotateX }} : {{ rotateY }} -->
      <!-- <AppInputKey
        ref="key"
        @keydown.up="rotateX--"
        @keydown.left="rotateY++"
        @keydown.right="rotateY--"
        @keydown.down="rotateX++"
      /> -->
      <AppButton
        v-for="num in buttons"
        :key="num"
        class="mx-4"
        @[`${mouseTouchEvent.END}Passive`]="remake(num)"
      >
        {{ num }}
      </AppButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.the_cube {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.8s ease-out;
  overflow: hidden;

  .box_container {
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;

    .cube_container {
      // position: absolute;
      // transform: rotateX(var(--rotateX)) rotateY(var(--rotateY));
      width: 0;
      height: 50%;
      // z-index: 12;
      transform-style: preserve-3d;
      transition: all 0.8s ease-out;

      .list-complete-item {
        transition: all 0.8s ease-out;
        transform-style: preserve-3d;
      }
    }

    // .foo {
    //   display: none;
    //   position: absolute;
    //   top: 10vh;
    //   // bottom: 0px;
    //   height: 110vh;
    //   perspective: 100vh;
    //   transform: rotateX(-90deg) translateY(500px) translateZ(-10vh);
    //     transform-style: preserve-3d;
    //       transition: all 0.8s ease-out;
    //   .bottom_outer {
    //       transition: all 0.8s ease-out;
    //     // perspective: 500px;
    //     transform-style: preserve-3d;
    //     // display: none;
    //   transform: rotateX(-30deg) rotateY(0deg) rotateZ(0deg);
    //   z-index: -12;

    //     .bottom_inner {
    //       transition: all 0.8s ease-out;
    //       // width: 25%;
    //       // height: calc((var(--maxX) + 23px) * 2);
    //       width: 60vw;
    //       height: 110vh;
    //       background: orange;
    //       transform-style: preserve-3d;
    //       transform: rotateX(90deg) translateX(calc(var(--maxY) * -0.5)) translateY(calc(var(--maxX) * -0.5)) translateZ(calc(var(--maxZ) * 0px));
    //     }
    //   }
    // }
  }

  .button_box {
    position: fixed;
    bottom: 50px;
  }
}
</style>
