<template>
  <div id="app">
    <Canvas />
    <!--<div id="footer">
      <span>GS Labeler | bb</span>
    </div>-->
  </div>
</template>

<script>
import Canvas from './components/Canvas.vue'

export default {
  name: 'app',
  components: {
    Canvas,
  }
}
</script>

<style>
#app {
  width: 90%;
  margin: 0px auto;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

</style>
