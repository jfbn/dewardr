<template>
  <div>
    <label for="range-2">Time</label>
    <b-form-input id="range-2" @change="$emit('sliderChanged', value)" v-model="value" type="range" min="0" max="90" step="5"></b-form-input>
    <div class="mt-2">{{ value }}</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value: '5'
      }
    }
  }
</script>