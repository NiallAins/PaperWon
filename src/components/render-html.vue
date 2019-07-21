<script>
  import Vue from 'vue';

  export default {
		name: 'render-html',
    render: function(createElement) {
      return createElement(Vue.compile(`<span>${this.$slots.default[0].text}</span>`));
    }
  }
</script>