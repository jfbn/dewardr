<template>
  <div>
      <input v-model="inputText" placeholder="steam32 id"/>
      <button @click="$emit('buttonClicked', inputText)">Place sentry</button>
  </div>
</template>

<script>


export default {
    data() {
        return {
            inputText: '63356630'           
        }
    },
    methods: {
        
    }

}
</script>

<style>

</style>