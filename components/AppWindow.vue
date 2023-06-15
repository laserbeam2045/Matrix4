<script setup lang="ts">

</script>

<template>
  <fieldset v-center>
    <legend>AI</legend>
    <div class="foo">
      <h1>Artificial Intelligence</h1>
    </div>
  </fieldset>
</template>

<style lang="scss" scoped>
fieldset {
  z-index: 10;
  padding: 0 4px 4px;
  color: #42edf8;
    width: 700px;
    height: 375px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    border-radius: 12px;
    backdrop-filter: blur(3px);
    background-color: rgba(0,191,255, 0.204);
    box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    border: 1px rgba(255,255,255,0.4) solid;
    border-bottom: 1px rgba(120,120,120,0.35) solid;
    border-right: 1px rgba(120,120,120,0.35) solid;

  legend {
    padding: 0 16px;
    margin: 0 16px;
  }
}
</style>
