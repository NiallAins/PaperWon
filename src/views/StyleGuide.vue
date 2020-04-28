<template>
  <div class="view-style-guide">
    <h1> Header 1 </h1>
    <h2> Header 2 </h2>
    <h3> Header 3 </h3>
    <h4> Header 4 </h4>

    <a> a link </a>

    <br/><br/>

    <a class="link-small"> a small link </a>

    <br/><br/>

    <p>
      Here is a paragraph fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text.
    </p>

    A sentence with a <em> word in Emphasis </em> and another <i class="sans"> word in sans-serif Italics </i>

    <br/><br/>

    Italics in an equations: <i>f</i>(<i>x,y</i>) = 5<i>x</i><sup>3</sup> + 2<i>y</i>

    <br/><br/>

    Fraction: <table class=\"frac\"><tr><td>15<i>x</i></td></tr><tr><td>2 + 5</td></tr></table>

    <br/><br/> 

    <div
      v-for="f in ['prim', 'sec', 'italic', 'math']"
      :class="['font', f]"
    > font-family $f-{{ f }}</div>

    <br/><br/>

    <div
      v-for="f in ['xs', 'sm', 'md', 'lg', 'title', 'title-exam', 'splash']"
      :class="['font-size', f]"
    > font-size $f-size-{{ f }}</div>

    <br/><br/>

    <a class="button"> A Button Link </a>

    <br/><br/>

    <button> A Button </button>

    <br/><br/>

    <button class="secondary"> A Secondary Button </button>

    <br/><br/>
    
    <button class="secondary active"> A Secondary Button Active </button>

    <br/><br/>
    
    <div style="position: relative; width: 100px; border: 1px solid gray; padding: 35px">
      button.close
      <button class="close"></button>
    </div>

    <br/><br/>

    <div class="row">
      <div
        class="color col-3"
        v-for="c in ['prim','prim-d','prim-dd','prim-l','prim-comp','highlight-1','highlight-2','highlight-3','highlight-4','error','border','bg','bg-d','bg-dd','font','font-l','logo-gray']"
      >
        <span :class="'c-' + c"></span> $c-{{ c }}
      </div>
    </div>
    
    <br/><br/>

    <div class="contain">
      <div class="row">
        <div class="col-1">col-1</div>
        <div class="col-1">col-1</div>
        <div class="col-1">col-1</div>
        <div class="col-1">col-1</div>
        <div class="col-1">col-1</div>
        <div class="col-1">col-1</div>
        <div class="col-1">col-1</div>
        <div class="col-1">col-1</div>
        <div class="col-1">col-1</div>
        <div class="col-1">col-1</div>
        <div class="col-1">col-1</div>
        <div class="col-1">col-1</div>
      </div>
      <div class="row">
        <div class="col-2">col-2</div>
        <div class="col-2">col-2</div>
        <div class="col-2">col-2</div>
        <div class="col-2">col-2</div>
        <div class="col-2">col-2</div>
        <div class="col-2">col-2</div>
      </div>
      <div class="row">
        <div class="col-3">col-3</div>
        <div class="col-3">col-3</div>
        <div class="col-3">col-3</div>
        <div class="col-3">col-3</div>
      </div>
      <div class="row">
        <div class="col-4">col-4</div>
        <div class="col-4">col-4</div>
        <div class="col-4">col-4</div>
      </div>
      <div class="row">
        <div class="col-6">col-6</div>
        <div class="col-6">col-6</div>
      </div>
      <div class="row">
        <div class="col-12">col-12</div>
      </div>
      <div class="row">
        <div class="col-4 col-off-1 content-right">col-4 col-off-1 content-right</div>
        <div class="col-4 push-right">col-4 push-right</div>
      </div>
      <div class="row">
        <div class="col-2 pad-h">col-2 pad-h</div>
        <div class="col-2 pad-v">col-2 pad-v</div>
        <div class="col-2 pad-t">col-2 pad-t</div>
        <div class="col-2 pad-b">col-2 pad-b</div>
        <div class="col-2 pad-l">col-2 pad-l</div>
        <div class="col-2 pad-r">col-2 pad-r</div>
      </div>
      <div class="row">
        <div class="col-2 no-pad">col-2 no-pad</div>
        <div class="col-2 no-pad-h">col-2 no-pad-h</div>
        <div class="col-2 no-pad-v">col-2 no-pad-v</div>
        <div class="col-2 no-pad-t">col-2 no-pad-t</div>
        <div class="col-2 no-pad-l">col-2 no-pad-l</div>
        <div class="col-2 no-pad-b">col-2 no-pad-b</div>
      </div>
      <div class="row">
        <div class="col">col (fits width of content)</div>
      </div>
    </div>

    <div class="contain">
      <div class="row">
        <div class="col-6">
          col-6 <br/>
          And more lines </br>
          of content
        </div>
        <div class="col-6">col-6</div>
      </div>
      <div class="row fill-height">
        <div class="col-6">
          <b>row.fill-height</b><br/>
          col-6 <br/>
          And more lines </br>
          of content
        </div>
        <div class="col-6">col-6</div>
      </div>
      <div class="row fill-height vert-center">
        <div class="col-6">
          <b>row.fill-height.vert-center</b><br/>
          col-6 <br/>
          And more lines </br>
          of content
        </div>
        <div class="col-6">col-6</div>
      </div>
      <div class="row no-pad-v">
        <div class="col-6">
          <b>row.no-pad-v</b><br/>
          col-6
        </div>
        <div class="col-6">col-6</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .contain {
    outline: 1px solid #f008;
    outline-offset: -1px;

    .row {
      outline: 1px solid #0f08;
      outline-offset: -1px;
    }

    .col, [class^="col-"] {
      outline: 1px solid #00f8;
      outline-offset: -1px;
    }
  }

  .font {
    width: 100%;

    &.prim { font-family: $f-prim; }
    &.sec { font-family: $f-sec; }
    &.math { font-family: $f-math; }
    &.italic { font-family: $f-italic; }
  }

  .font-size {
    padding-bottom: 6px;

    &.xs { font-size: $f-size-xs; }
    &.sm { font-size: $f-size-sm; }
    &.md { font-size: $f-size-md; }
    &.lg { font-size: $f-size-lg; }
    &.title { font-size: $f-size-title; }
    &.title-exam { font-size: $f-size-title-exam; }
    &.splash { font-size: $f-size-splash; }
  }

  .color {
    width: 100%;

    span {
      display: inline-block;
      padding: 20px;
      border-radius: 5px;
      vertical-align: middle;
    }

    .c-prim { background: $c-prim; }
    .c-prim-d { background: $c-prim-d; }
    .c-prim-dd { background: $c-prim-dd; }
    .c-prim-l { background: $c-prim-l; }
    .c-prim-comp { background: $c-prim-comp; }
    .c-highlight-1 { background: $c-highlight-1; }
    .c-highlight-2 { background: $c-highlight-2; }
    .c-highlight-3 { background: $c-highlight-3; }
    .c-highlight-4 { background: $c-highlight-4; }
    .c-error { background: $c-error; }
    .c-border { background: $c-border; }
    .c-bg { background: $c-bg; }
    .c-bg-d { background: $c-bg-d; }
    .c-bg-dd { background: $c-bg-dd; }
    .c-font { background: $c-font; }
    .c-font-l { background: $c-font-l; }
    .c-logo-gray { background: $c-logo-gray; }
  }
</style>