<template>
  <div
    id="app"
    :class="{ 'keyboard-control': keyboardControl }"
    @keyup="$event.key === 'Tab' ? keyboardControl = true : ''"
    @mouseup="keyboardControl = false"
  >
    <header>
      <nav class="contain">
        <router-link :to="'/'" class="logo"> Paper<span>Won</span> </router-link>
        <router-link :to="'papers'"> Papers </router-link>
        <router-link :to="'topics'"> Topics </router-link>
        <router-link :to="'about'" class="push-right"> About </router-link>
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
        keyboardControl: false
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
    background: white;
    @include shadow;
  }

  .logo {
    color: $c-prim;
    font-size: 20px;
    font-weight: bold;
    padding: 22px 10px;
    margin-right: 15px;

    span {
      color: $c-logo-gray;
      font-weight: normal;
      font-size: 15px;
      padding-left: 2px;
      text-transform: uppercase;
    }
  }

  nav {
    a {
      font-family: $f-sec;
      border-bottom: none;
    }

    a:not(.logo) {
      position: relative;
      display: inline-block;
      color: $c-font;
      padding: 0 20px;
      font-size: 16px;
      line-height: 70px;
      
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        height: 3px;
        background-color: $c-prim;
        width: 0;
        transition: all 0.2s $e-bounce;
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
