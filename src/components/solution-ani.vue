<template>
	<div
		class="comp-solution-ani"
		@keyup="keyListener($event)"
		@keydown="$event.keyCode === 16 ? shiftDown = true : ''"
		:tabindex="editing ? 0 : -1"
	>
		<div
			:class="[
				'equation-bg', { 
				'animation-off': animationOff,
				'frame-slow': frameSlow
			}]"
			:style="{ 'font-size': fontSize + 'px' }"
		>
			<div
				:class="['equation-contain', { 'editing': editing	}]"
				:style="{ 'height': height + 'px' }"
			>
				<span
					v-for="(term, i) in aniObject[step][frame]"
					:class="[
						'term',
						TYPES[term.type],
						CLASSES[term.class],
						term.color ? 'color-' + term.color : '',
						{
							'selected': selected === term || multiSelect.includes(i),
							'strike': term.strike,
							'hidden': term.show < 2,
							'show-edit': term.show === 1,
							'is-symbol': term.value && term.value.length > 1 && term.value[0] !== '&'
						}
					]"
					:style="{
						'top': term.y + 'em',
						'left': term.x + 'em',
						'width': (term.length || 1) + 'em',
						'font-size': fontSize + 'px'
					}"
					@mousedown="selectTerm(i)"
					v-html="term.value || ''"
				></span>
			</div>

			<div class="buttons" v-if="!demo">
				<button
					class="secondary"
					:disabled="step === 0"
					@click="replayStep()"> Replay </button>
				<button
					:class="['secondary', {'active': frameSlow }]"
					@click="frameSlow = !frameSlow"
				> Slow </button>
			</div>
		</div>


		<!-- Remove for production -->
			<span
				style="font-size: 10px; float: right"
				@click="editing = !editing"
			> Edit </span>
			<div class="controls" v-if="editing">
				<div>
					<button @click="encodeAnimation(aniObject, true)"> Log AniObject </button>
				</div>
				<div>
					<button
						:class="{ 'disabled': frame === 0 }"
						@click="frame--; selected = null;"
					> - </button>
					Frame {{ frame + 1 }} / {{ aniObject[step].length }}
					<button
						:class="{ 'disabled': frame === aniObject[step].length - 1 }"
						@click="frame++; selected = null;"
					> + </button>
					<button
						v-if="frame === aniObject[step].length - 1"
						@click="addFrame(); selected = null;"
					> Add Frame </button>
				</div>
				<div>
					<button
						:class="{ 'disabled': step === 0 }"
						@click="step--; selected = null;"
					> - </button>
					Step {{ step + 1 }} / {{ aniObject.length }}
					<button
						:class="{ 'disabled': step === aniObject.length - 1 }"
						@click="step++; selected = null;"
					> + </button>
					<button
						v-if="step === aniObject.length - 1"
						@click="addStep(); selected = null"
					> Add Step </button>
				</div>
				<div v-if="step !== 0 || frame !== 0">
					<button @click="deleteFrame()">
						Delete {{ aniObject[step].length === 1 ? 'Step' : 'Frame' }}
					</button>
					<br/></br>
				</div>
				<div>
					<button
						v-for="(termType, i) in TYPES"
						@click="addTerm(i)"
					>
						Add {{ termType }}
					</button>
				</div>
				<div class="edit-term" v-if="selected">
					<div>
						<button @click="editTerm('show', selected.show === 1 ? 2 : 1)">
							{{ selected.show === 1 ? 'Show' : 'Hide' }} Term
						</button>
						<button @click="deleteTerm(selected)"> Delete Term </button>
						<button @click="cloneTerm()"> Clone Term </button>
					</div>
					<div v-if="typeof selected.length !== 'undefined'">
						Length
						<input
							type="number"
							:value="selected.length"
							onfocus="this.select()"
							@input="editTerm('length', parseInt($event.target.value) || 0)"
						/>
					</div>
					<div v-if="typeof selected.value !== 'undefined'">
						<div class="colour-select">
							Color
							<span
								v-for="i in this.COLORS"
								@click="editTerm('color', i - 1)"
							></span>
						</div>
						<div>
							Styles:
							<span
								:class="{ 'active': selected.strike }"
								@click="editTerm('strike', selected.strike === 0 ? 1 : 0)"
							>
								strike
							</span>
							<span
								v-for="(cl, i) in CLASSES"
								:class="{ 'active': selected.class === i }"
								@click="editTerm('class', selected.class === i ? 0 : i)"
							>
								{{ cl.replace('-r', '-right') }}
							</span>
						</div>
					</div>
				</div>
			</div>
		<!-- -->
	</div>
