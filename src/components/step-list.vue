<template>
  <div class="comp-step-list">
    <ul>
      <li
        v-for="(text, i) in steps"
        :class="{ 'active': currentStep === i }"
        @click="$emit('input', i)"
      >
        <div>
          <h3 v-html="text[0]"></h3>
          <p v-if="text[1]">
            <render-html>{{ text[1] }}</render-html>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import stepData from '@/data/steps';
  import renderHtml from '@/components/render-html'

	export default {
		name: 'step-list',
    components: {
      'render-html': renderHtml
    },
    props: {
      questionref: String, 
      value: Number,
    },
    data: function() {
      return {
        currentStep: 0,
        steps: []
      }
    },
    created: function() {
      this.renderQuestion();
    },
    watch: {
      questionref: function() {
        this.renderQuestion();
      },

      value: function(newVal) {
        if (newVal > this.steps.length - 1) {
          this.currentStep = this.steps.length - 1;
        } else {
          this.currentStep = newVal;
        }
      }
    },
    methods: {
      renderQuestion: function() {
        this.steps = stepData[this.questionref];
        this.currentStep = this.value;
      }
    }
  }
</script>

<style scoped lang="scss">
  ul {
    list-style: none;
    padding: 0 $w-pad;
    margin: 0 0 0 25px;
    position: relative;
    
    .caret {
      position: absolute;
      left: -19px;
      padding: 8px;
      border: 2px solid $c-prim;
      border-radius: 100%;
    }
    
    li {
      position: relative;
      padding: 10px 0;
      cursor: pointer;
      
      div {
        h3 {
          margin: 0;
          color: $c-font-l;
          transform-origin: -24px 50%;
          transform: scale(0.76);
          transition:
            transform $l-ani,
            color $l-ani;

          // List point
          &:after {
            content: '';
            position: absolute;
            left: -30px;
            top: calc(50% - 7px);
            padding: 5px;
            background-color: $c-prim;
            border: 2px solid $c-prim;
            border-radius: 100%;
            transition:
              background-color $l-trans,
              left $l-ani,
              top $l-ani,
              padding $l-ani;
          }
        }

        p {
          //overflow: hidden;
          max-height: 0;
          margin: 0;
          padding: 0 0 0 $w-pad;
          font-size: $f-size-md;
          opacity: 0;
          transition:
            opacity $l-ani,
            max-height $l-ani,
            padding-top $l-ani;
        }
      }
      
      // Left Border
      &:before {
        content: '';
        position: absolute;
        left: -24px;
        top: 0;
        bottom: 0;
        width: 2px;
        background-color: $c-prim;
      }
      &:first-child:before {
        top: 50%;
      }
      &:last-child:before {
        bottom: 50%;
      }
      
      &:hover h3 {
        color: $c-font;
      
        &:after {
          background-color: $c-bg;
        }
      }
      
      &.active {
        h3 {
          transform: scale(1);
          color: $c-font;

          &:after {
            left: -33px;
            top: calc(50% - 9px);
            padding: 8px;
            background-color: $c-bg;
          }
        }

        p {
          opacity: 1;
          max-height: 100px;
          padding-top: $w-pad;
        }
      }
    }
  }
</style>
