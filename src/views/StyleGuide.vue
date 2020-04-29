<template>
  <div class="view-style-guide">
    <div class="formatter">
      <h3> Equation Formatter </h3>
      <input v-model="eqin" @keyup="format()"/>
      <br/><br/>
      <div class="sample">
        Your equation is <span v-html="eqout"></span> here.
      </div>
      <br/>
      <button
        :class="['secondary', { 'active': forjson }]"
        @click="forjson = !forjson"
      > JSON Encode </button>
      <br/><br/>
      <textarea id="output" placeholder="code">{{
        forjson ? eqout.replace(/"/g, '\\"') : eqout
      }}</textarea>
    </div>

    <br/><br/>
    <h3> Style Guide </h3>
    <br/>

    <h1> Header 1 </h1>
    <h2> Header 2 </h2>
    <h3> Header 3 </h3>
    <h4> Header 4 </h4>

    <a class="link"> a link </a>

    <br/><br/>

    <a class="link-small"> a small link <i class="icon-next"></i></a>
    <br/>
    <a class="link-small"><i class="icon-prev"></i> another small link</a>

    <br/><br/>

    <p>
      Here is a paragraph fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text.
    </p>

    A sentence with a <em> word in Emphasis </em> and another <i> word in sans-serif Italics </i>

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

    <br/><br/><br/>
    <h3> Color Variables </h3>

    <div class="row">
      <div
        class="color col-3"
        v-for="c in ['prim','prim-d','prim-dd','prim-l','prim-comp','highlight-1','highlight-2','highlight-3','highlight-4','error','border','bg','bg-d','bg-dd','font','font-l','logo-gray']"
      >
        <span :class="'c-' + c"></span> $c-{{ c }}
      </div>
    </div>
    
    <br/><br/><br/>
    <h3> Layout classes </h3>
    <br/>

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

<script>
  export default {
    name: 'style-guide',
    data: function() {
      return {
        eqin: '',
        eqout: '',
        forjson: true
      }
    },
    created: function() {
      this.symbols = {
        "notequal": "&nbsp;&#8800;&nbsp;",
        "!=": "&nbsp;&#8800;&nbsp;",
        "\\\*": "&nbsp;&#215;&nbsp;",
        "divide": "&#247;",
        "greaterthanequal": "&#8805;",
        "lessthanequal": "&#8804;",
        "plusminus": "&#177;",
        "sum": "&#8721;",
        "infinity": "&#8734;",
        "follows": "&#8658;",
        "ln": "<span class=\"term\">ln</span>",
        "-": "&nbsp;&#8722;&nbsp;",
        "−": "&nbsp;&#8722;&nbsp;",
        "pi": "&#960;",
        "thetha": "&#952;",
        "integral": "&#8747;",
        "differential": "&#8706;",
        "notelement": "&nbsp;&#8713;&nbsp;",
        "element": "&nbsp;&#8712;&nbsp;",
        "intersection": "&nbsp;&#8745;&nbsp;",
        "union": "&nbsp;&#8746;&nbsp;",
        "notsubset": "&nbsp;&#8836;&nbsp;",
        "notsuperset": "&nbsp;&#8837;&nbsp;",
        "subset": "&nbsp;&#8834;&nbsp;",
        "superset": "&nbsp;&#8835;&nbsp;",
        "natural": "<span class=\"symbol\">&#8469;</span>",
        "real": "<span class=\"symbol\">&#8477;</span>",
        "integer": "<span class=\"symbol\">&#8484;</span>"
      };
    },
    methods: {
      format: function() {
        let str = this.eqin;
        let foundSymbols = [];
        for (let s in this.symbols) {
          str = str.replace(new RegExp(s, 'g'), (match, i) => {
            foundSymbols.push({ i: i, s: this.symbols[s] });
            return '$';
          });
        }
        foundSymbols = foundSymbols.sort((a, b) => a.i - b.i);
        str = str.split('');
        str = str.map(t => {
          if (t === '$') {
            return foundSymbols.shift().s;
          }
          if (t.match(/([a-z])/gi)) {
            return '<i>' + t + '</i>';
          }
          return t;
        });
        str.forEach((t, i) => {
          if (t === '^' && str[i + 1]) {
            str[i + 1] = '<sup>' + str[i + 1];
            for (let j = i + 1; true; j++) {
              if (str[j + 1] === ' ' || j === str.length - 1) {
                str[j] += '</sup>';
                break;
              }
            }
            str[i] = '';
          }
        });
        str.forEach((t, i) => {
          if (t === '/' && str[i + 1]) {
            for (let j = i + 1; true; j++) {
              if (str[j + 1] === ' ' || j === str.length - 1) {
                str[j] += '</td></tr></table>';
                break;
              }
            }
            for (let j = i; true; j--) {
              if (str[j - 1] === ' ' || j === 0) {
                str[j] = '<table class="frac"><tr><td>' + str[j];
                break;
              }
            }
            str[i] = '</td></tr><tr><td>';
          }
        });
        str = str.filter(t => t !== ' ');
        str = str.map(t => {
          if (t === '+' || t === '-' || t === '=') {
            return ' ' + t + ' ';
          } else {
            return t;
          }
        });
        str = '<span class="math">' + str.join('') + '</span>';
        this.eqout = str;
      }
    }
  }
</script>

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

  .formatter {
    padding-top: 20px;
    margin-bottom: 40px;

    textarea {
      display: block;
      border: 1px solid $c-border;
      font-family: "courier new";
      font-size: $f-size-sm;
      resize: none;
      height: 100px;
    }
    .sample {
      border: 1px solid $c-border;
    }

    pre, .sample {
      width: 400px;
      padding: $w-pad;
      min-height: 2em;
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