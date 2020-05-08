<template>
  <div class="view-rules">
    <h2>Rules for Logarithims</h2>
    <solution-ani
      :aniString="aniStrings[0]"
      :currentStep="aniSteps[0]"
      stepOver="aniSteps[0] = 0"
    ></solution-ani>
  </div>
</template>

<script>
  export default {
    name: 'rules',
    created: function() {
      this.aniStrings = [
        ''
      ];
      this.aniSteps = [0];
    },
    methods: function() {

    }
  }
</script>

<style scoped lang="scss">

</style>