<template>
	<div
		:class="['comp-solution-ani', { 'animation-off': animationOff }]"
		:style="{ 'font-size': fontSize + 'px' }"
		@keyup="keyListener($event)"
		@keydown="$event.keyCode === 16 ? shiftDown = true : ''"
		:tabindex="editing ? 0 : -1"
	>
		<div class="equation-bg">
			<div
				:class="['equation-contain', { 'editing': editing	}]"
				:style="{ 'height': height + 'px' }"
				ondragover="
					event.preventDefault();
					event.dataTransfer.dropEffect = 'move';
				"
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
							'show-edit': term.show === 1
						}
					]"
					:style="{
						'top': term.y + 'em',
						'left': term.x + 'em',
						'width': (term.length || 1) + 'em'
					}"
					@mousedown="selectTerm(i)"
					:draggable="editing"
					dragstart="event.dataTransfer.effectAllowed = 'move'"
					@dragend="moveTerm($event)"
				>
					{{ term.value || '' }}
				</span>
			</div>
		</div>
		
		<div v-if="!hideedit">
		<br/>
		<button @click="editing = !editing"> Toggle Edit Mode </button>
		</div>
		<div class="controls" v-if="editing">
			<div>
				<button @click="console.log(encodeAnimation())"> Log AniObject </button>
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
							@click="editTerm('color', i)"
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
	</div>
</template>

