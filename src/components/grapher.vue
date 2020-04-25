<template>
	<div
		:class="['comp-grapher', {'on-paper': onpaper}]"
		:style="{
			'font-size': gridSize + 'px',
			'height': canHeight + 'px'
		}"
	>
		<div ref="graphContainer">
			<canvas
				ref="canvasStatic"
				:width="canWidth"
				:height="canHeight"
			></canvas>
			<canvas
				ref="canvasDynamic"
				:width="canWidth"
				:height="canHeight"
			></canvas>

			<span
				class="label"
				v-for="l in axisLabels"
				:class="l.class"
				:style="{
					'top': l.y + 'px',
					'left': l.x + 'px',
					'text-align': l.align || 'left'
				}"
				v-html="l.text"
			></span>
			<span v-for="line in graph.lines" v-if="line.path">
				<span
					:class="['label line', { 'hide': line.alpha === 0 }]"
					:style="{
						'top': line.label.y + 'px',
						'left': line.label.x + 'px',
						'color': line.col
					}"
				>{{ line.label.text }}(x)</span>
				<span
					v-if="line.labelPoints"
					v-for="p in line.pts"
					:class="['label point', { 'hide': p.alpha === 0 }]"
					:style="{
						'top': (p.y - 20)+ 'px',
						'left': (p.x + 15) + 'px',
						'color': line.col
					}"
				>{{ p.label }}</span>
			</span>
		</div>
	</div>
</template>

