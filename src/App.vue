<template>
  <div
    id="app"
    :class="{
      'keyboard-control': keyboardControl,
      'font-lg': fontLarge
    }"
    @keyup="$event.key === 'Tab' ? keyboardControl = true : ''"
    @mouseup="keyboardControl = false"
  >
    <header>
      <nav class="contain">
        <router-link :to="'/'" class="logo"> Paper<span>Won</span> </router-link>
        <router-link :to="'/papers'"> Papers </router-link>
        <router-link :to="'/topics'"> Topics </router-link>
        <router-link :to="'/definitions'"> Definitions </router-link>
        <button
          :class="['secondary', { 'active': fontLarge }]"
          @click="fontLarge = !fontLarge"
        >
          <span>A</span><span>A</span><span>A</span>
        </button>
        <router-link :to="'/about'" class="push-right"> About </router-link>
      </nav>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data: function() {
      return {
        keyboardControl: false,
        fontLarge: false
      }
    }
  }
</script>

<style lang="scss">
  header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: $z-header;
    width: 100%;
    background: $c-bg;
    @include shadow;
  }

  .logo {
    color: $c-prim;
    font-size: $f-size-lg;
    font-weight: bold;
    padding: 22px 10px;
    margin-right: 15px;

    span {
      padding-left: 2px;
      vertical-align: -6%;
      color: $c-logo-gray;
      font-weight: normal;
      font-size: $f-size-md;
      text-transform: uppercase;
    }
  }

  nav {
    max-width: $break-max;

    button.secondary {
      padding: 2px 5px;
      float: right;
      margin: 20px 0 0 20px;

      span:nth-child(1) {
        font-size: 17px;
      }
      span:nth-child(2) {
        font-size: 13px;
      }
      span:nth-child(3) {
        font-size: 10px;
      }
    }
    
    a {
      font-family: $f-sec;
      border-bottom: none;
    }

    a:not(.logo) {
      position: relative;
      display: inline-block;
      color: $c-font;
      padding: 0 20px;
      font-size: $f-size-md;
      line-height: 70px;
      
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        height: 3px;
        background-color: $c-prim;
        width: 0;
        transition: all $l-trans $e-bounce;
      }

      &:hover:after {
        width: 50%;
        left: 25%;
      }

      &.router-link-exact-active:after {
        width: 100%;
        left: 0;
      }
    }
  }
</style>
