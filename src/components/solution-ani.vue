<template>
	<div
		class="comp-solution-ani"
		:style="{
			fontSize: fontSize + 'px'
		}"
		ref="container"
	>
		<div class="equation-contain">
			<span
				class="term"
				v-for="t in terms"
				:class="[
					'color-' + t.color,
					{
						sup: t.sup,
						denom: t.vPos > 0,
						numer: t.vPos < 0,
						removed: t.removed,
						overlay: t.overlay
					}
				]"
				:style="{
					left: t.pos + 'em',
					top: t.vPos + 'em',
					zIndex: t.z,
					fontSize: fontSize + 'px'
				}"
			>
				{{ t.value }}
			</span>
			<span
				class="strike"
				v-for="s in strikes"
				:class="{
					open: s.open,
					removed: s.removed
				}"
				:style="{
					left: s.pos + 'em',
					top: s.vPos + 'em',
					width: s.span + 'em',
					height: s.vSpan + 'em',
					fontSize: fontSize + 'px'
				}"
			>
			</span>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import '../_vars.scss';

	$c-grid: #bbb;;
	$ani-length: 0.7s;
	$max-font: 24px;

	.comp-solution-ani {
		transition: all $ani-length;
		font-family: "Courier";
		color: $c-font;
		padding: calc(2em - 2px) 1em;
		box-sizing: border-box;
		height: $max-font * 5;
		background:
			linear-gradient($c-grid, transparent 1px),
			linear-gradient(90deg, $c-grid, transparent 1px);
		background-size: 1em 1em;
		border: 1px solid $c-grid;
	}

	.equation-contain {
		position: relative;
		white-space: nowrap;
	}

	.term {
		position: absolute;
		transition: all $ani-length;
		top: 0;
		display: inline-block;
		width: 1em;
		height: 1em;
		text-align: center;
		
		&.removed {
			opacity: 0;
		}
		
		&[class^="color"] {
			font-weight: bold;
		}

		&.color-1 {
			color: dodgerblue;
		}
		
		&.color-2 {
			color: deeppink;
		}
		
		&.color-3 {
			color: limegreen;
		}
		
		&.color-4 {
			color: orangered;
		}
		
		&:after {
			content: '';
			transition: background-color 0.1s ease-in $ani-length / 2;
			position: absolute;
			left: 0;
			bottom: calc(-0.5em - 4px);
			width: 1em;
			height: 2px;
			background-color: #fff0;
		}
		
		&:before {
			content: '';
			position: absolute;
			transition: all 0s;
			left: 0;
			top: calc(-0.5em + 2px);
			width: 1em;
			height: 2px;
			background-color: #fff0;
		}
		
		&.numer:after {
			transition: background-color 0.1s ease-in $ani-length / 2;
			background-color: $c-font;
		}
		
		&.denom:before {
			transition: background-color 0.1s ease-in $ani-length / 2;
			background-color: $c-font;
		}
		
		&.sup {
			transform: scaleY(0.7);
			margin-top: -0.3em;;
			
			&.numer:after {
				transform: scaleY(1.43);
				margin-bottom: -0.9em;
			}
			
			&.denom:before {
				transform: scaleY(1.43);
				margin-top: 0.05em;
			}
		}
	}

	.strike {
		position: absolute;
		background:
			linear-gradient(
			8deg,
			transparent calc(50% - 1px), #f44 50%, #f44 calc(50% + 1px), transparent calc(50% + 2px)
			) no-repeat;
		transition:
			background-size $ani-length,
			opacity $ani-length;
		background-size: 0% 100%;
		background-position: 3px 3px;
	
		&.open {
			background-size: 100% 100%;
		}
		
		&.removed {
			opacity: 0;
		}
	}
</style>

