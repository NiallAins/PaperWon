<template>
  <div class="comp-step-list">
    <ul>
      <li
        v-for="(t, index) in text"
        :class="{ 'active': value === index }"
        @click="$emit('input', index)"
      >
        <div v-html="t"></div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
  $list-ani: 0.4s;

  ul {
    list-style: none;
    padding: 0 14px;
    margin: 30px 0 30px 40px;
    position: relative;
    
    .caret {
      position: absolute;
      left: -19px;
      padding: 8px;
      border: 2px solid dodgerblue;
      border-radius: 100%;
    }
    
    li {
      position: relative;
      width: 66%;
      padding: 10px 0;
      cursor: pointer;
      
      div {
        color: #666;
        transform-origin: -24px 50%;
        transition:
          transform $list-ani,
          color $list-ani;
      }
      
      &:before {
        content: '';
        position: absolute;
        left: -24px;
        top: 0;
        bottom: 0;
        width: 2px;
        background-color: dodgerblue;
      }
      
      &:first-child:before {
        top: 50%;
      }
      
      &:last-child:before {
        bottom: 50%;
      }
      
      &:after {
        content: '';
        position: absolute;
        left: -30px;
        top: calc(50% - 7px);
        padding: 5px;
        background-color: dodgerblue;
        border: 2px solid dodgerblue;
        border-radius: 100%;
        transition:
          background-color $list-ani,
          left $list-ani,
          top $list-ani,
          padding $list-ani;
      }
      
      &:hover {
        div {
          color: black;
        }
        
        &:after {
          background-color: lighten(dodgerblue, 25%);
        }
      }
      
      &.active {
        div {
          transform: scale(1.3);
          color: black;
        }
        
        &:after {
          left: -33px;
          top: calc(50% - 9px);
          padding: 8px;
          background-color: white;
        }
      }
    }
  }
</style>

<script>
	export default {
		name: 'step-list',
    props: {
      value: Number,
      text: Array
    }
  }
</script>
