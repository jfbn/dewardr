<template>
  <div>
        <p>Currently showing {{ shownWards.length }} wards from {{matches.length}} games. Only displaying wards alive by minute {{ time / 60 }}.</p>   
  </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: ['matches', 'shownWards', 'time']

}
</script>

<style>

</style>