<script>
	import graphData from '@/data/graphs';
	import Vue from 'vue';

	export default {
		name: 'grapher',
		props: {
			questionref: String,
			currentStep: Number,
			onpaper: Boolean
		},
		data: function() {
			return {
				gridSize: 0,
				canWidth: 10,
				canHeight: 10,
				ctxSt: null,
				ctxDy: null,
				axisLabels: [],
				graph: {},
				dynamicLines: [],
				aniTimeout: 0
			}
		},
		created: function() {
			// Consts
			this.graph = JSON.parse(JSON.stringify(graphData[this.questionref]));
			if (!this.graph) {
				console.error('No graph found for question "' + this.questionRef + '"');
			}
		},
		mounted: function() {
			// Consts
			// 	gridSize: component width / (boxes needed to draw xRange + 2 for line endings + 2 for padding (no padding for onpaper))
			// 	canWidth: component width - 2 for padding (no padding for onpaper)
			// 	canHeight: gridSize * (boxes need for yRange + 2 for line endings (2 for padding is covered by CSS))
			this.gridSize =
				this.$el.clientWidth / (
					(this.onpaper ? 2 : 4) +
					((this.graph.xRange[1] - this.graph.xRange[0]) / this.graph.xStep)
				);
			this.canWidth = Math.ceil(this.$el.clientWidth - (this.onpaper ? 0 : 2 * this.gridSize));
			this.canHeight = Math.ceil(this.gridSize * (2 + ((this.graph.yRange[1] - this.graph.yRange[0]) / this.graph.yStep)));
			this.FONTITALIC = 'italic 16px "PT serif"';
			this.COLOR = ['#1e90ff', '#02ea00', '#fe1eff', '#ff8d1e'];
			this.POINTRAD = this.onpaper ? 4 : 5;
			this.ANISTEPLENGTH = 14;
			this.FRAMELENGTH = 40;
			
			// Init Canvases
			this.ctxSt = this.$refs.canvasStatic.getContext('2d');
			this.ctxDy = this.$refs.canvasDynamic.getContext('2d');

			this.$nextTick(() => {
				this.drawAxis();
				this.graph.lines = this.graph.lines.map((l, i) => this.toFormattedLine(l, i));
				this.graph.lines
					.filter(l => !l.step)
					.forEach(l => this.drawLine(l, true));
				this.dynamicLines = this.graph.lines.filter(l => l.step);
			});
		},
		watch: {
			currentStep: function(stepVal) {
				this.animate();
			}
		},
		methods: {
			// Screen Pixel to Graph Space transformation
			toGridSpace: function(ctx) {
				ctx.transform(
					this.gridSize / this.graph.xStep,
					0, 0,
					this.gridSize / this.graph.yStep * -1,
					0, ctx.canvas.height
				);
				ctx.translate(
					-this.graph.xRange[0] + this.graph.xStep,
					-this.graph.yRange[0] + this.graph.yStep
				);
			},

			// Value or Point to graph space
			// 	(4, 'x' | 'y') => 4 in x-axis | y-axis graph space
			// 	(4, 3) | ([4, 3]) | ({x: 4, y: 3}) => { x: 4 in graph space, y: 3 in grid space }
			toPixel: function(val, axis) {
				if (typeof axis === 'number') {
					return {
						x: this.toPixel(val, 'x'),
						y: this.toPixel(axis, 'y')
					}
				} else if (typeof val === 'object') {
					return {
						x: this.toPixel(val.x || val[0], 'x'),
						y: this.toPixel(val.y || val[1], 'y')
					}
				} else {
					let offset = -1 * this.graph[axis + 'Range'][0],
							gridScale = this.graph[axis + 'Step'];
					let pixel = ((val + offset) * (this.gridSize / gridScale)) + this.gridSize;

					return Math.round(axis === 'y' ? this.ctxSt.canvas.height - pixel : pixel);
				}
			},
			
			toFormattedLine: function(line, lIndex) {
				// Interpolate
				let tension = 0.6,
						segments = 3,
						_pts = line.pts.reduce((arr, p) => [...arr, p[0], p[1]], []);
				_pts.unshift(line.pts[0][0], line.pts[0][1]);
				_pts.push(line.pts[line.pts.length - 1][0], line.pts[line.pts.length - 1][1]);

				let path = [this.toPixel(line.pts[0])];
				for (let i = 2; i < _pts.length - 4; i += 2) {
					for (let t = 0; t <= segments; t++) {
						let t1x = (_pts[i + 2] - _pts[i - 2]) * tension,
								t2x = (_pts[i + 4] - _pts[i]) * tension,
								t1y = (_pts[i + 3] - _pts[i - 1]) * tension,
								t2y = (_pts[i + 5] - _pts[i + 1]) * tension,
								st = t / segments,
								c1 =   2 * Math.pow(st, 3)  - 3 * Math.pow(st, 2) + 1,
								c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2),
								c3 =       Math.pow(st, 3)  - 2 * Math.pow(st, 2) + st, 
								c4 =       Math.pow(st, 3)  -     Math.pow(st, 2),
								x = c1 * _pts[i]			+ c2 * _pts[i + 2] + c3 * t1x + c4 * t2x,
								y = c1 * _pts[i + 1]  + c2 * _pts[i + 3] + c3 * t1y + c4 * t2y;
						path.push(this.toPixel(x, y));
					}
				}

				let formattedLine = {
					path: path,
					col: this.onpaper ? '#000' : this.COLOR[lIndex],
					step: line.step,
					alpha: line.step ? 0 : 1,
					labelPoints: !line.noPtsLabel
				};

				if (line.label) {
					let labeledPt = this.toPixel(line.pts[Math.floor(line.pts.length / 2)]);
					formattedLine.label = {
						x: labeledPt.x + 40,
						y: labeledPt.y,
						text: line.label
					};
				}

				formattedLine.pts = line.pts.map(p => {
					return {
						x: this.toPixel(p[0], 'x'),
						y: this.toPixel(p[1], 'y'),
						label: `(${p[0]}, ${p[1]})`,
						alpha: line.step ? 0 : 1
					};
				});

				return formattedLine;
			},
			
			drawAxis: function() {
				let c = this.ctxSt;
				
				// Axis
				c.save();
					c.beginPath();
					this.toGridSpace(c);
					c.moveTo(this.graph.xRange[0] - (this.graph.xStep / 2), 0);
					c.lineTo(this.graph.xRange[1] + (this.graph.xStep / 2), 0);
					c.moveTo(0, this.graph.yRange[0] - (this.graph.yStep / 2));
					c.lineTo(0, this.graph.yRange[1] + (this.graph.yStep / 2));
				c.restore();
				c.stroke();
				
				// X Ticks
				let xTrans = this.gridSize,
						yTrans = this.toPixel(0, 'y'),
						numTicks = (this.graph.xRange[1] - this.graph.xRange[0]) / (this.graph.xStep * this.graph.xLabelInc);
				c.font = this.FONTITALIC;
				c.beginPath();
					for (let i = 0; i <= numTicks; i++) {
						let label = this.graph.xRange[0] + (i * this.graph.xStep * this.graph.xLabelInc);
						if (label !== 0) {
							c.moveTo(xTrans, yTrans - 5);
							c.lineTo(xTrans, yTrans + 5);
							this.axisLabels.push({
								x: xTrans,
								y: yTrans + 16,
								text: label,
								align: 'center'
							});
						}
						xTrans += this.gridSize * this.graph.xLabelInc;
					}
				c.stroke();
				// X Line Ending
				xTrans -= (this.gridSize * this.graph.xLabelInc) - (this.gridSize / 2);
				c.beginPath();
					c.lineTo(xTrans, yTrans - 5);
					c.lineTo(xTrans + 10, yTrans);
					c.lineTo(xTrans, yTrans+ 5);
				c.fill();
				c.fillText('x', xTrans, yTrans - 10);
				
				// Y Line Ending
				xTrans = this.toPixel(0, 'x');
				yTrans = this.gridSize / 2;
				c.beginPath();
					c.lineTo(xTrans - 5, yTrans);
					c.lineTo(xTrans, yTrans - 10);
					c.lineTo(xTrans + 5, yTrans);
				c.fill();
				c.fillText('y', xTrans + 14, yTrans);
				// Y Ticks
				yTrans += this.gridSize / 2;
				numTicks = (this.graph.yRange[1] - this.graph.yRange[0]) / (this.graph.yStep * this.graph.yLabelInc);
				c.beginPath();
					for (let i = 0; i <= numTicks; i++) {
						let label = this.graph.yRange[1] - (i * this.graph.yStep * this.graph.yLabelInc);
						if (label !== 0) {
							c.moveTo(xTrans - 5, yTrans);
							c.lineTo(xTrans + 5, yTrans);
							this.axisLabels.push({
								x: xTrans - 30,
								y: yTrans,
								text: label,
								align: 'right'
							});
						}
						yTrans += this.gridSize * this.graph.yLabelInc
					}
				c.stroke();
			},
			
			drawLine: function(line, isStatic = false) {
				let c = isStatic ? this.ctxSt : this.ctxDy;
				c.save();
					// Line
					c.beginPath();
						line.path.forEach(p => {
							c.lineTo(p.x, p.y)
						});
					c.strokeStyle = line.col;
					c.fillStyle = line.col;
					c.globalAlpha = line.alpha;
					c.stroke();

					// Points
					c.strokeStyle = '#fff';
					c.lineWidth = 2;
					line.pts.forEach(p => {
						c.beginPath();
							c.arc(p.x, p.y, this.POINTRAD, 0, Math.PI * 2);
							c.globalAlpha = p.alpha;
						c.fill();
						c.stroke();
					});
				c.restore();
			},

			animate: function(frame, lines, aniData) {
				if (!frame) {
					clearTimeout(this.aniTimeout);
					lines = [];
					aniData = {
						length: 1,
						lineStart: [],
					};
					let lineStartOffset = 0;
					this.dynamicLines.forEach(l => {
						l.alpha = 0;
						l.pts.forEach(p => p.alpha = 0)
					});
					this.dynamicLines
						.filter(l => l.step <= this.currentStep && (!l.endStep || l.endStep > this.currentStep))
						.forEach((l, lIndex) => {
							if (l.step === this.currentStep) {
								aniData.length += l.pts.length + 1;
								aniData.lineStart[lIndex] = lineStartOffset;
								lineStartOffset++;
							} else {
								aniData.lineStart[lIndex] = -1;
							}
							lines.push(l);
						});
					if (lines.length == 0) {
						this.ctxDy.clearRect(0, 0, this.ctxDy.canvas.width, this.ctxDy.canvas.height);
						this.dynamicLines.forEach(l => this.drawLine(l));
					} else {
						this.aniTimeout = setTimeout(() => {
							this.animate(1, lines, aniData)
						}, this.ANISTEPLENGTH * this.FRAMELENGTH);
					}
				} else {
					this.ctxDy.clearRect(0, 0, this.ctxDy.canvas.width, this.ctxDy.canvas.height);
					let aniStep = frame / this.ANISTEPLENGTH,
							alpha = Math.ceil(-100 * ((Math.cos(Math.PI * (aniStep % 1)) - 1) / 2)) / 100;

					lines.forEach((l, i) => {
						let start = aniData.lineStart[i];
						if (start === -1 && aniStep <= 1) {
							l.alpha = alpha;
							l.pts.forEach(p => {
								p.alpha = alpha;
							});
						} else {
							let end = start + l.pts.length + 1;
							if (aniStep >= start && aniStep < end) {
								let p = Math.floor(aniStep - start);
								if (l.pts[p]) {
									l.pts[p].alpha = alpha;
								} else {
									l.alpha = alpha;
								}
							}
						}
					});

					lines.forEach(l => this.drawLine(l));

					if (frame < this.ANISTEPLENGTH * aniData.length) {
						this.aniTimeout = setTimeout(() => {
							this.animate(frame + 1, lines, aniData);
						}, this.FRAMELENGTH);
					} else {
						this.$emit('stepend', this.currentStep)
					}
				}
			},
		}
	};
</script>

<style scoped lang="scss">
	.comp-grapher {
		border: 1px solid $c-border;
		color: $c-font;
		font-family: $f-math;
		padding: 1em;
		background:
			linear-gradient($c-border, transparent 1px),
			linear-gradient(90deg, $c-border, transparent 1px);
		background-size: 1em 1em;

		&.on-paper {
			padding: 0;
			border-width: 0 1px 1px 0;
		}

		&>div {
			position: relative;
			
			canvas {
				position: absolute;
				top: 0;
				left: 0;
				
				&:nth-child(1) {
					z-index: 1;
				}
				&:nth-child(2) {
					z-index: 2;
				}
			}

			.label {
				position: absolute;
				font-size: $f-size-sm;
				z-index: 3;
				height: 1em;
				width: 36px;
				line-height: 12px;
				transform: translate(-18px, -6px);
				opacity: 1;
				transition: opacity $l-ani ease;

				&.line, &.point {
					background: transparentize($c-bg, 0.3);
				}

				&.line {
					font-size: $f-size-lg;
				}

				&.point {
					text-align: right;
					font-size: $f-size-md;
					white-space: nowrap;
				}

				&.line.hide,
				&.point.hide {
					opacity: 0;
				}
			}
		}
	}
</style>