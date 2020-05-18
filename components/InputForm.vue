<template>
  <div>
    <b-row>
        <b-col cols="4">
            <Input @fieldChanged="updateText"/>
        </b-col>
        <b-col>
            <b-button @click="$emit('buttonClicked', inputText)" variant="outline-secondary">Find wards</b-button>
        </b-col>
    </b-row>   
  </div>
</template>

<script>
import Input from './Input';

export default {
    data() {
        return {
            inputText: '63356630'           
        }
    },
    methods: {
        updateText(text) {
            console.log(text);
            this.inputText = text;
        } 
    },
    components: {
        Input,
    }

}
</script>

<style>

</style>