import symbols from '@/data/symbols';

export default {
  frac: {
    bind: function (el) {
      let parts = el.innerHTML.replace(/\<\//g, '&&').split('/');
      el.innerHTML =
        '<table class="frac"><tr><td>' + parts[0].replace(/\&\&/g, '</') + '</td></tr>' +
        '<tr><td>' + parts[1].replace(/\&\&/g, '</')  + '</td></tr></table>';
    }
  },

  symbol: {
    bind: function(el) {
      let symb = symbols[el.innerText];
      if (symb) {
        el.classList.add('symbol-' + el.innerText);
        el.innerHTML = '&#' + symb + ';';
      }
    }
  }
}