</template>

<script>
	import animations from '@/data/animations';

	export default {
		name: 'solution-ani',
		props: {
			questionref: String,
			currentStep: Number,
			demo: Boolean
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

				// Remove for production
					selected: null,
					multiSelect: [],
					editing: false,
					shiftDown: false
				//
			}
		},
		created: function() {
			// Consts
			this.TYPES = ['char', 'bar', 'sqrt'];
			this.CLASSES = ['', 'sup', 'sup-r', 'sub-r', 'sub'];
			this.FRAMELENGTHFAST = 1000;
			this.FRAMELENGTHSLOW = 1800;
			this.COLORS = 5;
			this.MAXFONT = 20;
			// Remove for production
				this.NOSCROLL = e => [32, 38, 40].includes(e.keyCode) && e.preventDefault();
			//
		},
		mounted: function() {
			this.renderQuestion();
		},
		watch: {
			questionref: function() {
				this.renderQuestion();
			},

			// Remove for production
				editing: function(newVal) {
					clearInterval(this.frameInterval);
					this.step = this.currentStep;
					this.frame = 0;
					if (newVal) {
						window.addEventListener('keydown', this.NOSCROLL);
					} else {
						window.removeEventListener('keydown', this.NOSCROLL);
					}
				},
			//

			currentStep: function(newVal, oldVal) {
				if (this.editing) {
					return;
				}
				if (newVal > this.aniObject.length - 1) {
					this.step = this.aniObject.length - 1;
					this.frame = this.aniObject[this.step].length - 1;
				} else {
					let firstFrameDelay = 0;
					if (newVal > oldVal) {
						firstFrameDelay = this.FRAMELENGTHFAST;
					}
					let scaleChanged = this.setScale(newVal);
					if (scaleChanged) {
						firstFrameDelay += this.FRAMELENGTHFAST / 2;
					}
					setTimeout(() => {
						this.step = newVal;
						this.initStep(oldVal > newVal);
					}, firstFrameDelay);
				}
			}
		},
		methods : {
			renderQuestion: function() {
				let animationCode = animations[this.questionref];
				if (animationCode) {
					this.aniObject = this.decodeAnimation(animationCode);
				} else {
					this.aniObject = [[[]]];
					console.error('animation for question "' + this.questionRef + '" not found');
				}

				this.step = this.currentStep;

				this.animationOff = true;
				this.setScale(this.step);
				this.setHeight();
				this.initStep();
				setTimeout(() => this.animationOff = false);
			},

			// Remove for production
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
										this.editTerm('show', 2);
										this.editTerm('length', '++');
									}
									return;
								}
								case 40: {
									if (this.selected.type === 0) {
										this.editTerm('class', this.selected.class === 0 ? this.CLASSES.length - 1 : '--');
									} else if (this.selected.length <= 1) {
										this.editTerm('length', 0);
										this.editTerm('show', 1);
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
								case 8: this.editTerm('show', this.selected.show === 1 ? 2 : 1); break;
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
			//

			setScale: function(step) {
				let maxX = 0;
				this.aniObject[step].forEach(frame => {
					frame.forEach(term => {
						maxX = term.show === 2 ? Math.max(maxX, term.x) : maxX;
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
							.forEach(term => maxY = term.show === 2 ? Math.max(maxY, term.y) : maxY)
						)
					);
				this.height = this.MAXFONT * (maxY + 1);
			},


			//
			//	Terms - Remove all for production
			//
			
			addTerm: function(type, params = {}) {
				let prevFrame = this.getNextFrame(true);
				this.aniObject.forEach((step, si) => {
					step.forEach((frame, fi) => {
						let newTerm = {
							type: params.type || type,
							x: params.x || (this.selected ? this.selected.x + 1 : 0),
							y: params.y || (this.selected ? this.selected.y : 0),
							color: params.color || 0,
							class: params.class || 0,
							strike: params.strike || 0,
							show: 0
						}
						if (frame === prevFrame) {
							newTerm.show = 1;
						} else if (si > this.step || (si === this.step && fi >= this.frame)) {
							newTerm.show = 2;
						}
						if (type === 0) {
							newTerm.value = params.value || 'x';
						} else {
							newTerm.length = params.length || 1
						}
						frame.push(newTerm);
						if (si === this.step && fi === this.frame) {
							this.selected = frame[frame.length - 1];
						}
					});
				});
			},
			
			deleteTerm: function(term) {
				let termIndex = this.aniObject[this.step][this.frame].findIndex(t => t === term);
				this.aniObject.forEach((step, si) => {
					step.forEach((frame, fi) => {
						this.aniObject[si][fi].splice(termIndex, 1);
					});
				});
			},

			selectTerm: function(termIndex) {
				if (this.shiftDown) {
					if (this.multiSelect.length === 0 && this.selected) {
						this.multiSelect.push(
							this.aniObject[this.step][this.frame].findIndex(t => t === this.selected)
						);
					}
					let selectedIndex = this.multiSelect.indexOf(termIndex);
					if (selectedIndex === -1) {
						this.multiSelect.push(termIndex);
					} else {
						this.multiSelect.splice(selectedIndex, 1);
					}
					this.selected = this.aniObject[this.step][this.frame][this.multiSelect[0]] || null;
				} else {
					this.multiSelect = [];
					this.selected = this.aniObject[this.step][this.frame][termIndex];
				}
			},
			
			editTerm: function(property, value, term) {
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
								this.aniObject[this.step][this.frame][t]
							);
						});
						return;
					}
					
					term = this.selected;
				}
				
				if (term.show === 1 && property !== 'show') {
					return;
				}
				
				if (value === '++') {
					value = term[property] + 1;
				} else if (value === '--') {
					value = term[property] - 1;
				}
				term[property] = value;
				
				if (term.x < 0) {
					term.x = 0;
					return;
				}
				if (term.y < 0) {
					term.y = 0;
					return;
				}
				
				let termIndex = this.aniObject[this.step][this.frame].findIndex(t => t === term),
						prevFrame = this.getNextFrame(true),
						nextFrame = this.getNextFrame(),
						prevHidden = prevFrame && prevFrame[termIndex].show === 1,
						nextHidden = nextFrame && nextFrame[termIndex].show === 1;
				if (property === 'show') {
					if (value === 2) {
						if (prevFrame && prevFrame[termIndex].show === 0) {
							prevFrame[termIndex].show = 1;
						}
						if (nextFrame && nextFrame[termIndex].show === 0) {
							nextFrame[termIndex].show = 1;
						}
					} else {
						if (prevHidden) {
							prevFrame[termIndex].show = 0;
						}
						if (nextHidden) {
							nextFrame[termIndex].show = 0;
						}
					}
				} else {
					// Move all prev/next frames if term is first/last visible occurrence
					if (prevHidden || nextHidden) {
						this.aniObject.forEach((step, si) => {
							step.forEach((frame, fi) => {
								if (
									(prevHidden && (si < this.step || (si === this.step && fi < this.frame))) ||
									(nextHidden && (si > this.step || (si === this.step && fi > this.frame)))
								) {
									frame[termIndex][property] = term[property];
								}
							});
						});
					}
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


			//
			// Frames remove all for production
			//
			
			addFrame: function() {
				let newFrame = JSON.parse(JSON.stringify(this.aniObject[this.step][this.frame]));
				newFrame.forEach(term => {
					if (term.show === 1) {
						term.show = 0;
					}
				});
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


			//
			//	Steps
			//

			initStep: function(backwardStep = false) {
				clearInterval(this.frameInterval);
				this.frame = backwardStep ? this.aniObject[this.step].length - 1 : 0;
				if (!this.editing) {
					this.frameInterval = setInterval(() => {
						if (this.frame === this.aniObject[this.step].length - 1) {
							clearInterval(this.frameInterval);
							this.$emit('stepend', this.step);
						} else {
							this.frame++;
						}
					}, this.frameSlow ? this.FRAMELENGTHSLOW : this.FRAMELENGTHFAST);
				}
			},
			
			// Remove for production
				addStep: function() {
					this.addFrame();
					let newFrame = this.aniObject[this.step].pop();
					this.aniObject.push([newFrame]);
					this.step++;
					this.frame = 0;
				},
			//

			replayStep: function() {
				if (this.step > 0) {
					this.step--;
					this.frame = this.aniObject[this.step].length - 1;
					setTimeout(() => {
						this.step++;
						this.initStep();
					}, (this.frameSlow ? this.FRAMELENGTHSLOW : this.FRAMELENGTHFAST) * 1.5);
				}
			},


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
										type:   f[i + 1],
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
									term = {
										type:   f[i],
										x:      f[i + 2],
										y:      f[i + 3],
										color:  f[i + 4],
										strike: f[i + 5],
										class:  f[i + 6],
										show:   f[i + 7]
									}
									term[f[i] === '0' ? 'value' : 'length'] = f[i + 1];
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
									'P': '&#960;',	// Pi
									'E': '&#8800;',	// Not equal to
									'T': '&#952;',	// Thetha
									'-': '&#8722;', // Minus
									'I': '&#8734',	// Infinity
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
			
			// Remove for production
				encodeAnimation: function(aniObject, log) {
					let symbols = {
						'ln': 'N',			// Natural Log
						'log': 'L',			// Log base 10
						'&#960;': 'P',	// Pi
						'&#8800;': 'E',	// Not equal to
						'&#952;': 'T',	// Thetha
						'&#8722;': '-', // Minus
						'&#8734': 'I',	// Infinity
						'&#177;': 'M',	// Plus or minus
						'&#8804;': 'F',	// Less than or equal to
						'&#8805;': 'G',	// Greater than or equal to
					}
					let animation = aniObject
						.map(step =>
							step.map(frame =>
								frame.map(term => {
									if (term.show) {
										return [
											term.type,
											(term.type === 0 ? term.value : term.length),
											term.x,
											term.y,
											term.color,
											term.strike,
											term.class,
											term.show
										].map(v => {
											if (symbols[v]) {
												return symbols[v];
											} else if (typeof v === 'string' || v < 10) {
												return v;
											}
											return String.fromCharCode(v + (v > 35 ? 29 : 87));
										}).join('');
									}
									return '_' + term.type;
								}).join('')
							).join('|')
						).join('||');
					if (log) {
						console.log(animation);
					} else {
						return animation;
					}
				}
			}
		//
	};
