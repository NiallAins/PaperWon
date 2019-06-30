<template>
	<div class="comp-grapher">
		<input
			type="text"
			ref="functionInput"
			value="x^3 + 5x - 7 = y"
			@keyup.13="graphInput()"
		/>
		<div ref="canContain" class="canContain">
			<canvas ref="canStatic"></canvas>
			<canvas ref="can"></canvas>
		</div>
	</div>
</template>

<style scoped lang="scss">
	input {
		margin: 10px;
		font-size: 16px;
	}
	.canContain {
		position: relative;
	}
	canvas {
		position: absolute;
		left: 0;
		top: 0;
	}
	[ref=canStatic] {
		pointer-events: none;
	}
</style>

<script>
	export default {
		name: 'grapher',
		props: {
			msg: String
		},
		data: function() {
			return {
				can: null,
				canContain: null,
				ctx: null,
				cRad: 0,
				fontBg: '13px "Times New Roman"',
				fontSm: '13px "Times New Roman"',
				mouse: {
					x: 0,
					y: 0,
					press : false,
					down: false,
					up: false,
					hover: false
				},
				grid: {
					domain : {
						x: [-5, 5],
						y: [-5, 5],
					},
					tickFreq : 5,
					scale : {},
					phase : {}
				},
				curvePts: []
			}
		},
		mounted : function() {
			// Init canvas
			this.can = this.$refs.can;
			this.canContain = this.$refs.canContain;
			this.ctx = this.can.getContext('2d');
			this.cRad = this.canContain.clientWidth * 0.4;
			this.can.width = this.can.height = this.cRad * 2;
			this.ctx.translate(this.cRad + 0.5, this.cRad + 0.5);
			this.ctx.font = this.fontSm;

			// Init secondary static canvas
			this.canSt = this.$refs.canStatic;
			this.ctxSt = this.canSt.getContext('2d');
			this.canSt.width = this.canSt.height = this.cRad * 2;
			this.ctxSt.translate(this.cRad + 0.5, this.cRad + 0.5);

			// Init mouse Listeners
			this.can.onmousemove = (e) => {
				this.mouse.x = e.clientX - this.cRad - this.canContain.offsetLeft;
				this.mouse.y = e.clientY - this.cRad - this.canContain.offsetTop;
				this.mouse.hover = true;
			};
			this.can.onmousedown = e => {
				this.mouse.down = true;
				this.mouse.press = true;
			};
			this.can.onmouseup = e => {
				this.mouse.up = true;
				this.mouse.press = false;
			};
			this.can.onmouseleave = e => {
				this.mouse.up = true;
				this.mouse.press = false;
				this.mouse.hover = false;
			};

			this.updateGridTransforms();
			this.refreshGraph();
		},
		methods: {
			// Helper functions
			format: function(n) {
				return Math.round(n * 10) / 10;
			},

			lineLength: function(pts) {
				return pts.reduce((t, p, i, a) => {
					if (i === 0) {
						return 0;
					} else {
						return t + (
							Math.pow(p.x - a[i - 1].x, 2) +
							Math.pow(p.y - a[i - 1].y, 2)
						);
					}
				}, 0);
			},

			// Function text input
			graphInput: function() {
				let value = this.$refs.functionInput.value;
				this.curvePts = this.toCurvePoints(value);
				if (this.curvePts) {
					this.drawCurves(); 
				}
			},

			//Gets scale and translation of grid co-ordiantes relatuve to canvas pixels
			updateGridTransforms: function() {
				this.grid.scale = {
					x: (this.grid.domain.x[1] - this.grid.domain.x[0]) / 2,
					y: (this.grid.domain.y[1] - this.grid.domain.y[0]) / 2
				};
				this.grid.phase = {
					x: (this.grid.domain.x[1] + this.grid.domain.x[0]) / 2,
					y: (this.grid.domain.y[1] + this.grid.domain.y[0]) / 2
				};
			},

			//Gets grid co-ordinate of canvas pixel
			toGridDomain: function(canX, canY) {
				return {
					x: this.grid.phase.x + (this.grid.scale.x * (canX / this.cRad)),
					y: (this.grid.phase.y + (this.grid.scale.y * (canY / this.cRad))) * -1
				};
			},

			// Grid, Labels, Mouse Axis
			drawAxis: function() {
				this.ctx.save();

				// Primary Axis
				this.ctx.beginPath();
					this.ctx.strokeStyle = '#333';
					this.ctx.moveTo(-this.cRad, 0);
					this.ctx.lineTo(this.cRad, 0);
					this.ctx.moveTo(0, -this.cRad);
					this.ctx.lineTo(0, this.cRad);
				this.ctx.stroke();
				
				// Grid & Labels
				this.ctx.fillStyle = this.mouse.hover ? '#bbb' : '#333';
				this.ctx.strokeStyle = '#ddd';
				let tickSpacing = this.cRad / this.grid.tickFreq;
				for (let tick = -this.cRad + tickSpacing; tick < this.cRad; tick += tickSpacing) {
					let label = this.toGridDomain(tick, tick);
					if (Math.abs(tick) > 0.01) {
						this.ctx.beginPath();
							this.ctx.moveTo(-this.cRad, tick);
							this.ctx.lineTo(this.cRad, tick);
							this.ctx.moveTo(tick, -this.cRad);
							this.ctx.lineTo(tick, this.cRad);
						this.ctx.stroke();
						this.ctx.textAlign = 'center';
						this.ctx.fillText(this.format(label.x), tick, 13);
						this.ctx.textAlign = 'right';
						this.ctx.fillText(this.format(label.y), -4, tick + 3);
					}
				}
				
				// Mouse Axis & Labels
				if (this.mouse.hover) {
					let label = this.toGridDomain(this.mouse.x, this.mouse.y);
					this.ctx.strokeStyle = '#777';
					this.ctx.setLineDash([2]);
					this.ctx.beginPath();
						this.ctx.moveTo(0, this.mouse.y);
						this.ctx.lineTo(this.mouse.x, this.mouse.y);
						this.ctx.moveTo(this.mouse.x, 0);
						this.ctx.lineTo(this.mouse.x, this.mouse.y);
					this.ctx.stroke();
					
					// X-Axis
					this.ctx.font = this.fontBg;
					this.ctx.save();
						if (this.mouse.y < 0) {
							this.ctx.translate(0, 20);
						}
						this.ctx.fillStyle = '#fff';
						this.ctx.fillRect(this.mouse.x - 22, -18, 44, 14);
						this.ctx.fillStyle = '#333';
						this.ctx.textAlign = 'center';
						this.ctx.fillText((label.x).toFixed(1), this.mouse.x, -8);
					this.ctx.restore();
					
					// Y-Axis
					this.ctx.fillStyle = '#fff';
					if (this.mouse.x < 0) {
						this.ctx.fillRect(6, this.mouse.y - 12, 42, 24);
						this.ctx.textAlign = 'left';
						this.ctx.translate(14, 0);
					} else {
						this.ctx.textAlign = 'right';
						this.ctx.fillRect(-2, this.mouse.y - 12, -42, 24);
					}
					this.ctx.fillStyle = '#333';
					this.ctx.fillText((label.y).toFixed(1), -4, this.mouse.y + 2);
					this.ctx.font = this.fontSm;
				}
				
				this.ctx.restore();
			}, 

			// Gets points of curve defined by math fucntion
			toCurvePoints: function(input) {
				// Test Validity
				input = input.replace(/ /g,'');
				if (!input.match(/^[^=]+=[^=]+$/)) {
					return;
				}
				// Convert Math to JS Code
				input = input
					.replace(/(-?[0-9.]+|\(.+?\))(x|y)/g, '($1*$2)')
					.replace(/(\(.+?\)|[0-9.xy]+)\^(-?([0-9.xy]+))/g, 'Math.pow($1,$2)')
					.replace(/(a?(sin|cos|tan))/g, 'Math.$1');
				// Convert "x = y" to "abs(x - y) <= 1px"
				input =
					('Math.abs((' + input.replace('=', ')-(') + '))<=' + (this.grid.scale.x / (this.cRad * 2)))
					.replace(/x/g, 'pt.x')
					.replace(/y/g, 'pt.y');
				// Test Validity
				try {
					eval(input.replace(/pt\.[xy]/g, '0'));
				} catch {
					return;
				}
				
				let pts = [], pt;
				//Get Roots
				// for (let canX = -this.cRad; canX <= this.cRad; canX++) {
				// 	pt = this.toGridDomain(canX, 0);
				// 	if (eval(input)) {
				// 		pts.push({x: canX, y: 0});
				// 	}
				// }
				// for (let canY = -this.cRad; canY <= this.cRad; canY++) {
				// 	pt = this.toGridDomain(0, canY);
				// 	if (eval(input)) {
				// 		pts.push({x: 0, y: canY});
				// 	}
				// }
				// Get all other points on curve
				let c = 0;
				for (let canX = -this.cRad; canX <= this.cRad; canX++) {
					for (let canY = -this.cRad; canY <= this.cRad; canY++) {
						pt = this.toGridDomain(canX, canY);
						c++;
						if (eval(input)) {
							pts.push({x: canX, y: canY});
						}
					}
				}
				console.log('hey');
				console.log(c);
				
				// Order points in line
				let dis = this.lineLength(pts);
				pts.sort((a, b) => a.y - b.y);
				let vertDis = this.lineLength(pts);
				if (dis < vertDis) {
					pts.sort((a, b) => a.x - b.x);
				}
				
				// if (pts.length > 1) {
				// 	// Extrapolate curve ends to extend beyond grid
				// 	let startAng = Math.atan2(
				// 		pts[0].y - pts[1].y,
				// 		pts[0].x - pts[1].x
				// 	);
				// 	pts.unshift({
				// 		x: pts[0].x + (Math.cos(startAng) * 1000),
				// 		y: pts[0].y + (Math.sin(startAng) * 1000)
				// 	});
				// 	let lastPt = pts.length - 1,
				// 			endAng = Math.atan2(
				// 				pts[lastPt].y - pts[lastPt - 1].y,
				// 				pts[lastPt].x - pts[lastPt - 1].x
				// 			);
				// 	pts.push({
				// 		x: pts[lastPt].x + (Math.cos(endAng) * 1000),
				// 		y: pts[lastPt].y + (Math.sin(endAng) * 1000)
				// 	});
						
					return pts;
				//}
			},

			// Draw curves to static canvas
			drawCurves: function() {
				this.ctxSt.clearRect(-this.cRad - 1, -this.cRad - 1, this.cRad * 3, this.cRad * 3);
				this.ctxSt.beginPath();
					this.curvePts.forEach(p => this.ctxSt.lineTo(p.x, p.y));
				this.ctxSt.strokeStyle = 'dodgerblue';
				this.ctxSt.lineWidth = 2;
				this.ctxSt.stroke();
			},

			// Animation loop
			refreshGraph: function() {
				this.ctx.clearRect(-this.cRad - 1, -this.cRad - 1, this.cRad * 3, this.cRad * 3);

				this.drawAxis();
				
				this.mouse.up = false;
				this.mouse.down = false;
				
				window.requestAnimationFrame(this.refreshGraph);
			}
		}
	}
</script>
