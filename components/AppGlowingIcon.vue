<script setup lang="ts">

</script>

<template>
  <ul>
    <li style="--clr: #1877f2;">
      <a href="#">
        <AppFontAwesome icon-name="google" />
      </a>
    </li>
    <li style="--clr: #ff0000;">
      <a href="#">
        <AppFontAwesome icon-name="google" />
      </a>
    </li>
    <li style="--clr: #1da1f2;">
      <a href="#">
        <AppFontAwesome icon-name="google" />
      </a>
    </li>
    <li style="--clr: #c32aa3;">
      <a href="#">
        <AppFontAwesome icon-name="google" />
      </a>
    </li>
    <li style="--clr: #25d366;">
      <a href="#">
        <AppFontAwesome icon-name="google" />
      </a>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
ul {
  --bg: #222;
  position: relative;
  display: flex;
  justify-content: space-evenly;
  background: var(--bg);
  width: 80vw;
  transform: translateX(-25%);
  padding: 40px 20px;
  gap: 50px;

  > li {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.5s;

    &::before {
      content: '';
      position: absolute;
      inset: 30px;
      box-shadow:
        0 0 0 10px var(--clr),
        0 0 0 20px var(--bg),
        0 0 0 22px var(--clr);
      transition: 0.5s;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--bg);
      transform: rotate(45deg);
      transition: 0.5s;
    }

    &:hover {
      z-index: 10000 !important;
      transform: scale(0.75);

      &::before {
        inset: 0px;
      }

      > a {
        font-size: 3em;
        filter:
          drop-shadow(0 0 20px var(--clr))
          drop-shadow(0 0 40px var(--clr))
          drop-shadow(0 0 60px var(--clr));
      }
    }

    > a {
      position: relative;
      color: var(--clr);
      z-index: 10;
      font-size: 2em;
      transition: 0.5s;
    }
  }
}
</style>
