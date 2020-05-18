<template>
    <b-form-input @change="$emit('fieldChanged', text)" v-model="text" placeholder="Enter Steam32 id here"></b-form-input>
</template>

<script>
  export default {
    data() {
      return {
        text: '63356630'
      }
    }
  }
</script>

<style>

</style>