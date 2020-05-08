import animations from '@/data/animations';

export default {
  name: 'solution-ani',
  props: {
    questionref: String,
    currentStep: Number,
    mode: String
  },
  data: function() {
    return {
      aniObject: [[[]]],
      step: 0,
      frame: 0,
      frameSlow: false,
      frameInterval: 0,
      animationOff: true,
      fontSize: 20,
      height: 100,

      //!!DEV
      editing: false,
      selected: null,
      selecting: false,
      multiSelect: [],
      editFutureTerms: false,
      shiftDown: false
      //
    }
  },
  created: function() {
    // Consts
    this.TYPES = ['char', 'bar', 'sqrt'];
    this.CLASSES = ['', 'sup', 'sup-r', 'sub-r', 'sub', 'long'];
    this.FRAMELENGTHFAST = 1000;
    this.FRAMELENGTHSLOW = 1800;
    this.COLORS = 5;
    this.MAXFONT = 20;
    //!!DEV
    this.NOSCROLL = e => [32, 38, 40].includes(e.keyCode) && e.preventDefault();
    //!!
  },
  mounted: function() {
    this.renderQuestion();
  },
  watch: {
    questionref: function() {
      this.renderQuestion();
    },

    //!!DEV
    editing: function(newVal) {
      clearInterval(this.frameInterval);
      if (newVal) {
        window.addEventListener('keydown', this.NOSCROLL);
      } else {
        window.removeEventListener('keydown', this.NOSCROLL);
      }
    },
    //!!

    currentStep: function(newVal, oldVal) {
      let newScale = this.setScale(Math.min(newVal, this.aniObject.length - 1));
      this.animationOff = false;
      setTimeout(
        () => this.initStep(newVal),
        newScale ? this.FRAMELENGTHFAST / 2 : 0
      );
    }
  },
  methods : {
    renderQuestion: function() {
      if (this.mode === 'topics') {
        this.step = 0;
        this.frameSlow = true;
        this.aniObject = this.decodeAnimation(this.questionref);
      } else {
        let animationCode = animations[this.questionref];
        if (animationCode) {
          this.aniObject = this.decodeAnimation(animationCode);
        } else {
          this.aniObject = [[[]]];
          console.error('Animation for question "' + this.questionref + '" not found');
        }
        this.step = this.currentStep;
      }

      this.setScale(this.step)
      this.setHeight();
      this.initStep(this.step);
      setTimeout(() => this.animationOff = false);
    },

    //!!DEV
    keyListener: function(event) {
      if (this.editing && this.selected) {
        if (this.shiftDown) {
          switch(event.keyCode) {
            // Backspace
            case 8: this.editTerm('strike', this.selected.strike ? 0 : 1); return;
            // Arrow keys
            case 37: this.editTerm('color', this.selected.color === 0 ? this.COLORS : '--'); return;
            case 39: this.editTerm('color', this.selected.color === this.COLORS ? 0 : '++'); return;
            case 38: {
              if (this.selected.type === 0) {
                this.editTerm('class', this.selected.class === this.CLASSES.length - 1 ? 0 : '++');
              } else {
                this.editTerm('show', 1);
                this.editTerm('length', '++');
              }
              return;
            }
            case 40: {
              if (this.selected.type === 0) {
                this.editTerm('class', this.selected.class === 0 ? this.CLASSES.length - 1 : '--');
              } else if (this.selected.length <= 1) {
                this.editTerm('length', 0);
                this.editTerm('show', 0);
              } else {
                this.editTerm('length', '--');
              }
              return;
            }
            // Ctrl
            case 16: this.shiftDown = false; return;
          }
        }
        if (
          event.key.match(/^[^\"\[\]]$/i) &&
          event.keyCode !== 32 // spacebar
        ) {
          if (this.selected.type === 0) {
            this.editTerm('value', event.key);
          }
        } else {
          switch(event.keyCode) {
            // Backspace
            case 8: this.editTerm('show', this.selected.show ? 0 : 1); break;
            // Tab
            case 9: {
              event.preventDefault();
              let selectedIndex =
                  this.aniObject[this.step][this.frame]
                    .findIndex(t => t === this.selected);
              this.selected =
                this.aniObject[this.step][this.frame][selectedIndex + (this.shiftDown ? -1 : 1)] || 
                this.aniObject[this.step][this.frame][0];
              break;
            }
            // Arrow keys
            case 37: this.editTerm('x', '--'); break;
            case 39: this.editTerm('x', '++'); break;
            case 38: this.editTerm('y', '--'); break;
            case 40: this.editTerm('y', '++'); break;
          }
        }
      }
    },
    //!!

    setScale: function(step) {
      let maxX = 0;
      this.aniObject[step].forEach(frame => {
        frame.forEach(term => {
          maxX = term.show ? Math.max(maxX, term.x) : maxX;
        });
      });
      let newSize = Math.min(Math.floor(this.$el.clientWidth / (maxX + 2)), this.MAXFONT);
      if (newSize - this.fontSize < 0 || newSize - this.fontSize > 5) {
        this.fontSize = newSize;
        return true;
      }
    },

    setHeight: function() {
      let maxY = 0;
      this.aniObject
        .forEach(step => step
          .forEach(frame => frame
            .forEach(term => maxY = term.show ? Math.max(maxY, term.y) : maxY)
          )
        );
      this.height = this.MAXFONT * (maxY + 1);
    },

    //!!DEV
    //
    //	Terms
    //
    
    addTerm: function(type, params = {}) {
      let prevFrame = this.getNextFrame(true);
      this.aniObject[this.step].forEach((frame, fi) => {
        let newTerm = {
          type: params.type || type,
          x: params.x || (this.selected ? this.selected.x + 1 : 0),
          y: params.y || (this.selected ? this.selected.y : 0),
          color: params.color || 0,
          class: params.class || 0,
          strike: params.strike || 0,
          show: fi >= this.frame ? 1 : 0
        }
        if (type === 0) {
          newTerm.value = params.value || 'x';
        } else {
          newTerm.length = params.length || 1
        }
        frame.push(newTerm);
        if (fi === this.frame) {
          this.selected = frame[frame.length - 1];
        }
      });
    },
    
    deleteTerm: function(term) {
      let termIndex = this.aniObject[this.step][this.frame].findIndex(t => t === term);
      this.aniObject[this.step].forEach((frame, fi) => {
        this.aniObject[si][fi].splice(termIndex, 1);
      });
    },

    selectTerm: function(termIndex, dragging = false, e) {
      if (this.shiftDown) {
        if (this.multiSelect.length === 0 && this.selected) {
          this.multiSelect.push(
            this.aniObject[this.step][this.frame].findIndex(t => t === this.selected)
          );
        }
        let selectedIndex = this.multiSelect.indexOf(termIndex);
        if (selectedIndex === -1) {
          this.multiSelect.push(termIndex);
        } else if (!dragging) {
          this.multiSelect.splice(selectedIndex, 1);
        }
        this.selected = this.aniObject[this.step][this.frame][this.multiSelect[0]] || null;
      } else if (!dragging) {
        this.multiSelect = [];
        this.selected = this.aniObject[this.step][this.frame][termIndex];
      }
    },
    
    editTerm: function(property, value, term) {
      let curStep =  this.aniObject[this.step];

      // Values passed on to terms in multiple select edit
      if (!term) {
        if (this.multiSelect.length > 0) {
          if (property !== 'x' && property !== 'y') {
            if (value === '++') {
              value = this.selected[property] + 1;
            } else if (value === '--') {
              value = this.selected[property] - 1;
            }
          }
          this.multiSelect.forEach(t => {
            this.editTerm(
              property,
              value,
              curStep[this.frame][t]
            );
          });
          return;
        }
        
        term = this.selected;
      }
      
      // Increment, decrement conversions
      if (value === '++') {
        value = term[property] + 1;
      } else if (value === '--') {
        value = term[property] - 1;
      }
      let prevVal = term[property];
      term[property] = value;
      
      // Prevent un-encodeable negative values
      if (term.x < 0) {
        term.x = 0;
        return;
      }
      if (term.y < 0) {
        term.y = 0;
        return;
      }

      
      // If frame is first apperance of term, match changes for previous frames
      // Exception - previous hidden term has been repositioned by user for animation purposes
      let termIndex = curStep[this.frame].indexOf(term);
      if (this.frame !== 0 && curStep[this.frame - 1][termIndex].show === 0) {
        for (let i = 0; i < this.frame; i++) {
          let prevTerm = this.aniObject[this.step][i][termIndex];
          if (
            (property === 'x' || property === 'y') &&
            prevTerm[property] === prevVal
          ) {
            prevTerm[property] = term[property];
          }
        }
      }

      if (this.editFutureTerms) {
        curStep.forEach((frame, fi) => {
          if (fi > this.frame) {
            frame[termIndex][property] = term[property];
          }
        });
      }
    },
    
    cloneTerm: function() {
      let newParams = [];
      if (this.multiSelect.length > 0) {
        this.multiSelect.forEach(t => {
          newParams.push(
            JSON.parse(JSON.stringify(this.aniObject[this.step][this.frame][t]))
          )
        });
      } else {
        newParams.push(JSON.parse(JSON.stringify(this.selected)));
      }
      newParams.forEach(p => {
        p.y++;
        this.addTerm(p.type, p);
      });
      let termCount =
          this.aniObject[this.step][this.frame].length -
          this.multiSelect.length - 1;
      this.selected = this.aniObject[this.step][this.frame][termCount];
      this.multiSelect = this.multiSelect.map((t, i) => {
        return termCount + i;
      })
    },
    //!!

    //!!DEV
    // Frames
    //
    
    addFrame: function() {
      let newFrame = JSON.parse(JSON.stringify(this.aniObject[this.step][this.frame]));
      this.aniObject[this.step].push(newFrame);
      this.frame++;
    },
    
    deleteFrame: function(term) {
      if (this.aniObject[this.step].length === 1) {
        this.aniObject.splice(this.step, 1);
        this.step--;
      } else {
        this.aniObject[this.step].splice(this.frame, 1);
        if (this.frame !== 0) {
          this.frame--;
        }
      }
    },
    
    getNextFrame: function(
      previous = false,
      step = this.step,
      frame = this.frame
    ) {
      if (previous) {
        if (frame === 0 && step === 0) {
          return false;
        } else {
          return (
            this.aniObject[step][frame - 1] ||
            this.aniObject[step - 1][this.aniObject[step - 1].length - 1]
          );
        }
      } else {
        if (
          step === this.aniObject.length - 1 &&
          frame === this.aniObject[step].length - 1
        ) {
          return false;
        } else {
          return (
            this.aniObject[step][frame + 1] ||
            this.aniObject[step + 1][0]
          );
        }
      }
    },
    //!!


    //
    //	Steps
    //

    initStep: function(newStep) {
      clearInterval(this.frameInterval);
      this.animationOff = true;
      if (newStep > this.aniObject.length - 1) {
        this.step = this.aniObject.length - 1;
        this.frame = this.aniObject[this.step].length - 1;
      } else {
        this.frame = 0; //newStep >= this.step ? 0 : this.aniObject[newStep].length - 1;
        this.step = newStep;
      }
      //!!DEV
      if (this.editing) {
        return;
      }
      //!!
      if (this.mode === 'topics') {
        setTimeout(() => this.animate());
        this.frameInterval = setInterval(
          () => this.animate(),
          this.FRAMELENGTHSLOW
        );
      } else {
        this.frameInterval = setInterval(
          () => this.animate(),
          this.frameSlow ? this.FRAMELENGTHSLOW : this.FRAMELENGTHFAST
        );
      }
    },

    animate: function() {
      this.animationOff = false;
      if (this.frame === this.aniObject[this.step].length - 1) {
        clearInterval(this.frameInterval);
        this.animationOff = true;
        this.$emit('stepend', this.step);
        if (this.mode === 'topics') {
          this.step = 0;
          this.frame = 0;
        }
      } else {
        this.frame++;
      }
    },
    
    //!!DEV
    addStep: function() {
      this.addFrame();
      let newFrame = this.aniObject[this.step].pop();
      this.aniObject.push([newFrame]);
      this.step++;
      this.frame = 0;
      this.aniObject[this.step][0] = this.aniObject[this.step][0].filter(term => term.show)
      this.addFrame()
      this.frame = 1;
    },
    //


    //
    // Encoding
    //
    
    decodeAnimation(animation) {
      return animation
        .split('||')
        .map(s => s
          .split('|')
          .map(f => {
            let frame = [];
            for (let i = 0; i < f.length; i += 8) {
              let term;
              if (f[i] === '_') {
                term = {
                  type:   parseInt(f[i + 1]),
                  x:      0,
                  y:      0,
                  color:  0,
                  strike: 0,
                  class:  0,
                  show:   0
                }
                term[f[i + 1] === '0' ? 'value' : 'length'] = 0;
                i -= 6;
              } else {
                let short = f[i + 4] === '_';
                term = {
                  type:   f[i],
                  x:      f[i + 2],
                  y:      f[i + 3],
                  color:  short ? '0' : f[i + 4],
                  strike: short ? '0' : f[i + 5],
                  class:  short ? '0' : f[i + 6],
                  show:   short ? '1' : f[i + 7]
                }
                term[f[i] === '0' ? 'value' : 'length'] = f[i + 1];
                i -= short ? 3 : 0;
                for (let key in term) {
                  if (key !== 'value') {
                    let code = term[key].charCodeAt();
                    term[key] = code - (code > 96 ? 87 : (code > 64 ? 29 : 48));
                  }
                }
              }
              let symbols = {
                'N': 'ln',			// Natural Log
                'L': 'log',			// Log base 10
                'D': 'dx',			// dx
                'P': '&#960;',	// Pi
                'E': '&#8800;',	// Not equal to
                'T': '&#952;',	// Thetha
                '-': '&#8722;', // Minus
                "'": '&#8242;', // Derviative
                'F': '&#8734',	// Infinity
                'I': '&#8747;', // Integral
                'M': '&#177;',	// Plus or minus
                'F': '&#8804;',	// Less than or equal to
                'G': '&#8805;',	// Greater than or equal to
              }
              if (symbols[term.value]) {
                term.value = symbols[term.value];
              }
              frame.push(term);
            }
            return frame;
          })
        );
    },
    
    //!!DEV
    encodeAnimation: function(aniObject, log) {
      let symbols = {
        'ln': 'N',			// Natural Log
        'log': 'L',			// Log base 10
        'dx': 'D',			// dx
        '&#960;': 'P',	// Pi
        '&#8800;': 'E',	// Not equal to
        '&#952;': 'T',	// Thetha
        '&#8722;': '-', // Minus
        '&#8242;': "'", // Derviative
        '&#8734': 'F',	// Infinity
        '&#8747;': 'I', // Integral
        '&#177;': 'M',	// Plus or minus
        '&#8804;': 'F',	// Less than or equal to
        '&#8805;': 'G',	// Greater than or equal to
      }
      let animation = aniObject
        .map(step =>
          step.map((frame, fi) =>
            frame.map((term, ti) => {
              if (
                term.show ||
                (step[fi + 1] && step[fi + 1][ti].show) ||
                (step[fi - 1] && step[fi - 1][ti].show)
              ) {
                return [
                  term.type,
                  (term.type === 0 ? term.value : term.length),
                  term.x,
                  term.y,
                  term.color,
                  term.strike,
                  term.class,
                  term.show
                ].map((v, i) => {
                  if (symbols[v]) {
                    return symbols[v];
                  } else if (typeof v === 'string' || v < 10) {
                    return v;
                  }
                  return String.fromCharCode(v + (v > 35 ? 29 : 87));
                }).join('')
                  .replace(/(.{4})0001/, '$1_');
              } else {
                return '_' + term.type;
              }
            }).join('')
          ).join('|')
        ).join('||');
      if (log) {
        console.log(animation);
      } else {
        return animation;
      }
    }
    //!
  }
};