<script>
	export default {
		name: 'solution-ani',
		props: {
			expression: String,
			keyframes: Array,
			step: Number
		},
		data: function() {
			return {
				terms: [],
				strikes: [],
				aniLength: 700,
				aniWait: 800,
				fontSize: 24,
				maxFont: 24
			}
		},
		watch: {
			step: function(newVal, oldVal) {
				if (newVal > oldVal) {
					this.animate(this.keyframes[this.step - 1]);
				}
			}
		},
		mounted : function() {
			this.addTermsFromString(this.expression);
			this.scaleFont();
		},
		methods: {
			// Creates term objects for a standard maths equation string
			addTermsFromString(str, pos = 0, vPos = 0, color = 0) {
				str = this.cleanEquation(str);
				let terms = this.extractTerms(str);
				
				terms.forEach(t => {
					t.color = color;
					t.pos += pos;
					t.vPos += vPos;
				});
				
				this.addTerms(terms);
			},
			
			// Encode special characters
			cleanEquation: function(str) {
				return str.replace(/\s/g, '').replace(/sqrt/g, '√');
			},
			
			// Pull term objects from string
			extractTerms: function(str) {
				let terms = [],
						isSup = false,
						pos = 0,
						isDenom = 0
				for(let i = 0; i < str.length; i++) {
					// Powers
					if (str[i] === '^') {
						str = str.substring(0, i) + str.substring(i + 1);
						isSup = true;
						i--;
					}
					// Fractions
					else if (str[i] === '/') {
						str = str.substring(0, i) + str.substring(i + 1);
						i--;
						let numerLength = this.getTermLength(str, i, true),
								denomLength = this.getTermLength(str, i + 1);
						if (terms[terms.length - 1].value === ')') {
							terms.pop();
							terms.splice(terms.length - numerLength + 1, 1);
							numerLength -= 2;
							pos -= 2;
							for (let j = 0; j < numerLength; j++) {
								terms[terms.length - 1 - j].pos--;
							}
						}
						if (str[i + 1] === '(') {
							str =
								str.substring(0, i + 1) +
								str.substring(i + 2, i + denomLength) +
								str.substring(i + denomLength + 1);
							denomLength -= 2;
						}
						for (let j = 0; j < numerLength; j++) {
							terms[terms.length - 1 - j].vPos -= 1;
						}
						isDenom = denomLength;
						pos -= numerLength;
						// Center align fraction
						let center = Math.floor(Math.abs(numerLength - denomLength) / 2);
						if (numerLength < denomLength) {
							for (let j = 0; j < numerLength; j++) {
								terms[terms.length - 1 - j].pos += center;
							}
						} else {
							pos += center;
						}
					} else {
						terms.push({
							value: str[i],
							pos: pos,
							vPos: isDenom ? 1 : 0,
							sup: isSup,
							color: 0,
							removed: false,
							z: 0
						});
						if (isDenom > 0) {
							isDenom--;
						}
						if (isSup) {
							isSup = false;
						}
						pos++;
					}
				}
				return terms;
			},
			
			// Gets length of number, number with variables, or bracketed terms
			getTermLength: function(str, start, reverse = false) {
				let nest = 0,
						endTerm = 0,
						i = start;
				for(; reverse ? i >= 0 : i < str.length; reverse ? i-- : i++) {
					if (str[i] === '(') {
						nest++;
					} else if (str[i] === ')') {
						nest--;
					} else if (nest === 0 && str[i].match(/[^0-9a-z√]/i)) {
						return Math.abs(start - i);
					}
				}
				return Math.abs(start - i);
			},
			
			// Interpret animation step as input string and perform
			animate(steps) {
				stageLoop:
					for(let i = 0; i <= steps.length; i++) {
						if (i === steps.length) {
							if (this.step === this.keyframes.length) {
								this.$emit('animationComplete')
							} else {
								this.$emit('stepComplete');
							}
						} else {
							let params = steps[i].split(',');
							switch (params[0]) {
								// Wait
								case 'w': {
									let remainingSteps = steps.slice(i + 1);
									setTimeout(() => this.$nextTick(() => {
										this.animate(remainingSteps);
									}), params[1] ? parseInt(params[1]) : this.aniWait);
									break stageLoop;
								}
								// Add
								case 'a': {
									let pos = params[2].split('/');
									this.addTermsFromString(params[1], parseInt(pos[0]), parseInt(pos[1] || 0), params[3]);
									this.scaleFont();
									break;
								}
								// Move
								case 'm': {
									let length = params[1].split(':')[1],
											pos = params[1].split(':')[0].split('/'),
											diff = parseInt(params[2].split('/')[0]),
											vDiff = parseInt(params[2].split('/')[1] || 0),
											terms = this.getTerms(
												parseInt(pos[0]),
												typeof length === 'undefined' ? length : parseInt(length),
												typeof pos[1] === 'undefined' ? pos[1] : parseInt(pos[1]),
												typeof length === 'undefined'
											);
									this.moveTerms(terms, diff, vDiff);
									this.scaleFont();
									break;
								}
								// Remove
								case 'r': {
									let pos = params[1].split('/');
									let terms = this.getTerms(
										parseInt(pos[0]),
										parseInt(params[2]),
										typeof pos[1] === 'undefined' ? pos[1] : parseInt(pos[1]),
									);
									this.removeTerms(terms);
									this.scaleFont();
									break;
								}
								// Color
								case 'c': {
									let pos = params[1].split('/');
									let terms = this.getTerms(
										parseInt(pos[0]),
										parseInt(params[2]),
										typeof pos[1] === 'undefined' ? pos[1] : parseInt(pos[1])
									);
									this.colorTerms(terms, parseInt(params[3]));
									break;
								}
								// Strike
								case 's': {
									this.strikes.push({
										pos: parseInt(params[1].split('/')[0]),
										vPos: parseInt(params[1].split('/')[1] || 0),
										span: parseInt(params[2].split('/')[0]),
										vSpan: parseInt(params[2].split('/')[1] || 1),
										open: false,
										removed: false
									});
									let strike = this.strikes[this.strikes.length - 1];
									setTimeout(() => this.$nextTick(() => strike.open = true), 10);
									break;
								}
							}
						}
					}
				// /stageLoop
			},
											
			// Returns terms given position parameters
			getTerms: function(posStart, length = -1, vert, allZ = false) {   
				let terms = [];
				this.terms.forEach(t => {
					if (t.pos >= posStart && (length === -1 || t.pos < posStart + length)) {
						if (typeof vert === 'undefined' || t.vPos === vert) {
							if (t.z < 0 && !allZ) {
								t.z++;
							} else {
								terms.push(t);
							}
						}
					}
				});
				this.strikes.forEach(s => {
					if (s.pos >= posStart && (length === -1 || s.pos < posStart + length)) {
						if (typeof vert === 'undefined' || s.vPos === vert) {
							terms.push(s);
						}
					}
				});
				return terms;
			},
			
			addTerms: function(terms) {
				this.getTerms(terms[0].pos, terms.length, terms[0].vPos, true)
						.forEach(t => t.z -= terms.indexOf(t) === -1 ? 1 : 0);
				terms.forEach(t => {
					t.removed = true;
					this.terms.push(t);
					setTimeout(() => this.$nextTick(() => t.removed = false), this.aniLength / 2);
				});
			},
			
			moveTerms: function(terms, diff, vDiff) {
				this.getTerms(terms[0].pos + diff, terms.length, terms[0].vPos + diff, true)
						.forEach(t => t.z -= terms.indexOf(t) === -1 ? 1 : 0);
				terms.forEach(t => {
					t.pos += diff;
					t.vPos += vDiff;
				});
			},
			
			removeTerms: function(terms) {
				terms.forEach(t => {
					t.removed = true;
				});
				setTimeout(() => this.$nextTick(() =>{
					this.terms.forEach((t, i, a) => {
						if (terms.indexOf(t) > -1) {
							t.pos *= -1;
						}
					});
					this.strikes.forEach((s, i, a) => {
						if (terms.indexOf(s) > -1) {
							s.pos *= -1;
						}
					});
				}), this.aniLength);
			},
			
			colorTerms: function(terms, colorNum) {
				terms.forEach(t => t.color = colorNum);
			},

			// Scales font down if current terms do not fit inside container
			scaleFont: function() {
				let expressWidth = this.terms.reduce((max, t) => t.pos > max ? t.pos : max, 0) + 3,
						scaledFont = Math.floor(this.$refs.container.clientWidth / expressWidth);
				this.fontSize = Math.min(scaledFont, this.maxFont);
			}
		}
	}
</script>