<style scoped lang="scss">
	$c-strike: $c-error;

	.comp-solution-ani {
		transition: font-size $l-ani;

		&.animation-off,
		&.animation-off .term {
			transition: none;
		}
		
		&:focus {
			outline: none;
		}
	}

	.equation-bg {
		font-family: $f-math;
		color: $c-font-l;
		padding: 1em;
		border: 1px solid $c-border;
		background:
			linear-gradient($c-border, transparent 1px),
			linear-gradient(90deg, $c-border, transparent 1px);
		background-size: 1em 1em;
	}

	.equation-contain {
		position: relative;
		white-space: nowrap;
		width: 100%;
		
		table {
			border: none;
		}
	}

	.term {
		position: absolute;
		z-index: 1;
		display: inline-block;
		height: 1em;
		text-align: center;
		color: $c-font-l;
		font-weight: bold;
		opacity: 1;
		transition: 
			top $l-ani,
			left $l-ani,
			color $l-ani,
			width $l-ani,
			opacity $l-ani,
			font-size $l-ani;

		&.color-1 { color: $c-highlight-1; }
		&.color-2 { color: $c-highlight-2; }
		&.color-3 { color: $c-highlight-3; } 
		&.color-4 { color: $c-highlight-4; }
		$strike-fade: 20%;
		&.strike         { color: lighten($c-font-l, $strike-fade); }
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
			background: $c-font-l;
		}
		
		&.sub   { transform: scale(0.7) translate(-40%,  35%); }
		&.sup   { transform: scale(0.7) translate(-40%, -35%); }
		&.sub-r { transform: scale(0.7) translate( 40%,  35%); }
		&.sup-r { transform: scale(0.7) translate( 40%, -35%); }
		
		&.strike:after {
			content: '';
			position: absolute;
			top: calc(50% - 1px);
			left: -1px;
			right: -1px;
			z-index: 1;
			height: 2px;
			border-radius: 2px;
			background: $c-strike;
		}
		&.sub.strike:after,
		&.sup.strike:after, 
		&.sub-r.strike:after,
		&.sup-r.strike:after {
			content: unset;
		}
		
		&.hidden,
		&.hidden.bar:after {
			opacity: 0;
			z-index: 0;
			pointer-events: none;
		}
	}

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
				
				&:after {
					opacity: 0.3;
				}
			}
		}
	}

	.controls {
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
			width: 2em;
			padding: 3px;
			margin-left: 5px;
		}
		
		.colour-select span {
			display: inline-block;
			padding: 10px;
			border-radius: 100%;
			margin: 2px;
			vertical-align: sub;

			&:nth-child(1) { background: $c-font-l; }
			&:nth-child(2) { background: $c-highlight-1; }
			&:nth-child(3) { background: $c-highlight-2; }
			&:nth-child(4) { background: $c-highlight-3; }
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
</style>

<script>
	export default {
		name: 'solution-ani',
		props: {
			step: Number,
			animation: String,
			hideedit: Boolean
		},
		data: function() {
			return {
				aniObject: [[[]]],
				frame: 0,
				frameInterval: 0,
				selected: null,
				multiSelect: [],
				editing: false,
				shiftDown: false,
				animationOff: true,
				fontSize: 24,
				height: 100
			}
		},
		created: function() {
			// Consts
			this.TYPES = ['char', 'bar', 'sqrt'];
			this.CLASSES = ['', 'sup', 'sup-r', 'sub-r', 'sub'];
			this.FRAMELENGTH = 1000;
			this.COLORS = 4;
			
			if (this.animation) {
				this.aniObject = this.decodeAnimation();
			}
		},
		mounted: function() {
			this.setScale();
			this.initStep();
			setTimeout(() => this.animationOff = false);
		},
		watch: {
			editing: function(newVal) {
				clearInterval(this.frameInterval);
				this.step = 0;
				this.frame = 0;
			},
			step: function(newVal, oldVal) {
				this.initStep(oldVal > newVal);
			}
		},
		methods : {
			keyListener: function(event) {
				if (this.editing && this.selected) {
					if (this.shiftDown) {
						switch(event.keyCode) {
							// Backspace
							case 8: this.editTerm('strike', this.selected.strike ? 0 : 1); return;
							// Arrow keys
							case 37: this.editTerm('color', this.selected.color === 0 ? this.COLORS : '--'); return;
							case 39: this.editTerm('color', this.selected.color === this.COLORS ? 0 : '++'); return;
							case 38: this.editTerm('class', this.selected.class === this.CLASSES.length - 1 ? 0 : '++'); return;
							case 40: this.editTerm('class', this.selected.class === 0 ? this.CLASSES.length - 1 : '--'); return;
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
						} else {
							let length = parseInt(event.key);
							if (length) {
								this.editTerm('length', length);
							} else if (length === 0) {
								this.editTerm('length', 0);
								this.editTerm('show', 1);
							}
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

			setScale: function() {
				let maxX = 0,
						maxY = 0;
				this.aniObject.forEach((step, si) => {
					step.forEach(frame => {
						frame.forEach(term => {
							maxX = term.show === 2 ? Math.max(maxX, term.x) : maxX;
							maxY = term.show === 2 ? Math.max(maxY, term.y) : maxY;
						});
					});
				});
				this.fontSize = Math.floor(this.$el.clientWidth / (maxX + 2));
				this.height = this.fontSize * (maxY + 1);
			},

			// getScaledFont: function(step = this.step) {
			// 	let max = 0;
			// 	this.aniObject[step].forEach(frame => {
			// 		frame.forEach(term => {
			// 			max = term.show === 2 ? Math.max(max, term.x) : max;
			// 		});
			// 	});
			// 	return Math.floor(this.$el.clientWidth / (max + 2));
			// },

			// getMaxHeight: function() {
			// 	let max = 0;
			// 	this.aniObject.forEach((step, si) => {
			// 		let scale = this.getScaledFont(si);
			// 		step.forEach(frame => {
			// 			frame.forEach(term => {
			// 				max = Math.max(max, ((term.y + 1) * scale));
			// 			});
			// 		});
			// 	});

			// 	return max;
			// },


			//
			//	Terms
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
				Vue.set(this.aniObject);
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
			
			moveTerm: function(event) {
				if (this.editing && event.pageX !== 0 && event.pageY !== 0) {
					let gridSize = event.target.clientWidth;
					this.editTerm(
						'x',
						Math.floor((event.clientX - event.target.offsetParent.offsetLeft) / gridSize)
					);
					this.editTerm(
						'y',
						Math.floor((event.clientY - event.target.offsetParent.offsetTop) / gridSize)
					);
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
			// Frames
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
							this.$emit('stepEnd', this.step);
						} else {
							this.frame++
						}
					}, this.FRAMELENGTH);
				}
			},
			
			addStep: function() {
				this.addFrame();
				let newFrame = this.aniObject[this.step].pop();
				this.aniObject.push([newFrame]);
				this.step++;
				this.frame = 0;
			},


			//
			// Encoding
			//
			
			decodeAnimation(animation = this.animation) {
				return animation
					.split('||')
					.map(s => s
						.split('|')
						.map(f => {
							let frame = [];
							for (let i = 0; i < f.length; i += 8) {
								let term = {
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
										term[key] = code - (code > 96 ? 87 : (code > 64 ? 55 : 48));
									}
								}
								frame.push(term);
							}
							return frame;
						})
					);
			},
			
			encodeAnimation: function(aniObject = this.aniObject) {
				return aniObject
					.map(step =>
						step.map(frame =>
							frame.map(term =>
								[
									term.type,
									(term.type === 0 ? term.value : term.length),
									term.x,
									term.y,
									term.color,
									term.strike,
									term.class,
									term.show
								].map(v => {
									if (typeof v === 'string' || v < 10) {
										return v;
									}
									return String.fromCharCode(v + (v > 35 ? 55 : 87));
								}).join('')
							).join('')
						).join('|')
					).join('||')
			}
		}
	};
</script>