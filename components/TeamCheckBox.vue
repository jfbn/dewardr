<template>
  <div>
    <b-form-checkbox
      :id="'checkbox-'+team"
      v-model="status"
      name="checkbox-1"
      value="accepted"
      unchecked-value="not_accepted"
      @change="$emit('teamChanged', team)"
    >
      {{team}}
    </b-form-checkbox>    
  </div>
</template>

<script>
  export default {
    data() {
      return {
        status: 'accepted',
        
      }
    },
    props: ['team'],
  }
</script>