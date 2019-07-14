<template>
  <div id="app">
    <header>
      <nav class="contain">
        <router-link :to="'/'" class="logo"> Paper<span>Won</span> </router-link>
        <router-link :to="'papers'"> Papers </router-link>
        <router-link :to="'topics'"> Topics </router-link>
        <router-link :to="'about'" class="push-right"> About Us </router-link>
      </nav>
    </header>
    <router-view />
  </div>
</template>

<style lang="scss">
  @import './_vars';
  @import './_global';

  header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: white;
    box-shadow: 0 0 5px 0 $c-shadow;
  }

  .logo {
    color: $c-prim;
    font-size: 20px;
    font-weight: bold;
    margin-right: 15px;

    span {
      color: $c-gray;
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

      &:hover {
        opacity: 0.7;
      }
    }

    a:not(.logo) {
      position: relative;
      display: inline-block;
      color: $c-font-l;
      font-weight: bold;
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
