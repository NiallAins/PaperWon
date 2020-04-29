<template>
  <div class="comp-step-list">
    <ul :style="{ 'height': (steps.length * 4.5) + 'em' }">
      <li
        v-for="(text, i) in steps"
        :class="{ 'active': currentStep === i }"
        @click="$emit('input', i)"
      >
        <h3 v-html="text[0]"></h3>
        <p v-if="text[1]">
          <render-html>{{ text[1] }}</render-html>
        </p>
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
  $max-text-height: 100px;

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

      &:before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: -24px;
        width: 2px;
        background: $c-prim;
      }
      
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

      &:first-child h3:before {
        content: '';
        position: absolute;
        top: -20px;
        left: -25px;
        bottom: 50%;
        width: 4px;
        background-color: $c-bg;
      }

      &:last-child h3:before {
        content: '';
        position: absolute;
        top: 50%;
        left: -25px;
        bottom: -$max-text-height;
        width: 4px;
        background-color: $c-bg;
      }

      p {
        max-height: 0;
        line-height: 1.5;
        margin: 0;
        font-size: $f-size-md;
        opacity: 0;
        transition:
          opacity $l-trans,
          max-height $l-ani,
          padding-top $l-ani;
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
          max-height: $max-text-height;
          padding-top: $w-pad;
          transition:
            opacity #{$l-ani - 0.1s} ease 0.1s,
            max-height $l-ani,
            padding-top $l-ani;
        }
      }
    }
  }
</style>