</script>

<style scoped lang="scss">
	$c-strike: $c-error;

	.comp-solution-ani:focus {
		outline: none;
	}

	.equation-bg {
		position: relative;
		padding: 1em;
		border: 1px solid $c-border;
		font-family: $f-math;
		color: $c-font;
		background:
			linear-gradient($c-border, transparent 1px),
			linear-gradient(90deg, $c-border, transparent 1px);
		background-size: 1em 1em;
		transition:
			background-size $l-ani,
			font-size $l-ani,
			padding $l-ani;

		&.animation-off,
		&.animation-off .term {
			transition: none;
		}

		.buttons {
			position: absolute;
			bottom: $w-pad;
			right: $w-pad;

			button {
				margin-left: $w-pad;
			}
		}
	}

	.equation-contain {
		position: relative;
		white-space: nowrap;
		width: 100%;
	}

	.term {
		position: absolute;
		z-index: 1;
		display: inline-block;
		height: 1em;
		color: $c-font;
		line-height: 0.95;
		text-align: center;
		opacity: 1;
		transition: 
			top $l-ani,
			left $l-ani,
			color $l-ani,
			width $l-ani,
			opacity $l-ani,
			transform $l-ani,
			font-size $l-ani;

		.equation-bg.frame-slow & {
			transition: 
				top $l-ani-slow,
				left $l-ani-slow,
				color $l-ani-slow,
				width $l-ani-slow,
				opacity $l-ani-slow,
				transform $l-ani-slow,
				font-size $l-ani;
		}

		&.color-1 { color: $c-highlight-1; }
		&.color-2 { color: $c-highlight-2; }
		&.color-3 { color: $c-highlight-3; } 
		&.color-4 { color: $c-highlight-4; }
		$strike-fade: 20%;
		&.strike         { color: lighten($c-font, $strike-fade); }
		&.color-1.strike { color: lighten($c-highlight-1, $strike-fade); }
		&.color-2.strike { color: lighten($c-highlight-2, $strike-fade); }
		&.color-3.strike { color: lighten($c-highlight-3, $strike-fade); } 
		&.color-4.strike { color: lighten($c-highlight-4, $strike-fade); }
		
		&.bar:after {
			content: '';
			position: absolute;
			top: calc(50% - 1px);
			right: -1px;
			left: -1px;
			height: 2px;
			border-radius: 2px;
			background: $c-font;
		}
		
		&.char:after {
			content: '';
			position: absolute;
			top: calc(50% - 1px);
			left: -1px;
			right: -1px;
			z-index: 1;
			height: 2px;
			border-radius: 2px;
			background: $c-strike;
			opacity: 0;
			pointer-events: none;
			transition: opacity $l-ani;
		}

		&.char.strike:after {
			opacity: 1;
		}

		&.sub   { transform: scale(0.7) translate(-40%,  35%); }
		&.sup   { transform: scale(0.7) translate(-40%, -35%); }
		&.sub-r { transform: scale(0.7) translate( 40%,  35%); }
		&.sup-r { transform: scale(0.7) translate( 40%, -35%); }
		
		&.hidden,
		&.hidden.bar:after {
			opacity: 0;
			z-index: 0;
			pointer-events: none;
		}

		&.is-symbol {
			transform: scale(0.9);
			padding-right: 4%;
			line-height: 1;
		}
	}

	// Remove for production
		.equation-contain.editing {
			border-color: $c-prim;
			
			.term {
				user-select: none;
				transition-duration: 0.1s;
				cursor: pointer;
				
				&:hover {
					outline: 1px solid $c-prim;
					outline-offset: -2px;
				}
				
				&.selected {
					background: transparentize($c-prim, 0.8);
				}
					
				&.hidden.show-edit {
					display: inline-block;
					pointer-events: all;
					opacity: 0.3;
					
					&.bar:after {
						opacity: 0.3;
					}
				}
			}
		}

		.controls {
			font-size: $f-size-sm;

			button {
				padding: 5px 10px;
				border-radius: 0;
				border: 1px solid $c-border;
				margin: 0 5px;
				color: $c-font;
				font-size: 1em;
				background: $c-bg;
			}

			&>div {
				margin-top: 5px;
			}
			
			.edit-term {
				margin-top: 10px;
				
				div {
					margin-top: 10px;
				}
				
				&>div:not(:first-child) {
					padding-left: 10px;
				}
			}
			
			input[type=text],
			input[type=number] {
				width: 3em;
				padding: 3px;
				margin-left: 5px;
			}
			
			.colour-select span {
				display: inline-block;
				padding: 10px;
				border-radius: 100%;
				margin: 2px;
				vertical-align: sub;

				&:nth-child(1) { background: $c-font; }
				&:nth-child(2) { background: $c-highlight-1; }
				&:nth-child(3) { background: $c-highlight-2; }
				&:nth-child(4) { background: $c-highlight-3; }
				&:nth-child(5) { background: $c-highlight-4; }
			}
			
			span {
				font-size: 0.8em;
				padding: 0 4px;
				user-select: none;
				cursor: pointer;
				
				&.active {
					color: $c-prim;
					font-weight: bold;
				}
			}
		}
	//
</style>